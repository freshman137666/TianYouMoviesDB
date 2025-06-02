-- =============================================
-- 复杂存储过程和触发器实现
-- 天佑电影票务系统
-- =============================================
USE tianyoudb;
DELIMITER // -- =============================================
-- 1. 定时处理过期团购票订单的存储过程
-- =============================================
-- 主存储过程：处理过期团购票订单
CREATE PROCEDURE SP_Process_Expired_Group_Ticket_Orders() proc_label: BEGIN
DECLARE done INT DEFAULT FALSE;
DECLARE v_order_id INT;
DECLARE v_purchased_ticket_id INT;
DECLARE v_user_id INT;
DECLARE v_order_status VARCHAR(20);
DECLARE v_ticket_count INT;
DECLARE v_expiry_date DATE;
DECLARE processed_count INT DEFAULT 0;
DECLARE cancelled_count INT DEFAULT 0;
DECLARE refunded_count INT DEFAULT 0;
-- 声明游标，查找所有过期的团购票订单
DECLARE expired_orders_cursor CURSOR FOR
SELECT DISTINCT o.order_id,
    o.purchased_ticket_id,
    o.user_id,
    o.status,
    pgt.ticket_count,
    pgt.expiry_date
FROM `Order` o
    JOIN PurchasedGroupTicket pgt ON o.purchased_ticket_id = pgt.purchased_ticket_id
WHERE o.purchase_type = 'group'
    AND pgt.expiry_date < CURDATE()
    AND o.status IN ('待定', '已支付')
    AND pgt.status = '已付';
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
-- 异常处理
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
RESIGNAL;
END;
START TRANSACTION;
-- 首先标记过期的团购票为已过期
UPDATE PurchasedGroupTicket
SET status = '已过期'
WHERE expiry_date < CURDATE()
    AND status = '已付';
-- 处理相关的订单
OPEN expired_orders_cursor;
process_loop: LOOP FETCH expired_orders_cursor INTO v_order_id,
v_purchased_ticket_id,
v_user_id,
v_order_status,
v_ticket_count,
v_expiry_date;
IF done THEN LEAVE process_loop;
END IF;
SET processed_count = processed_count + 1;
-- 根据订单状态进行不同处理
CASE
    v_order_status
    WHEN '待定' THEN -- 待定订单直接取消
    UPDATE `Order`
    SET status = '已取消',
        ticket_status = '已过期'
    WHERE order_id = v_order_id;
-- 释放相关座位
CALL SP_Release_Order_Seats(v_order_id);
SET cancelled_count = cancelled_count + 1;
WHEN '已支付' THEN -- 已支付订单需要退款处理
CALL SP_Auto_Refund_Expired_Order(v_order_id, v_user_id);
-- 更新订单状态
UPDATE `Order`
SET status = '已取消',
    ticket_status = '已过期'
WHERE order_id = v_order_id;
-- 释放相关座位
CALL SP_Release_Order_Seats(v_order_id);
SET refunded_count = refunded_count + 1;
END CASE
;
-- 记录处理日志
INSERT INTO SystemLog (log_type, log_content, create_time)
VALUES (
        'EXPIRED_ORDER_PROCESS',
        CONCAT(
            '处理过期团购票订单: OrderID=',
            v_order_id,
            ', UserID=',
            v_user_id,
            ', Status=',
            v_order_status,
            ', ExpiryDate=',
            v_expiry_date
        ),
        NOW()
    );
END LOOP;
CLOSE expired_orders_cursor;
-- 清理过期的核验码
DELETE FROM Verification
WHERE order_id IN (
        SELECT o.order_id
        FROM `Order` o
            JOIN PurchasedGroupTicket pgt ON o.purchased_ticket_id = pgt.purchased_ticket_id
        WHERE pgt.status = '已过期'
            AND o.status = '已取消'
    );
