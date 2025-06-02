-- 天佑电影购票网站存储过程实现 - 第二部分
-- 订单模块、评论模块、查询模块
USE tianyoudb;
DELIMITER // -- ========================================
DELIMITER // -- ========================================
-- ========================================
-- 主存储过程：订单管理
CREATE PROCEDURE Manage_Order(
    IN p_operation VARCHAR(20),
    IN p_user_id INT,
    IN p_order_id INT,
    IN p_movie_id INT,
    IN p_seat_ids TEXT,
    IN p_show_time DATETIME,
    IN p_use_points INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN

DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('订单操作失败: ', @text);
SET data = NULL;
END;
-- 设置默认值
IF p_use_points IS NULL THEN
SET p_use_points = 0;
END IF;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_operation IS NULL
OR TRIM(p_operation) = '' THEN
SET result_code = -1;
SET result_msg = '操作类型不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 根据操作类型调用相应的子存储过程
CASE
    p_operation
    WHEN 'create' THEN CALL SP_Create_Order(
        p_user_id,
        p_movie_id,
        p_seat_ids,
        p_show_time,
        p_use_points,
        result_code,
        result_msg,
        data
    );
WHEN 'cancel' THEN CALL SP_Cancel_Order(
    p_user_id,
    p_order_id,
    result_code,
    result_msg,
    data
);
WHEN 'pay' THEN CALL SP_Pay_Order(
    p_user_id,
    p_order_id,
    result_code,
    result_msg,
    data
);
WHEN 'get_info' THEN CALL SP_Get_Order_Info(
    p_user_id,
    p_order_id,
    result_code,
    result_msg,
    data
);
WHEN 'get_history' THEN CALL SP_Get_Order_History(p_user_id, result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '不支持的操作类型，支持：create, cancel, pay, get_info, get_history';
SET data = NULL;
END CASE
;
END // -- 子存储过程：锁定座位
IN p_user_id INT,
IN p_screening_id INT,
IN p_seats JSON,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE i INT DEFAULT 0;
DECLARE seat_count INT;
DECLARE seat_row INT;
DECLARE seat_col INT;
DECLARE seat_status VARCHAR(10);
DECLARE locked_seats JSON DEFAULT JSON_ARRAY();
-- 获取座位数量
SET seat_count = JSON_LENGTH(p_seats);
-- 检查每个座位状态并锁定
WHILE i < seat_count DO
SET seat_row = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].row'));
SET seat_col = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].col'));
-- 检查座位状态
SELECT status INTO seat_status
FROM ScreeningSeat
WHERE screening_id = p_screening_id
    AND seat_row = seat_row
    AND seat_col = seat_col;
IF seat_status IS NULL THEN
SET result_code = -1;
SET result_msg = CONCAT('座位(', seat_row, ',', seat_col, ')不存在');
SET data = NULL;
LEAVE proc_label;
END IF;
IF seat_status != '可用' THEN
SET result_code = -1;
SET result_msg = CONCAT('座位(', seat_row, ',', seat_col, ')不可用');
SET data = NULL;
LEAVE proc_label;
END IF;
-- 锁定座位
UPDATE ScreeningSeat
SET status = '已锁定',
    lock_time = NOW()
WHERE screening_id = p_screening_id
    AND seat_row = seat_row
    AND seat_col = seat_col;
SET locked_seats = JSON_ARRAY_APPEND(
        locked_seats,
        '$',
        JSON_OBJECT('row', seat_row, 'col', seat_col)
    );
SET i = i + 1;
END WHILE;
SET result_code = 0;
SET result_msg = '座位锁定成功';
SET data = JSON_OBJECT('locked_seats', locked_seats);
END // -- 子存储过程：创建订单
IN p_user_id INT,
IN p_screening_id INT,
IN p_seats JSON,
IN p_purchased_ticket_id INT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE order_number VARCHAR(20);
DECLARE total_cost DECIMAL(10, 2) DEFAULT 0;
DECLARE ticket_price DECIMAL(10, 2);
DECLARE seat_count INT;
DECLARE new_order_id INT;
DECLARE purchase_type VARCHAR(10);
-- 生成订单号
SET order_number = CONCAT(
        DATE_FORMAT(NOW(), '%Y%m%d'),
        LPAD(p_user_id, 6, '0'),
        LPAD(UNIX_TIMESTAMP(), 4, '0')
    );
