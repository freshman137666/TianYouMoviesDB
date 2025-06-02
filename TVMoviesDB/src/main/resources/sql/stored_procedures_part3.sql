-- 天佑电影购票网站存储过程实现 - 第三部分
-- 座位管理、团购票管理、系统管理模块
USE tianyoudb;
DELIMITER // -- ========================================
-- 6. 座位管理模块
-- ========================================
-- 主存储过程：座位管理
CREATE PROCEDURE Manage_Seats(
    IN operation_type VARCHAR(20),
    IN p_screening_id INT,
    IN p_hall_id INT,
    IN p_seat_row INT,
    IN p_seat_col INT,
    IN p_seat_type VARCHAR(10),
    IN p_price_multiplier DECIMAL(3, 2),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET result_code = -1;
SET result_msg = '操作失败，发生异常';
SET data = NULL;
END;
START TRANSACTION;
CASE
    operation_type
    WHEN 'get_seat_map' THEN CALL SP_Get_Seat_Map(p_screening_id, result_code, result_msg, data);
WHEN 'initialize_screening_seats' THEN CALL SP_Initialize_Screening_Seats(
    p_screening_id,
    p_hall_id,
    result_code,
    result_msg,
    data
);
WHEN 'update_seat_type' THEN CALL SP_Update_Seat_Type(
    p_screening_id,
    p_seat_row,
    p_seat_col,
    p_seat_type,
    p_price_multiplier,
    result_code,
    result_msg,
    data
);
WHEN 'release_expired_locks' THEN CALL SP_Release_Expired_Locks(result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET data = NULL;
END CASE
;
IF result_code = 0 THEN COMMIT;
ELSE ROLLBACK;
END IF;
END // -- 子存储过程：获取座位图
CREATE PROCEDURE SP_Get_Seat_Map(
    IN p_screening_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE seat_data JSON DEFAULT JSON_ARRAY();
DECLARE done INT DEFAULT FALSE;
DECLARE v_seat_row INT;
DECLARE v_seat_col INT;
DECLARE v_seat_type VARCHAR(10);
DECLARE v_status VARCHAR(10);
DECLARE v_price_multiplier DECIMAL(3, 2);
DECLARE v_lock_time DATETIME;
DECLARE hall_rows INT;
DECLARE hall_cols INT;
DECLARE seat_cursor CURSOR FOR
SELECT seat_row,
    seat_col,
    seat_type,
    status,
    price_multiplier,
    lock_time
FROM ScreeningSeat
WHERE screening_id = p_screening_id
ORDER BY seat_row,
    seat_col;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
-- 获取影厅信息
SELECT h.seat_rows,
    h.seat_cols INTO hall_rows,
    hall_cols
FROM Screening s
    JOIN Hall h ON s.hall_id = h.hall_id
WHERE s.screening_id = p_screening_id;
OPEN seat_cursor;
read_loop: LOOP FETCH seat_cursor INTO v_seat_row,
v_seat_col,
v_seat_type,
v_status,
v_price_multiplier,
v_lock_time;
IF done THEN LEAVE read_loop;
END IF;
SET seat_data = JSON_ARRAY_APPEND(
        seat_data,
        '$',
        JSON_OBJECT(
            'row',
            v_seat_row,
            'col',
            v_seat_col,
            'type',
            v_seat_type,
            'status',
            v_status,
            'price_multiplier',
            v_price_multiplier,
            'lock_time',
            v_lock_time
        )
    );
END LOOP;
CLOSE seat_cursor;
SET result_code = 0;
SET result_msg = '获取座位图成功';
SET data = JSON_OBJECT(
        'screening_id',
        p_screening_id,
        'hall_rows',
        hall_rows,
        'hall_cols',
        hall_cols,
        'seats',
        seat_data
    );
END // -- 子存储过程：初始化场次座位
CREATE PROCEDURE SP_Initialize_Screening_Seats(
    IN p_screening_id INT,
    IN p_hall_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE hall_rows INT;
DECLARE hall_cols INT;
DECLARE total_seats INT;
DECLARE current_row INT DEFAULT 1;
DECLARE current_col INT DEFAULT 1;
DECLARE seat_type VARCHAR(10);
DECLARE price_multiplier DECIMAL(3, 2);
-- 获取影厅信息
SELECT seat_rows,
    seat_cols INTO hall_rows,
    hall_cols
FROM Hall
WHERE hall_id = p_hall_id;
IF hall_rows IS NULL THEN
SET result_code = -1;
SET result_msg = '影厅不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查是否已经初始化
SELECT COUNT(*) INTO total_seats
FROM ScreeningSeat
WHERE screening_id = p_screening_id;
IF total_seats > 0 THEN
SET result_code = -1;
SET result_msg = '场次座位已经初始化';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 初始化所有座位
WHILE current_row <= hall_rows DO
SET current_col = 1;
WHILE current_col <= hall_cols DO -- 根据位置确定座位类型和价格倍数
IF current_row <= 3 THEN
SET seat_type = '前排';
SET price_multiplier = 0.80;
ELSEIF current_row >= hall_rows - 2 THEN
SET seat_type = '后排';
SET price_multiplier = 1.00;
ELSEIF current_col <= 2
OR current_col >= hall_cols - 1 THEN
SET seat_type = '边座';
SET price_multiplier = 0.90;
ELSE
SET seat_type = '标准';
SET price_multiplier = 1.00;
END IF;
-- 插入座位记录
INSERT INTO ScreeningSeat (
        screening_id,
        seat_row,
        seat_col,
        seat_type,
        status,
        price_multiplier,
        lock_time
    )
VALUES (
        p_screening_id,
        current_row,
        current_col,
        seat_type,
        '可用',
        price_multiplier,
        NULL
    );
SET current_col = current_col + 1;
END WHILE;
SET current_row = current_row + 1;
END WHILE;
SET total_seats = hall_rows * hall_cols;
-- 更新场次剩余座位数
UPDATE Screening
SET seat_remain = total_seats
WHERE screening_id = p_screening_id;
SET result_code = 0;
SET result_msg = '场次座位初始化成功';
SET data = JSON_OBJECT(
        'screening_id',
        p_screening_id,
        'total_seats',
        total_seats,
        'hall_rows',
        hall_rows,
        'hall_cols',
        hall_cols
    );
END // -- 子存储过程：更新座位类型
CREATE PROCEDURE SP_Update_Seat_Type(
    IN p_screening_id INT,
    IN p_seat_row INT,
    IN p_seat_col INT,
    IN p_seat_type VARCHAR(10),
    IN p_price_multiplier DECIMAL(3, 2),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE v_count INT DEFAULT 0;
DECLARE current_status VARCHAR(10);
-- 检查座位是否存在
SELECT COUNT(*),
    status INTO v_count,
    current_status
FROM ScreeningSeat
WHERE screening_id = p_screening_id
    AND seat_row = p_seat_row
    AND seat_col = p_seat_col;
IF v_count = 0 THEN
SET result_code = -1;
SET result_msg = '座位不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
IF current_status != '可用' THEN
SET result_code = -2;
SET result_msg = '座位状态不允许修改类型';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新座位类型和价格倍数
UPDATE ScreeningSeat
SET seat_type = p_seat_type,
    price_multiplier = p_price_multiplier
WHERE screening_id = p_screening_id
    AND seat_row = p_seat_row
    AND seat_col = p_seat_col;
SET result_code = 0;
SET result_msg = '座位类型更新成功';
SET data = JSON_OBJECT(
        'screening_id',
        p_screening_id,
        'seat_row',
        p_seat_row,
        'seat_col',
        p_seat_col,
        'seat_type',
        p_seat_type,
        'price_multiplier',
        p_price_multiplier
    );
END // -- 子存储过程：释放过期锁定
CREATE PROCEDURE SP_Release_Expired_Locks(
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE released_count INT DEFAULT 0;
-- 释放过期锁定的座位
UPDATE ScreeningSeat
SET status = '可用',
    lock_time = NULL
WHERE status = '已锁定'
    AND lock_time < DATE_SUB(NOW(), INTERVAL 15 MINUTE);
SET released_count = ROW_COUNT();
SET result_code = 0;
SET result_msg = CONCAT('成功释放 ', released_count, ' 个过期锁定座位');
SET data = JSON_OBJECT('released_count', released_count);
END // -- ========================================
-- 7. 团购票管理模块
-- ========================================
-- 主存储过程：团购票票
CREATE PROCEDURE Manage_GroupTickets(
    IN p_operation_type VARCHAR(20),
    IN p_user_id INT,
    IN p_type_id INT,
    IN p_ticket_count INT,
    IN p_payment_method VARCHAR(20),
    IN p_payment_card VARCHAR(50),
    IN p_purchase_ticket_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
SET result_code = -1;
SET result_msg = '操作失败，发生SQL异常';
SET data = NULL;
END;
START TRANSACTION;
CASE
    p_operation_type
    WHEN 'get_available_types' THEN CALL SP_Get_Available_Group_TicketTypes(result_code, result_msg, data);
WHEN 'purchase' THEN CALL SP_Purchase_GroupTickets(
    p_user_id,
    p_type_id,
    p_ticket_count,
    p_payment_method,
    p_payment_card,
    result_code,
    result_msg,
    data
);
WHEN 'get_user_tickets' THEN CALL SP_Get_User_Group_Tickets(p_user_id, result_code, result_msg, data);
WHEN 'get_ticket_details' THEN CALL SP_Get_Group_TicketDetails(
    p_purchase_ticket_id,
    result_code,
    result_msg,
    data
);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET data = NULL;
END CASE
;
IF result_code = 0 THEN COMMIT;
ELSE ROLLBACK;
END IF;
END // -- 子存储过程：获取可用团购票类型
CREATE PROCEDURE SP_Get_Available_Group_TicketTypes(
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE ticket_types JSON DEFAULT JSON_ARRAY();
DECLARE v_done INT DEFAULT FALSE;
DECLARE v_type_id INT;
DECLARE v_type_name VARCHAR(50);
DECLARE v_unit_price DECIMAL(10, 2);
DECLARE v_validity_days INT;
DECLARE v_usage_restrictions TEXT;
DECLARE v_is_active BOOLEAN;
DECLARE type_cursor CURSOR FOR
SELECT type_id,
    type_name,
    unit_price,
    validity_days,
    usage_restrictions,
    is_active
FROM Group_TicketType
WHERE is_active = TRUE
ORDER BY type_id;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET v_done = TRUE;
OPEN type_cursor;
read_loop: LOOP FETCH type_cursor INTO v_type_id,
v_type_name,
v_unit_price,
v_validity_days,
v_usage_restrictions,
v_is_active;
IF v_done THEN LEAVE read_loop;
END IF;
SET ticket_types = JSON_ARRAY_APPEND(
        ticket_types,
        '$',
        JSON_OBJECT(
            'type_id',
            v_type_id,
            'type_name',
            v_type_name,
            'unit_price',
            v_unit_price,
            'validity_days',
            v_validity_days,
            'usage_restrictions',
            v_usage_restrictions,
            'is_active',
            v_is_active
        )
    );
END LOOP;
CLOSE type_cursor;
SET result_code = 0;
SET result_msg = '获取团购票类型成功';
SET data = JSON_OBJECT('ticket_types', ticket_types);
END // -- 子存储过程：购买团购票
CREATE PROCEDURE SP_Purchase_GroupTickets(
    IN p_user_id INT,
    IN p_type_id INT,
    IN p_ticket_count INT,
    IN p_payment_method VARCHAR(20),
    IN p_payment_card VARCHAR(50),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE v_type_exists INT DEFAULT 0;
DECLARE v_unit_price DECIMAL(10, 2);
DECLARE v_validity_days INT;
DECLARE v_total_cost DECIMAL(10, 2);
DECLARE v_expiry_date DATE;
DECLARE new_purchased_ticket_id INT;
-- 检查团购票类型是否存在且有效
SELECT COUNT(*),
    unit_price,
    validity_days INTO v_type_exists,
    v_unit_price,
    v_validity_days
FROM Group_TicketType
WHERE type_id = p_type_id
    AND is_active = TRUE;
IF v_type_exists = 0 THEN
SET result_code = -1;
SET result_msg = '团购票类型不存在或已停用';
SET data = NULL;
LEAVE proc_label;
END IF;
IF p_ticket_count <= 0 THEN
SET result_code = -2;
SET result_msg = '购买数量必须大于0';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 计算总价和到期日期
SET v_total_cost = v_unit_price * p_ticket_count;
SET v_expiry_date = DATE_ADD(CURRENT_DATE, INTERVAL v_validity_days DAY);
-- 插入购买记录
INSERT INTO Purchased_Group_Ticket(
        user_id,
        type_id,
        ticket_count,
        total_cost,
        purchase_time,
        expiry_date,
        payment_method,
        bank_card_number,
        status
    )
VALUES (
        p_user_id,
        p_type_id,
        p_ticket_count,
        v_total_cost,
        CURRENT_TIMESTAMP,
        v_expiry_date,
        p_payment_method,
        p_payment_card,
        '已支付'
    );
SET new_purchased_ticket_id = LAST_INSERT_ID();
SET result_code = 0;
SET result_msg = '团购票购买成功';
SET data = JSON_OBJECT(
        'purchased_id',
        new_purchased_ticket_id,
        'ticket_count',
        p_ticket_count,
        'total_cost',
        v_total_cost,
        'expiry_date',
        v_expiry_date
    );
END // -- 子存储过程：获取用户团购票
CREATE PROCEDURE SP_Get_User_Group_Tickets(
    IN p_user_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE v_tickets JSON DEFAULT JSON_ARRAY();
DECLARE v_done INT DEFAULT FALSE;
DECLARE v_purchased_id INT;
DECLARE v_type_name VARCHAR(50);
DECLARE v_ticket_count INT;
DECLARE v_used_count INT;
DECLARE v_total_cost DECIMAL(10, 2);
DECLARE v_purchase_time DATETIME;
DECLARE v_expiry_date DATE;
DECLARE v_status VARCHAR(10);
DECLARE ticket_cursor CURSOR FOR
SELECT pgt.purchased_group_ticket_id,
    gtt.type_name,
    pgt.ticket_count,
    IFNULL(
        (
            SELECT COUNT(*)
            FROM Order_Ticket ot
            WHERE ot.purchased_group_ticket_id = pgt.purchased_group_ticket_id
                AND ot.order_status = '已支付'
        ),
        0
    ) AS used_count,
    pgt.total_cost,
    pgt.purchase_time,
    pgt.expiry_date,
    pgt.status
FROM Purchased_Group_Ticket pgt
    JOIN Group_TicketType gtt ON pgt.type_id = gtt.type_id
WHERE pgt.user_id = p_user_id
ORDER BY pgt.purchase_time DESC;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET v_done = TRUE;
OPEN ticket_cursor;
read_loop: LOOP FETCH ticket_cursor INTO v_purchased_id,
v_type_name,
v_ticket_count,
v_used_count,
v_total_cost,
v_purchase_time,
v_expiry_date,
v_status;
IF v_done THEN LEAVE read_loop;
END IF;
SET v_tickets = JSON_ARRAY_APPEND(
        v_tickets,
        '$',
        JSON_OBJECT(
            'purchased_id',
            v_purchased_id,
            'type_name',
            v_type_name,
            'ticket_count',
            v_ticket_count,
            'used_count',
            v_used_count,
            'remaining_count',
            v_ticket_count - v_used_count,
            'total_cost',
            v_total_cost,
            'purchase_time',
            v_purchase_time,
            'expiry_date',
            v_expiry_date,
            'status',
            v_status,
            'is_expired',
            IF(v_expiry_date < CURRENT_DATE, TRUE, FALSE)
        )
    );
END LOOP;
CLOSE ticket_cursor;
SET result_code = 0;
SET result_msg = '获取用户团购票成功';
SET data = JSON_OBJECT('user_id', p_user_id, 'tickets', v_tickets);
END // -- 子存储过程：获取团购票详情
CREATE PROCEDURE SP_Get_Purchased_Group_Tickets(
    IN p_purchased_id INT,
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(255),
    OUT p_data JSON
) proc_label: BEGIN
DECLARE v_exists INT DEFAULT 0;
DECLARE v_ticket_count INT;
DECLARE v_tickets_used INT DEFAULT 0;
DECLARE v_type_name VARCHAR(50);
DECLARE v_total_cost DECIMAL(10, 2);
DECLARE v_purchase_time DATETIME;
DECLARE v_expiry_date DATE;
DECLARE v_status VARCHAR(10);
DECLARE v_usage_restrictions TEXT;
DECLARE v_usage_records JSON DEFAULT JSON_ARRAY();
-- 获取团购票基本信息
SELECT COUNT(*),
    gtt.type_name,
    pgt.ticket_count,
    pgt.total_cost,
    pgt.purchase_time,
    pgt.expiry_date,
    pgt.status,
    gtt.usage_restrictions INTO v_exists,
    v_type_name,
    v_ticket_count,
    v_total_cost,
    v_purchase_time,
    v_expiry_date,
    v_status,
    v_usage_restrictions
FROM Purchased_Group_Ticket pgt
    JOIN Group_TicketType gtt ON pgt.type_id = gtt.type_id
WHERE pgt.purchased_group_ticket_id = p_purchased_id;
IF v_exists = 0 THEN
SET p_result_code = -1;
SET p_result_msg = '团购票不存在';
SET p_data = NULL;
LEAVE proc_label;
END IF;
-- 获取使用记录数量
SELECT IFNULL(COUNT(*), 0) INTO v_tickets_used
FROM Order_Ticket ot
WHERE ot.purchased_group_ticket_id = p_purchased_id
    AND ot.order_status = '已支付';
-- 构建使用记录JSON
SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'order_id',
            o.order_id,
            'order_number',
            o.order_number,
            'movie_title',
            m.movie_title,
            'cinema_name',
            c.cinema_name,
            'screening_time',
            s.screen_time,
            'order_date',
            o.order_date
        )
    ) INTO v_usage_records
FROM Order_Ticket ot
    JOIN `Order` o ON ot.order_id = o.order_id
    LEFT JOIN Screening s ON o.screening_id = s.screening_id
    LEFT JOIN Movie m ON s.movie_id = m.movie_id
    LEFT JOIN Hall h ON s.hall_id = h.hall_id
    LEFT JOIN Cinema c ON h.cinema_id = c.cinema_id
WHERE ot.purchased_group_ticket_id = p_purchased_id
    AND ot.order_status = '已支付';
SET p_result_code = 0;
SET p_result_msg = '获取团购票详情成功';
SET p_data = JSON_OBJECT(
        'purchased_id',
        p_purchased_id,
        'type_name',
        v_type_name,
        'ticket_count',
        v_ticket_count,
        'tickets_used',
        v_tickets_used,
        'tickets_remaining',
        v_ticket_count - v_tickets_used,
        'total_cost',
        v_total_cost,
        'purchase_date',
        v_purchase_time,
        'expiry_date',
        v_expiry_date,
        'status',
        v_status,
        'usage_restrictions',
        v_usage_restrictions,
        'is_expired',
        IF(v_expiry_date < CURRENT_DATE, TRUE, FALSE),
        'usage_records',
        IFNULL(v_usage_records, JSON_ARRAY())
    );
END // -- ========================================
-- 8. 系统管理模块
-- ========================================
-- 主存储过程：系统管理
CREATE PROCEDURE Manage_System(
    IN p_operation_type VARCHAR(30),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_movie_id INT,
    IN p_cinema_id INT,
    OUT p_result JSON,
    OUT result_code INT,
    OUT result_msg VARCHAR(255)
) proc_label: BEGIN CASE
    p_operation_type
    WHEN 'sales' THEN CALL SP_Generate_Sales_Report(p_start_date, p_end_date, p_result);
WHEN 'movie_performance' THEN CALL SP_Get_Movie_Performance(p_movie_id, p_start_date, p_end_date, p_result);
WHEN 'cinema_performance' THEN CALL SP_Get_Cinema_Performance(p_cinema_id, p_start_date, p_end_date, p_result);
WHEN 'system_cleanup' THEN CALL SP_System_Cleanup(p_result);
WHEN 'data_statistics' THEN CALL SP_Get_Data_Statistics(p_result);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET p_result = NULL;
END CASE
;
IF result_code IS NULL THEN
SET result_code = 0;
SET result_msg = '操作执行成功';
END IF;
END // -- 子存储过程：生成销售数据
CREATE PROCEDURE SP_Generate_Sales_Report(
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_result JSON
) proc_label: BEGIN
DECLARE v_total_orders INT DEFAULT 0;
DECLARE v_total_revenue DECIMAL(10, 2) DEFAULT 0.00;
DECLARE v_total_tickets INT DEFAULT 0;
DECLARE v_total_refunded DECIMAL(10, 2) DEFAULT 0.00;
DECLARE v_daily_sales JSON DEFAULT JSON_ARRAY();
DECLARE v_movie_sales JSON DEFAULT JSON_ARRAY();
-- 获取总计统计
SELECT COUNT(*),
    IFNULL(SUM(o.total_amount), 0),
    IFNULL(
        SUM(
            (
                SELECT COUNT(*)
                FROM Order_Ticket ot
                WHERE ot.order_id = o.order_id
            )
        ),
        0
    ) INTO v_total_orders,
    v_total_revenue,
    v_total_tickets
FROM `Order` o
WHERE o.order_status = '已支付'
    AND o.order_date BETWEEN p_start_date AND p_end_date;
-- 获取退款总计
SELECT IFNULL(SUM(r.refund_amount), 0) INTO v_total_refunded
FROM Refund r
    JOIN `Order` o ON r.order_id = o.order_id
WHERE r.refund_status = 'REFUNDED'
    AND r.refund_date BETWEEN p_start_date AND p_end_date;
-- 获取每日销售数据
SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'sale_date',
            daily_data.sale_date,
            'order_count',
            daily_data.order_count,
            'revenue',
            daily_data.revenue,
            'ticket_count',
            daily_data.ticket_count
        )
    ) INTO v_daily_sales
FROM (
        SELECT DATE(o.order_date) as sale_date,
            COUNT(o.order_id) as order_count,
            SUM(o.total_amount) as revenue,
            SUM(
                (
                    SELECT COUNT(*)
                    FROM Order_Ticket ot
                    WHERE ot.order_id = o.order_id
                )
            ) as ticket_count
        FROM `Order` o
        WHERE o.order_status = '已支付'
            AND o.order_date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE(o.order_date)
        ORDER BY sale_date
    ) AS daily_data;
-- 获取电影销售数据
SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'movie_id',
            movie_data.movie_id,
            'movie_title',
            movie_data.movie_title,
            'order_count',
            movie_data.order_count,
            'revenue',
            movie_data.revenue,
            'ticket_count',
            movie_data.ticket_count
        )
    ) INTO v_movie_sales
FROM (
        SELECT m.movie_id,
            m.movie_title,
            COUNT(o.order_id) as order_count,
            SUM(o.total_amount) as revenue,
            SUM(
                (
                    SELECT COUNT(*)
                    FROM Order_Ticket ot
                    WHERE ot.order_id = o.order_id
                )
            ) AS ticket_count
        FROM `Order` o
            JOIN Screening s ON o.screening_id = s.screening_id
            JOIN Movie m ON s.movie_id = m.movie_id
        WHERE o.order_status = '已支付'
            AND o.order_date BETWEEN p_start_date AND p_end_date
        GROUP BY m.movie_id,
            m.movie_title
        ORDER BY revenue DESC
        LIMIT 10
    ) AS movie_data;
SET p_result = JSON_OBJECT(
        'period',
        JSON_OBJECT(
            'start_date',
            p_start_date,
            'end_date',
            p_end_date
        ),
        'summary',
        JSON_OBJECT(
            'total_orders',
            v_total_orders,
            'total_revenue',
            v_total_revenue,
            'total_tickets',
            v_total_tickets,
            'total_refunded',
            v_total_refunded,
            'net_revenue',
            v_total_revenue - v_total_refunded
        ),
        'daily_sales',
        IFNULL(v_daily_sales, JSON_ARRAY()),
        'top_movies',
        IFNULL(v_movie_sales, JSON_ARRAY())
    );
END // -- 子存储过程：系统清理
CREATE PROCEDURE SP_System_Cleanup(OUT p_result JSON) proc_label: BEGIN
DECLARE v_released_seats INT DEFAULT 0;
DECLARE v_expired_tickets INT DEFAULT 0;
DECLARE v_old_verifications INT DEFAULT 0;
-- 释放过期锁定座位
UPDATE ScreeningSeat
SET seat_status = '可用',
    lock_time = NULL
WHERE seat_status = '已锁定'
    AND lock_time < DATE_SUB(NOW(), INTERVAL 15 MINUTE);
SET v_released_seats = ROW_COUNT();
-- 标记过期团购票
UPDATE Purchased_Group_Ticket
SET status = '已过期'
WHERE status = '有效'
    AND expiry_date < CURRENT_DATE;
SET v_expired_tickets = ROW_COUNT();
-- 清理30天前的核验记录（已使用的）
DELETE FROM Verification
WHERE is_used = 1
    AND verification_id IN (
        SELECT v.verification_id
        FROM (
                SELECT v2.verification_id
                FROM Verification v2
                    JOIN `Order` o ON v2.order_id = o.order_id
                WHERE v2.is_used = 1
                    AND o.order_date < DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
            ) v
    );
SET v_old_verifications = ROW_COUNT();
SET p_result = JSON_OBJECT(
        'released_seats',
        v_released_seats,
        'expired_tickets',
        v_expired_tickets,
        'cleaned_verifications',
        v_old_verifications
    );
END // -- 子存储过程：获取数据统计
CREATE PROCEDURE SP_Get_Data_Statistics(OUT p_result JSON) proc_label: BEGIN
DECLARE v_total_users INT;
DECLARE v_total_movies INT;
DECLARE v_total_cinemas INT;
DECLARE v_total_orders INT;
DECLARE v_total_reviews INT;
DECLARE v_active_screenings INT;
DECLARE v_today_orders INT;
DECLARE v_today_revenue DECIMAL(15, 2);
-- 获取各项统计数据
SELECT COUNT(*) INTO v_total_users
FROM User;
SELECT COUNT(*) INTO v_total_movies
FROM Movie;
SELECT COUNT(*) INTO v_total_cinemas
FROM Cinema;
SELECT COUNT(*) INTO v_total_orders
FROM `Order`
WHERE order_status = '已支付';
SELECT COUNT(*) INTO v_total_reviews
FROM Review
WHERE review_status = '已批准';
SELECT COUNT(*) INTO v_active_screenings
FROM Screening
WHERE screen_time > CURRENT_TIMESTAMP;
SELECT COUNT(*),
    IFNULL(SUM(total_amount), 0) INTO v_today_orders,
    v_today_revenue
FROM `Order`
WHERE order_status = '已支付'
    AND DATE(order_date) = CURRENT_DATE;
SET p_result = JSON_OBJECT(
        'users',
        v_total_users,
        'movies',
        v_total_movies,
        'cinemas',
        v_total_cinemas,
        'orders',
        v_total_orders,
        'reviews',
        v_total_reviews,
        'active_screenings',
        v_active_screenings,
        'today',
        JSON_OBJECT(
            'orders',
            v_today_orders,
            'revenue',
            v_today_revenue
        )
    );
END // DELIMITER;