COMMIT;
-- 记录处理汇总
INSERT INTO SystemLog (log_type, log_content, create_time)
VALUES (
        'EXPIRED_ORDER_SUMMARY',
        CONCAT(
            '过期团购票订单处理完成: 总处理=',
            processed_count,
            ', 取消=',
            cancelled_count,
            ', 退款=',
            refunded_count
        ),
        NOW()
    );
END // -- 子存储过程：释放订单相关座位
CREATE PROCEDURE SP_Release_Order_Seats(
    IN p_order_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255)
) proc_label: BEGIN
DECLARE v_screening_id INT;
DECLARE seat_count INT DEFAULT 0;
-- 获取订单的场次ID
SELECT screening_id INTO v_screening_id
FROM `Order`
WHERE order_id = p_order_id;
-- 释放座位并统计数量
UPDATE ScreeningSeat ss
    JOIN Verification v ON ss.screening_seat_id = v.screening_seat_id
SET ss.status = '可用',
    ss.lock_time = NULL
WHERE v.order_id = p_order_id
    AND ss.status IN ('已锁定', '已售出');
SET seat_count = ROW_COUNT();
-- 更新场次剩余座位数
IF seat_count > 0 THEN
UPDATE Screening
SET seat_remain = seat_remain + seat_count
WHERE screening_id = v_screening_id;
END IF;
END // -- 子存储过程：自动退款过期订单
CREATE PROCEDURE SP_Auto_Refund_Expired_Order(
    IN p_order_id INT,
    IN p_user_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255)
) proc_label: BEGIN
DECLARE v_cost_number DECIMAL(10, 2);
DECLARE v_payment_method VARCHAR(20);
DECLARE v_bank_card_number VARCHAR(50);
-- 获取订单信息
SELECT cost_number,
    payment_method,
    bank_card_number INTO v_cost_number,
    v_payment_method,
    v_bank_card_number
FROM `Order`
WHERE order_id = p_order_id;
-- 创建退款记录
INSERT INTO Refund (
        order_id,
        refund_amount,
        refund_time,
        refund_method,
        bank_card_number,
        reason,
        status
    )
VALUES (
        p_order_id,
        v_cost_number,
        NOW(),
        v_payment_method,
        v_bank_card_number,
        '团购票过期自动退款',
        '已完成'
    );
END // -- =============================================
-- 2. 座位和库存管理相关存储过程
-- =============================================
-- 存储过程：解锁场次座位
CREATE PROCEDURE Unlock_Screening_Seats(IN p_screening_id INT, IN p_seats JSON) proc_label: BEGIN
DECLARE i INT DEFAULT 0;
DECLARE seat_count INT;
DECLARE seat_row INT;
DECLARE seat_col INT;
DECLARE released_count INT DEFAULT 0;
SET seat_count = JSON_LENGTH(p_seats);
WHILE i < seat_count DO
SET seat_row = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].row'));
SET seat_col = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].col'));
-- 释放座位
UPDATE ScreeningSeat
SET status = '可用',
    lock_time = NULL
WHERE screening_id = p_screening_id
    AND seat_row = seat_row
    AND seat_col = seat_col
    AND status IN ('已锁定', '已售出');
IF ROW_COUNT() > 0 THEN
SET released_count = released_count + 1;
END IF;
SET i = i + 1;
END WHILE;
-- 更新场次剩余座位数
IF released_count > 0 THEN
UPDATE Screening
SET seat_remain = seat_remain + released_count
WHERE screening_id = p_screening_id;
END IF;
END // -- 存储过程：售出场次座位
CREATE PROCEDURE Sell_Screening_Seats(
    IN p_screening_id INT,
    IN p_seats JSON,
    IN p_order_id INT
) proc_label: BEGIN
DECLARE i INT DEFAULT 0;
DECLARE seat_count INT;
DECLARE seat_row INT;
DECLARE seat_col INT;
DECLARE sold_count INT DEFAULT 0;
SET seat_count = JSON_LENGTH(p_seats);
WHILE i < seat_count DO
SET seat_row = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].row'));
SET seat_col = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].col'));
-- 将座位状态更新为已售出
UPDATE ScreeningSeat
SET status = '已售出',
    lock_time = NULL