-- 确定订单类型和计算总价
-- 确定订单类型和计算总价
IF p_purchased_ticket_id IS NOT NULL THEN
SET purchase_type = 'group';
-- 团购票订单，从团购票表获取价格
SELECT gtt.unit_price INTO ticket_price
FROM PurchasedGroupTicket pgt
    JOIN GroupTicketType gtt ON pgt.type_id = gtt.type_id
WHERE pgt.purchased_ticket_id = p_purchased_ticket_id;
SELECT ticket_count INTO seat_count
FROM PurchasedGroupTicket
WHERE purchased_ticket_id = p_purchased_ticket_id;
SET total_cost = ticket_price * seat_count;
ELSE
SET purchase_type = 'regular';
-- 普通订单，从场次表获取价格
SELECT ticket_price INTO ticket_price
FROM Screening
WHERE screening_id = p_screening_id;
SET seat_count = JSON_LENGTH(p_seats);
SET total_cost = ticket_price * seat_count;
END IF;
-- 创建订单
INSERT INTO `Order` (
        purchase_type,
        screening_id,
        purchased_ticket_id,
        order_number,
        order_time,
        status,
        payment_method,
        bank_card_number,
        cost_number,
        ticket_status
    )
VALUES (
        VALUES (
                purchase_type,
                p_screening_id,
                p_purchased_ticket_id,
                order_number,
                NOW(),
                '待定',
                '微信',
                NULL,
                total_cost,
                '未使用'
            );
SET new_order_id = LAST_INSERT_ID();
SET new_order_id = LAST_INSERT_ID();
-- 创建核验券
IF purchase_type = 'regular' THEN CALL SP_Create_Verification_Codes(
    new_order_id,
    NULL,
    p_user_id,
    p_seats,
    p_screening_id
);
ELSE CALL SP_Create_Verification_Codes(
    NULL,
    p_purchased_ticket_id,
    p_user_id,
    p_seats,
    p_screening_id
);
END IF;
SET result_code = 0;
SET result_msg = '订单创建成功';
SET data = JSON_OBJECT(
        'order_id',
        new_order_id,
        'order_number',
        order_number,
        'total_cost',
        total_cost,
        'seat_count',
        seat_count
    END // -- 子存储过程：创建核验券
END // -- 子存储过程：创建核验券
IN p_order_id INT,
IN p_purchased_ticket_id INT,
IN p_user_id INT,
IN p_seats JSON,
IN p_screening_id INT
) proc_label: BEGIN

DECLARE i INT DEFAULT 0;
DECLARE seat_count INT;
DECLARE verification_code VARCHAR(16);
DECLARE seat_row INT;
DECLARE seat_col INT;
DECLARE screening_seat_id INT;
SET seat_count = JSON_LENGTH(p_seats);
WHILE i < seat_count DO -- 生成核验码
SET verification_code = CONCAT(
        SUBSTRING(MD5(CONCAT(p_user_id, NOW(), RAND())), 1, 16)
    );
-- 获取座位信息
SET seat_row = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].row'));
SET seat_col = JSON_EXTRACT(p_seats, CONCAT('$[', i, '].col'));
-- 获取场次座位ID
SELECT screening_seat_id INTO screening_seat_id
FROM ScreeningSeat
WHERE screening_id = p_screening_id
    AND seat_row = seat_row
    AND seat_col = seat_col;
-- 插入核验券
INSERT INTO Verification (
        purchased_ticket_id,
        order_id,
        verification_code,
        user_id,
        is_used,
        screening_seat_id
    )
VALUES (
        p_purchased_ticket_id,
        p_order_id,
        verification_code,
        p_user_id,
        0,
        screening_seat_id
    );
SET i = i + 1;
END WHILE;
END // -- 子存储过程：处理支付
IN p_order_id INT,
IN p_payment_method VARCHAR(20),
IN p_bank_card_number VARCHAR(50),
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE order_count INT DEFAULT 0;
DECLARE order_status VARCHAR(10);
DECLARE order_cost DECIMAL(10, 2);
-- 检查订单是否存在
SELECT COUNT(*),
    status,
    cost_number INTO order_count,
    order_status,
    order_cost
FROM `Order`
WHERE order_id = p_order_id;
IF order_count = 0 THEN
SET result_code = -1;
SET result_msg = '订单不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
IF order_status != '待定' THEN
SET result_code = -1;
SET result_msg = '订单状态不允许支付';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新订单状态
UPDATE `Order`
SET status = '已付',
    payment_method = p_payment_method,
    bank_card_number = p_bank_card_number,
    payment_time = NOW()
WHERE order_id = p_order_id;
-- 将锁定的座位标记为已售出
UPDATE ScreeningSeat ss
SET ss.status = '已售出'
SET ss.status = '已售出'
WHERE v.order_id = p_order_id;
-- 更新场次剩余座位数
UPDATE Screening s
SET seat_remain = seat_remain - (
        FROM Verification
        WHERE order_id = p_order_id
    )
WHERE s.screening_id = (
        WHERE s.screening_id = (
                FROM `Order`
                WHERE order_id = p_order_id
            );
SET result_code = 0;
SET result_code = 0;
SET result_msg = '支付成功';
SET data = JSON_OBJECT('order_id', p_order_id, 'amount', order_cost);
END // -- 子存储过程：取消订单
IN p_order_id INT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE order_count INT DEFAULT 0;
DECLARE order_status VARCHAR(10);
-- 检查订单状态
SELECT COUNT(*),
    status INTO order_count,
    order_status
FROM `Order`
WHERE order_id = p_order_id;
IF order_count = 0 THEN
SET result_code = -1;
SET result_msg = '订单不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
IF order_status != '待定' THEN
SET result_code = -1;
SET result_msg = '订单状态不允许取消';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 释放锁定的座位
UPDATE ScreeningSeat ss
SET ss.status = '可用',
    SET ss.status = '可用',
    ss.lock_time = NULL
WHERE v.order_id = p_order_id;
-- 更新订单状态
UPDATE `Order`
SET status = '已取消'
WHERE order_id = p_order_id;
SET result_code = 0;
SET result_msg = '订单取消成功';
SET data = JSON_OBJECT('order_id', p_order_id);
END // -- 子存储过程：处理退款
IN p_order_id INT,
IN p_refund_method VARCHAR(20),
IN p_bank_card_number VARCHAR(50),
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE order_count INT DEFAULT 0;
DECLARE order_status VARCHAR(10);
DECLARE ticket_status VARCHAR(10);
DECLARE order_cost DECIMAL(10, 2);
DECLARE refund_amount DECIMAL(10, 2);
DECLARE new_refund_id INT;
-- 检查订单状态
SELECT COUNT(*),
    status,
    ticket_status,
    cost_number INTO order_count,
    order_status,
    ticket_status,
    order_cost
FROM `Order`
WHERE order_id = p_order_id;
IF order_count = 0 THEN
SET result_code = -1;
SET result_msg = '订单不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
IF order_status != '已付'
OR ticket_status = '已退还' THEN
SET result_code = -1;
SET result_msg = '订单状态不允许退款';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 计算退款金额（这里简化为全额退款）
SET refund_amount = order_cost;
-- 创建退款记录
INSERT INTO Refund (
        refund_amount,
        refund_time,
        refund_method,
        bank_card_number,
        status
    )
VALUES (
        VALUES (
                refund_amount,
                NOW(),
                p_refund_method,
                p_bank_card_number,
                '已完成'
            );
SET new_refund_id = LAST_INSERT_ID();
SET new_refund_id = LAST_INSERT_ID();
-- 更新订单票务状态
UPDATE `Order`
SET ticket_status = '已退还'
WHERE order_id = p_order_id;
-- 释放座位
UPDATE ScreeningSeat ss
SET ss.status = '可用',
    SET ss.status = '可用',
    ss.lock_time = NULL
WHERE v.order_id = p_order_id;
-- 更新场次剩余座位数
UPDATE Screening s
SET seat_remain = seat_remain + (
        FROM Verification
        WHERE order_id = p_order_id
    )
WHERE s.screening_id = (
        WHERE s.screening_id = (
                FROM `Order`
                WHERE order_id = p_order_id
            );
SET result_code = 0;
SET result_code = 0;
SET result_msg = '退款处理成功';
SET data = JSON_OBJECT(
        'refund_id',
        new_refund_id,
        'refund_amount',
        refund_amount
    END // -- ========================================
END // -- ========================================
-- ========================================
-- 主存储过程：评论管理
CREATE PROCEDURE Manage_Reviews(
    IN operation_type VARCHAR(20),
    IN p_user_id INT,
    IN p_movie_id INT,
    IN p_screening_id INT,
    IN p_review_id INT,
    IN p_rating DECIMAL(2, 1),
    IN p_comment TEXT,
    IN p_status VARCHAR(10),
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
    WHEN 'submit' THEN CALL SP_Submit_Review(
        p_user_id,
        p_movie_id,
        p_screening_id,
        p_rating,
        p_comment,
        result_code,
        result_msg,
        data
    );
WHEN 'update' THEN CALL SP_Update_Review(
    p_review_id,
    p_rating,
    p_comment,
    result_code,
    result_msg,
    data
);
WHEN 'moderate' THEN CALL SP_Moderate_Review(
    p_review_id,
    p_status,
    result_code,
    result_msg,
    data
);
WHEN 'delete' THEN CALL SP_Delete_Review(p_review_id, result_code, result_msg, data);
WHEN 'get_movie_reviews' THEN CALL SP_Get_Movie_Reviews(p_movie_id, result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET data = NULL;
END CASE
;
IF result_code = 0 THEN COMMIT;
ELSE ROLLBACK;
END IF;
END // -- 子存储过程：提交评论
IN p_user_id INT,
IN p_movie_id INT,
IN p_screening_id INT,
IN p_rating DECIMAL(2, 1),
IN p_comment TEXT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE review_count INT DEFAULT 0;
DECLARE new_review_id INT;
-- 检查是否已经评论过
SELECT COUNT(*) INTO review_count
FROM Review
WHERE user_id = p_user_id
    AND movie_id = p_movie_id
    AND screening_id = p_screening_id;
IF review_count > 0 THEN
SET result_code = -1;
SET result_msg = '您已经评论过该场次';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 插入评论
INSERT INTO Review (
        movie_id,
        screening_id,
        review_time,
        rating,
        comment,
        status
    )
VALUES (
        VALUES (
                p_movie_id,
                p_screening_id,
                NOW(),
                p_rating,
                p_comment,
                '批准'
            );
SET new_review_id = LAST_INSERT_ID();
SET new_review_id = LAST_INSERT_ID();
-- 更新电影平均评分
CALL SP_Update_Movie_Rating(p_movie_id);
SET result_code = 0;
SET result_msg = '评论提交成功';
SET data = JSON_OBJECT('review_id', new_review_id);
END // -- 子存储过程：更新电影评分
CREATE PROCEDURE SP_Update_Movie_Rating(IN p_movie_id INT) proc_label: BEGIN
DECLARE avg_rating DECIMAL(2, 1);
-- 计算平均评分
SELECT AVG(rating) INTO avg_rating
FROM Review
WHERE movie_id = p_movie_id
    AND status = '批准';
-- 更新电影评分
UPDATE Movie
SET rating = IFNULL(avg_rating, 5.0)
WHERE movie_id = p_movie_id;
END // -- 子存储过程：更新评论
IN p_review_id INT,
IN p_rating DECIMAL(2, 1),
IN p_comment TEXT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE review_count INT DEFAULT 0;
DECLARE movie_id INT;
-- 检查评论是否存在
SELECT COUNT(*),
    movie_id INTO review_count,
    movie_id
FROM Review
WHERE review_id = p_review_id;
IF review_count = 0 THEN
SET result_code = -1;
SET result_msg = '评论不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新评论
UPDATE Review
SET rating = p_rating,
    comment = p_comment,
    review_time = NOW()
WHERE review_id = p_review_id;
-- 更新电影平均评分
CALL SP_Update_Movie_Rating(movie_id);
SET result_code = 0;
SET result_msg = '评论更新成功';
SET data = JSON_OBJECT('review_id', p_review_id);
END // -- 子存储过程：审核评论
IN p_review_id INT,
IN p_status VARCHAR(10),
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE review_count INT DEFAULT 0;
DECLARE movie_id INT;
-- 检查评论是否存在
SELECT COUNT(*),
    movie_id INTO review_count,
    movie_id
FROM Review
WHERE review_id = p_review_id;
IF review_count = 0 THEN
SET result_code = -1;
SET result_msg = '评论不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新评论状态
UPDATE Review
SET status = p_status
WHERE review_id = p_review_id;
-- 重新计算电影平均评分
CALL SP_Update_Movie_Rating(movie_id);
SET result_code = 0;
SET result_msg = '评论审核完成';
SET data = JSON_OBJECT('review_id', p_review_id, 'status', p_status);
END // -- 子存储过程：删除评论
IN p_review_id INT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE review_count INT DEFAULT 0;
DECLARE movie_id INT;
-- 检查评论是否存在
SELECT COUNT(*),
    movie_id INTO review_count,
    movie_id
FROM Review
WHERE review_id = p_review_id;
IF review_count = 0 THEN
SET result_code = -1;
SET result_msg = '评论不存在';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 删除评论
DELETE FROM Review
WHERE review_id = p_review_id;
-- 重新计算电影平均评分
CALL SP_Update_Movie_Rating(movie_id);
SET result_code = 0;
SET result_msg = '评论删除成功';
SET data = JSON_OBJECT('deleted_review_id', p_review_id);
END // -- 子存储过程：获取电影评论
IN p_movie_id INT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN

DECLARE review_data JSON DEFAULT JSON_ARRAY();
DECLARE done INT DEFAULT FALSE;
DECLARE v_review_id INT;
DECLARE v_username VARCHAR(50);
DECLARE v_rating DECIMAL(2, 1);
DECLARE v_comment TEXT;
DECLARE v_review_time DATETIME;
DECLARE review_cursor CURSOR FOR
SELECT r.review_id,
    u.username,
    r.rating,
    r.comment,
    r.review_time
FROM Review r
    JOIN `User` u ON r.user_id = u.user_id
WHERE r.movie_id = p_movie_id
    AND r.status = '批准'
ORDER BY r.review_time DESC;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
OPEN review_cursor;
read_loop: LOOP FETCH review_cursor INTO v_review_id,
v_username,
v_rating,
v_comment,
v_review_time;
IF done THEN LEAVE read_loop;
END IF;
SET review_data = JSON_ARRAY_APPEND(
        review_data,
        '$',
        JSON_OBJECT(
            'review_id',
            v_review_id,
            'username',
            v_username,
            'rating',
            v_rating,
            'comment',
            v_comment,
            'review_time',
            v_review_time
        )
    );
END LOOP;
CLOSE review_cursor;
SET result_code = 0;
SET result_msg = '获取评论成功';
SET data = JSON_OBJECT('movie_id', p_movie_id, 'reviews', review_data);
END // -- ========================================
-- ========================================
-- 主存储过程：用户查询管理
CREATE PROCEDURE Manage_User_Queries(
    IN operation_type VARCHAR(30),
    IN p_user_id INT,
    IN p_movie_id INT,
    IN p_cinema_id INT,
    IN p_query_date DATE,
    IN p_order_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN CASE) proc_label: BEGIN CASE
    operation_type
    WHEN 'order_history' THEN CALL SP_Get_Order_History(p_user_id, result_code, result_msg, data);
WHEN 'refund_records' THEN CALL SP_Get_Refund_Records(p_user_id, result_code, result_msg, data);
WHEN 'movie_details' THEN CALL SP_Get_Movie_Details(p_movie_id, result_code, result_msg, data);
WHEN 'available_screenings' THEN CALL SP_Get_Available_Screenings(
    p_movie_id,
    p_cinema_id,
    p_query_date,
    result_code,
    result_msg,
    data
);
WHEN 'cinema_list' THEN CALL SP_Get_Cinema_List(result_code, result_msg, data);
WHEN 'now_playing' THEN CALL SP_Get_Now_Playing_Movies(result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '无效的查询类型';
SET data = NULL;
END CASE
;
END // -- 子存储过程：获取订单历史
IN p_user_id INT,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN
) proc_label: BEGIN
DECLARE order_data JSON DEFAULT JSON_ARRAY();
DECLARE done INT DEFAULT FALSE;
DECLARE v_order_id INT;
DECLARE v_order_number VARCHAR(20);
DECLARE v_movie_title VARCHAR(100);
DECLARE v_cinema_name VARCHAR(50);
DECLARE v_screening_time DATETIME;
DECLARE v_cost_number DECIMAL(10, 2);
DECLARE v_status VARCHAR(10);
DECLARE v_ticket_status VARCHAR(10);
DECLARE order_cursor CURSOR FOR
SELECT o.order_id,
    o.order_number,
    m.title,
    c.name,
    s.screening_time,
    o.cost_number,
    o.status,
    o.ticket_status
FROM `Order` o
    LEFT JOIN Screening s ON o.screening_id = s.screening_id
    LEFT JOIN Movie m ON s.movie_id = m.movie_id
    LEFT JOIN Hall h ON s.hall_id = h.hall_id
    LEFT JOIN Cinema c ON h.cinema_id = c.cinema_id
WHERE o.user_id = p_user_id
ORDER BY o.order_time DESC;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
OPEN order_cursor;
read_loop: LOOP FETCH order_cursor INTO v_order_id,
v_order_number,
v_movie_title,
v_cinema_name,
v_screening_time,
v_cost_number,
v_status,
v_ticket_status;
IF done THEN LEAVE read_loop;
END IF;
SET order_data = JSON_ARRAY_APPEND(
        order_data,
        '$',
        JSON_OBJECT(
            'order_id',
            v_order_id,
            'order_number',
            v_order_number,
            'movie_title',
            v_movie_title,
            'cinema_name',
            v_cinema_name,
            'screening_time',
            v_screening_time,
            'cost_number',
            v_cost_number,
            'status',
            v_status,
            'ticket_status',
            v_ticket_status
        )
    );
END LOOP;
CLOSE order_cursor;
SET result_code = 0;
SET result_msg = '获取订单历史成功';
SET data = JSON_OBJECT('user_id', p_user_id, 'orders', order_data);
END // -- 子存储过程：获取可用场次
IN p_movie_id INT,
IN p_cinema_id INT,
IN p_query_date DATE,
OUT result_code INT,
OUT result_msg VARCHAR(255),
OUT data JSON
) proc_label: BEGIN
) proc_label: BEGIN
DECLARE screening_data JSON DEFAULT JSON_ARRAY();
DECLARE done INT DEFAULT FALSE;
DECLARE v_screening_id INT;
DECLARE v_hall_name VARCHAR(50);
DECLARE v_hall_type VARCHAR(10);
DECLARE v_screening_time DATETIME;
DECLARE v_ticket_price DECIMAL(10, 2);
DECLARE v_seat_remain INT;
DECLARE screening_cursor CURSOR FOR
SELECT s.screening_id,
    h.name,
    h.type,
    s.screening_time,
    s.ticket_price,
    s.seat_remain
FROM Screening s
    JOIN Hall h ON s.hall_id = h.hall_id
WHERE s.movie_id = p_movie_id
    AND h.cinema_id = p_cinema_id
    AND DATE(s.screening_time) = p_query_date
    AND s.seat_remain > 0
ORDER BY s.screening_time;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
OPEN screening_cursor;
read_loop: LOOP FETCH screening_cursor INTO v_screening_id,
v_hall_name,
v_hall_type,
v_screening_time,
v_ticket_price,
v_seat_remain;
IF done THEN LEAVE read_loop;
END IF;
SET screening_data = JSON_ARRAY_APPEND(
        screening_data,
        '$',
        JSON_OBJECT(
            'screening_id',
            v_screening_id,
            'hall_name',
            v_hall_name,
            'hall_type',
            v_hall_type,
            'screening_time',
            v_screening_time,
            'ticket_price',
            v_ticket_price,
            'seat_remain',
            v_seat_remain
        )
    );
END LOOP;
CLOSE screening_cursor;
SET result_code = 0;
SET result_msg = '获取可用场次成功';
SET data = JSON_OBJECT(
        'movie_id',
        p_movie_id,
        'cinema_id',
        p_cinema_id,
        'query_date',
        p_query_date,
        'screenings',
        screening_data
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
-- 获取影厅信息
SELECT h.seat_rows,
    h.seat_cols INTO hall_rows,
    hall_cols
FROM Screening s
    JOIN Hall h ON s.hall_id = h.hall_id
WHERE s.screening_id = p_screening_id;
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
END // DELIMITER;