WHERE screening_id = p_screening_id
    AND seat_row = seat_row
    AND seat_col = seat_col
    AND status = '已锁定';
IF ROW_COUNT() > 0 THEN
SET sold_count = sold_count + 1;
END IF;
SET i = i + 1;
END WHILE;
END // -- 存储过程：更新团购票库存
CREATE PROCEDURE Update_Group_Ticket_Stock(
    IN p_group_ticket_id INT,
    IN p_quantity INT
) proc_label: BEGIN
DECLARE v_current_count INT;
DECLARE v_ticket_count INT;
-- 获取当前团购票信息
SELECT ticket_count INTO v_ticket_count
FROM PurchasedGroupTicket
WHERE purchased_ticket_id = p_group_ticket_id;
-- 获取当前已使用数量
SELECT IFNULL(COUNT(*), 0) INTO v_current_count
FROM `Order`
WHERE purchased_ticket_id = p_group_ticket_id
    AND status = '已支付';
-- 验证库存是否足够（用于扣减时）
IF p_quantity > 0
AND (v_current_count + p_quantity) > v_ticket_count THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = '团购票库存不足';
END IF;
-- 记录库存变更日志
INSERT INTO SystemLog (log_type, log_content, create_time)
VALUES (
        'GROUP_TICKET_STOCK',
        CONCAT(
            '团购票库存变更: TicketID=',
            p_group_ticket_id,
            ', Quantity=',
            p_quantity,
            ', CurrentUsed=',
            v_current_count
        ),
        NOW()
    );
END // -- =============================================
-- 3. 复杂触发器：订单状态变化管理
-- =============================================
-- 触发器：订单状态变化时管理座位和库存
CREATE TRIGGER Order_Manage_Stock_And_Seats_On_StatusChange
AFTER
UPDATE ON `Order` FOR EACH ROW BEGIN
DECLARE v_seats JSON;
DECLARE v_seat_count INT;
-- 检查是否是status字段被更新
IF OLD.status != NEW.status THEN -- 情况1：订单被取消
IF NEW.status = '已取消'
AND OLD.status != '已取消' THEN -- 处理常规订单的座位释放
IF OLD.purchase_type = 'regular'
AND OLD.status IN ('待定', '已支付') THEN -- 获取该订单关联的座位列表
SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'row',
            ss.seat_row,
            'col',
            ss.seat_col
        )
    ) INTO v_seats
FROM ScreeningSeat ss
    JOIN Verification v ON ss.screening_seat_id = v.screening_seat_id
WHERE v.order_id = OLD.order_id;
-- 如果有座位信息，调用释放座位存储过程
IF v_seats IS NOT NULL
AND JSON_LENGTH(v_seats) > 0 THEN CALL Unlock_Screening_Seats(OLD.screening_id, v_seats);
END IF;
-- 处理团购订单的库存恢复
ELSEIF OLD.purchase_type = 'group'
AND OLD.status IN ('已支付', '待定') THEN -- 获取订单中的票数
SELECT IFNULL(COUNT(*), 0) INTO v_seat_count
FROM Verification
WHERE order_id = OLD.order_id;
-- 恢复团购票库存（传入负数表示恢复）
IF v_seat_count > 0 THEN CALL Update_Group_Ticket_Stock(OLD.purchased_ticket_id, - v_seat_count);
END IF;
END IF;
-- 情况2：订单支付成功
ELSEIF NEW.status = '已支付'
AND OLD.status = '待定' THEN -- 处理常规订单的座位确认售出
IF NEW.purchase_type = 'regular' THEN -- 获取该订单关联的座位列表
SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'row',
            ss.seat_row,
            'col',
            ss.seat_col
        )
    ) INTO v_seats
FROM ScreeningSeat ss
    JOIN Verification v ON ss.screening_seat_id = v.screening_seat_id
WHERE v.order_id = NEW.order_id;
-- 如果有座位信息，调用售出座位存储过程
IF v_seats IS NOT NULL
AND JSON_LENGTH(v_seats) > 0 THEN CALL Sell_Screening_Seats(NEW.screening_id, v_seats, NEW.order_id);
END IF;
-- 处理团购订单的库存正式扣减
ELSEIF NEW.purchase_type = 'group' THEN -- 获取订单中的票数
SELECT IFNULL(COUNT(*), 0) INTO v_seat_count
FROM Verification
WHERE order_id = NEW.order_id;
-- 正式扣减团购票库存
IF v_seat_count > 0 THEN CALL Update_Group_Ticket_Stock(NEW.purchased_ticket_id, v_seat_count);
END IF;
END IF;
END IF;
-- 记录订单状态变更日志
INSERT INTO SystemLog (log_type, log_content, create_time)
VALUES (
        'ORDER_STATUS_CHANGE',
        CONCAT(
            '订单状态变更: OrderID=',
            NEW.order_id,
            ', OldStatus=',
            OLD.status,
            ', NewStatus=',
            NEW.status,
            ', OrderType=',
            NEW.purchase_type
        ),
        NOW()
    );
END IF;
END // -- =============================================
-- 4. 定时任务：处理过期团购票订单
-- =============================================
-- 创建定时任务，每天凌晨2点执行过期团购票订单处理
CREATE EVENT IF NOT EXISTS ev_process_expired_group_ticket_orders ON SCHEDULE EVERY 1 DAY STARTS TIMESTAMP(CURDATE() + INTERVAL 1 DAY + INTERVAL 2 HOUR) DO BEGIN CALL SP_Process_Expired_Group_Ticket_Orders();
END // -- =============================================
-- 5. 系统日志表（如果不存在）
-- =============================================
CREATE TABLE IF NOT EXISTS SystemLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL COMMENT '日志类型',
    log_content TEXT NOT NULL COMMENT '日志内容',
    create_time DATETIME NOT NULL COMMENT '创建时间',
    INDEX idx_log_type (log_type),
    INDEX idx_create_time (create_time)
) COMMENT = '系统日志表' // DELIMITER;
-- =============================================
-- 创建完成提示
-- =============================================
SELECT '复杂存储过程和触发器创建完成！' AS '状态',
    '包含定时处理过期团购票订单存储过程和订单状态变化管理触发器' AS '说明';
-- 显示创建的存储过程
SELECT ROUTINE_NAME as '存储过程名称',
    ROUTINE_TYPE as '类型',
    CREATED as '创建时间'
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_SCHEMA = 'tianyoudb'
    AND ROUTINE_NAME IN (
        'SP_Process_Expired_Group_Ticket_Orders',
        'SP_Release_Order_Seats',
        'SP_Auto_Refund_Expired_Order',
        'Unlock_Screening_Seats',
        'Sell_Screening_Seats',
        'Update_Group_Ticket_Stock'
    )
ORDER BY ROUTINE_NAME;
-- 显示创建的触发器
SELECT TRIGGER_NAME as '触发器名称',
    EVENT_MANIPULATION as '触发事件',
    EVENT_OBJECT_TABLE as '关联表',
    ACTION_TIMING as '触发时机'
FROM INFORMATION_SCHEMA.TRIGGERS
WHERE TRIGGER_SCHEMA = 'tianyoudb'
    AND TRIGGER_NAME = 'Order_Manage_Stock_And_Seats_On_StatusChange';
-- 显示创建的定时任务
SELECT EVENT_NAME as '事件名称',
    EVENT_TYPE as '事件类型',
    INTERVAL_VALUE as '间隔值',
    INTERVAL_FIELD as '间隔单位',
    STATUS as '状态'
FROM INFORMATION_SCHEMA.EVENTS
WHERE EVENT_SCHEMA = 'tianyoudb'
    AND EVENT_NAME = 'ev_process_expired_group_ticket_orders';
DELIMITER;