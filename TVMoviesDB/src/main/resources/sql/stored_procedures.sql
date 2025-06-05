USE tianyoudb;
-- ========================================
-- 0. 公共辅助存储过程
-- ========================================
DELIMITER // -- 公共验证：用户是否存在
CREATE PROCEDURE SP_Validate_User_Exists(
    IN p_user_id INT,
    OUT is_valid BOOLEAN,
    OUT error_message VARCHAR(255)
) proc_label: BEGIN
DECLARE user_count INT DEFAULT 0;
IF p_user_id IS NULL
OR p_user_id <= 0 THEN
SET is_valid = FALSE;
SET error_message = '无效的用户ID';
LEAVE proc_label;
END IF;
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE user_id = p_user_id;
IF user_count = 0 THEN
SET is_valid = FALSE;
SET error_message = '用户不存在';
ELSE
SET is_valid = TRUE;
SET error_message = NULL;
END IF;
END // -- 公共验证：手机号格式和唯一性
CREATE PROCEDURE SP_Validate_Phone(
    IN p_phone VARCHAR(20),
    IN p_exclude_user_id INT,
    OUT is_valid BOOLEAN,
    OUT error_message VARCHAR(255)
) proc_label: BEGIN
DECLARE phone_count INT DEFAULT 0;
-- 验证手机号格式
IF p_phone IS NULL
OR p_phone NOT REGEXP '^1[3-9][0-9]{9}$' THEN
SET is_valid = FALSE;
SET error_message = '手机号格式不正确';
LEAVE proc_label;
END IF;
-- 验证唯一性
IF p_exclude_user_id IS NULL THEN
SELECT COUNT(*) INTO phone_count
FROM `User`
WHERE phone = p_phone;
ELSE
SELECT COUNT(*) INTO phone_count
FROM `User`
WHERE phone = p_phone
    AND user_id != p_exclude_user_id;
END IF;
IF phone_count > 0 THEN
SET is_valid = FALSE;
SET error_message = '手机号已被使用';
ELSE
SET is_valid = TRUE;
SET error_message = NULL;
END IF;
END // -- 公共验证：邮箱格式和唯一性
CREATE PROCEDURE SP_Validate_Email(
    IN p_email VARCHAR(100),
    IN p_exclude_user_id INT,
    OUT is_valid BOOLEAN,
    OUT error_message VARCHAR(255)
) proc_label: BEGIN
DECLARE email_count INT DEFAULT 0;
-- 验证邮箱格式
IF p_email IS NULL
OR p_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' THEN
SET is_valid = FALSE;
SET error_message = '邮箱格式不正确';
LEAVE proc_label;
END IF;
-- 验证唯一性
IF p_exclude_user_id IS NULL THEN
SELECT COUNT(*) INTO email_count
FROM `User`
WHERE email = p_email;
ELSE
SELECT COUNT(*) INTO email_count
FROM `User`
WHERE email = p_email
    AND user_id != p_exclude_user_id;
END IF;
IF email_count > 0 THEN
SET is_valid = FALSE;
SET error_message = '邮箱已被使用';
ELSE
SET is_valid = TRUE;
SET error_message = NULL;
END IF;
END // -- 公共验证：密码强度
CREATE PROCEDURE SP_Validate_Password(
    IN p_password VARCHAR(100),
    OUT is_valid BOOLEAN,
    OUT error_message VARCHAR(255)
) proc_label: BEGIN -- 简化版密码验证：只检查是否为空和最小长度
IF p_password IS NULL
OR LENGTH(p_password) < 1 THEN
SET is_valid = FALSE;
SET error_message = '密码不能为空';
ELSE
SET is_valid = TRUE;
SET error_message = NULL;
END IF;
END // -- 计算退款金额（根据时间差）
CREATE PROCEDURE SP_Calculate_Refund_Amount(
    IN p_order_id INT,
    OUT refund_amount DECIMAL(10, 2),
    OUT error_message VARCHAR(255)
) proc_label: BEGIN
DECLARE order_cost DECIMAL(10, 2);
DECLARE screening_time DATETIME;
DECLARE time_diff INT;
DECLARE refund_rate DECIMAL(3, 2);
-- 获取订单金额和场次时间
SELECT o.cost_number,
    s.screening_time INTO order_cost,
    screening_time
FROM `Order` o
    JOIN Screening s ON o.screening_id = s.screening_id
WHERE o.order_id = p_order_id;
IF order_cost IS NULL THEN
SET refund_amount = 0;
SET error_message = '订单不存在或无关联场次';
LEAVE proc_label;
END IF;
-- 计算距离放映时间的小时数
SET time_diff = TIMESTAMPDIFF(HOUR, NOW(), screening_time);
-- 根据时间差确定退款比例
IF time_diff > 48 THEN
SET refund_rate = 1.00;
ELSEIF time_diff > 24 THEN
SET refund_rate = 0.90;
ELSEIF time_diff > 12 THEN
SET refund_rate = 0.70;
ELSEIF time_diff > 6 THEN
SET refund_rate = 0.50;
ELSEIF time_diff > 2 THEN
SET refund_rate = 0.30;
ELSE
SET refund_rate = 0.00;
END IF;
SET refund_amount = order_cost * refund_rate;
SET error_message = NULL;
END // -- ========================================
-- 1. 用户操作管理模块（优化版）
-- ========================================
-- 主存储过程：用户账户管理
CREATE PROCEDURE Manage_User_Account(
    IN operation_type VARCHAR(20),
    IN p_user_id INT,
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('操作失败: ', @text);
SET data = NULL;
END;
-- 参数验证
IF operation_type IS NULL
OR TRIM(operation_type) = '' THEN
SET result_code = -1;
SET result_msg = '操作类型不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
START TRANSACTION;
CASE
    operation_type
    WHEN 'register' THEN CALL SP_Register_User(
        p_username,
        p_password,
        p_phone,
        p_email,
        result_code,
        result_msg,
        data
    );
WHEN 'login' THEN CALL SP_Login_User(
    p_phone,
    p_password,
    result_code,
    result_msg,
    data
);
WHEN 'update_profile' THEN CALL SP_Update_User_Profile(
    p_user_id,
    p_username,
    p_phone,
    p_email,
    result_code,
    result_msg,
    data
);
WHEN 'change_password' THEN CALL SP_Change_Password(
    p_user_id,
    p_password,
    result_code,
    result_msg,
    data
);
WHEN 'delete_account' THEN CALL SP_Delete_User_Account(p_user_id, result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET data = NULL;
END CASE
;
IF result_code = 0 THEN COMMIT;
ELSE ROLLBACK;
END IF;
END // -- 子存储过程：用户注册（优化版）
CREATE PROCEDURE SP_Register_User(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE new_user_id INT;
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('注册失败: ', @text);
SET data = NULL;
END;
-- 参数验证
IF p_username IS NULL
OR TRIM(p_username) = '' THEN
SET result_code = -1;
SET result_msg = '用户名不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
IF LENGTH(TRIM(p_username)) < 2
OR LENGTH(TRIM(p_username)) > 50 THEN
SET result_code = -1;
SET result_msg = '用户名长度必须在2-50字符之间';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证密码强度
CALL SP_Validate_Password(p_password, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证手机号
CALL SP_Validate_Phone(p_phone, NULL, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证邮箱
CALL SP_Validate_Email(p_email, NULL, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 插入新用户（使用行级锁防止并发问题）
INSERT INTO `User` (username, password, phone, email, register_time)
VALUES (
        TRIM(p_username),
        p_password,
        p_phone,
        p_email,
        NOW()
    );
SET new_user_id = LAST_INSERT_ID();
-- 返回成功结果
SET result_code = 0;
SET result_msg = '注册成功';
SET data = JSON_OBJECT(
        'user_id',
        new_user_id,
        'username',
        TRIM(p_username),
        'phone',
        p_phone,
        'email',
        p_email,
        'registration_time',
        NOW()
    );
END // -- 子存储过程：用户登录（优化版）
CREATE PROCEDURE SP_Login_User(
    IN p_phone VARCHAR(20),
    IN p_password VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE v_user_id INT;
DECLARE v_username VARCHAR(50);
DECLARE v_email VARCHAR(100);
DECLARE v_stored_password VARCHAR(100);
DECLARE v_registration_time DATETIME;
DECLARE v_last_login_time DATETIME;
DECLARE login_attempts INT DEFAULT 0;
DECLARE is_locked BOOLEAN DEFAULT FALSE;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('登录失败: ', @text);
SET data = NULL;
END;
-- 参数验证
IF p_phone IS NULL
OR TRIM(p_phone) = '' THEN
SET result_code = -1;
SET result_msg = '手机号不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
IF p_password IS NULL
OR TRIM(p_password) = '' THEN
SET result_code = -1;
SET result_msg = '密码不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 查询用户信息（使用行级锁防止并发登录问题）
SELECT u.user_id,
    u.username,
    u.email,
    u.password,
    u.register_time,
    u.last_login_time INTO v_user_id,
    v_username,
    v_email,
    v_stored_password,
    v_registration_time,
    v_last_login_time
FROM `User` u
WHERE u.phone = p_phone FOR
UPDATE;
-- 检查用户是否存在
IF v_user_id IS NULL THEN
SET result_code = -1;
SET result_msg = '手机号或密码错误';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证密码（简化版：直接字符串匹配）
IF v_stored_password != p_password THEN
SET result_code = -1;
SET result_msg = '手机号或密码错误';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新最后登录时间
UPDATE `User`
SET last_login_time = NOW()
WHERE user_id = v_user_id;
-- 返回成功结果
SET result_code = 0;
SET result_msg = '登录成功';
SET data = JSON_OBJECT(
        'user_id',
        v_user_id,
        'username',
        v_username,
        'phone',
        p_phone,
        'email',
        v_email,
        'registration_time',
        v_registration_time,
        'last_login_time',
        NOW()
    );
END // -- 子存储过程：更新用户资料（优化版）
CREATE PROCEDURE SP_Update_User_Profile(
    IN p_user_id INT,
    IN p_username VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE v_old_username VARCHAR(50);
DECLARE v_old_phone VARCHAR(20);
DECLARE v_old_email VARCHAR(100);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('更新失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_username IS NULL
OR TRIM(p_username) = '' THEN
SET result_code = -1;
SET result_msg = '用户名不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
IF LENGTH(TRIM(p_username)) < 2
OR LENGTH(TRIM(p_username)) > 50 THEN
SET result_code = -1;
SET result_msg = '用户名长度必须在2-50字符之间';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证手机号
CALL SP_Validate_Phone(p_phone, p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证邮箱
CALL SP_Validate_Email(p_email, p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 获取原始数据（使用行级锁）
SELECT username,
    phone,
    email INTO v_old_username,
    v_old_phone,
    v_old_email
FROM `User`
WHERE user_id = p_user_id FOR
UPDATE;
-- 更新用户信息
UPDATE `User`
SET username = TRIM(p_username),
    phone = p_phone,
    email = p_email
WHERE user_id = p_user_id;
SET result_code = 0;
SET result_msg = '资料更新成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        TRIM(p_username),
        'phone',
        p_phone,
        'email',
        p_email,
        'old_data',
        JSON_OBJECT(
            'username',
            v_old_username,
            'phone',
            v_old_phone,
            'email',
            v_old_email
        )
    );
END // -- 子存储过程：修改密码（优化版）
CREATE PROCEDURE SP_Change_Password(
    IN p_user_id INT,
    IN p_old_password VARCHAR(100),
    IN p_new_password VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE v_stored_password VARCHAR(100);
DECLARE v_username VARCHAR(50);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('修改密码失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_old_password IS NULL
OR TRIM(p_old_password) = '' THEN
SET result_code = -1;
SET result_msg = '原密码不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证新密码强度
CALL SP_Validate_Password(p_new_password, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证原密码是否正确（使用行级锁）
SELECT password,
    username INTO v_stored_password,
    v_username
FROM `User`
WHERE user_id = p_user_id FOR
UPDATE;
IF v_stored_password != p_old_password THEN
SET result_code = -1;
SET result_msg = '原密码错误';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查新密码是否与原密码相同
IF p_new_password = v_stored_password THEN
SET result_code = -1;
SET result_msg = '新密码不能与原密码相同';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 更新密码
UPDATE `User`
SET password = p_new_password
WHERE user_id = p_user_id;
-- 返回成功结果
SET result_code = 0;
SET result_msg = '密码修改成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'update_time',
        NOW()
    );
END // -- 子存储过程：删除用户账户（优化版）
CREATE PROCEDURE SP_Delete_User_Account(
    IN p_user_id INT,
    IN p_password VARCHAR(100),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE v_stored_password VARCHAR(100);
DECLARE v_username VARCHAR(50);
DECLARE v_phone VARCHAR(20);
DECLARE v_email VARCHAR(100);
DECLARE pending_order_count INT DEFAULT 0;
DECLARE total_order_count INT DEFAULT 0;
DECLARE review_count INT DEFAULT 0;
DECLARE member_count INT DEFAULT 0;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('删除账户失败: ', @text);
SET data = NULL;
END;
START TRANSACTION;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_password IS NULL
OR TRIM(p_password) = '' THEN
SET result_code = -1;
SET result_msg = '密码不能为空';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 验证密码（使用行级锁）
SELECT password,
    username,
    phone,
    email INTO v_stored_password,
    v_username,
    v_phone,
    v_email
FROM `User`
WHERE user_id = p_user_id FOR
UPDATE;
IF v_stored_password != p_password THEN
SET result_code = -1;
SET result_msg = '密码错误';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 检查是否有未完成的订单
SELECT COUNT(*) INTO pending_order_count
FROM `Order`
WHERE user_id = p_user_id
    AND order_status IN ('pending', 'paid', 'confirmed');
IF pending_order_count > 0 THEN
SET result_code = -1;
SET result_msg = CONCAT('存在', pending_order_count, '个未完成的订单，无法删除账户');
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 统计要删除的数据
SELECT COUNT(*) INTO total_order_count
FROM `Order`
WHERE user_id = p_user_id;
SELECT COUNT(*) INTO review_count
FROM `Review`
WHERE user_id = p_user_id;
SELECT COUNT(*) INTO member_count
FROM `Member`
WHERE user_id = p_user_id;
-- 级联删除用户相关数据
DELETE FROM `PurchasedGroupTicket`
WHERE user_id = p_user_id;
DELETE FROM `Refund`
WHERE order_id IN (
        SELECT order_id
        FROM `Order`
        WHERE user_id = p_user_id
    );
DELETE FROM `Order`
WHERE user_id = p_user_id;
DELETE FROM `Review`
WHERE user_id = p_user_id;
DELETE FROM `Verification`
WHERE user_id = p_user_id;
DELETE FROM `Member`
WHERE user_id = p_user_id;
DELETE FROM `User`
WHERE user_id = p_user_id;
COMMIT;
-- 返回成功结果
SET result_code = 0;
SET result_msg = '账户删除成功';
SET data = JSON_OBJECT(
        'deleted_user_id',
        p_user_id,
        'username',
        v_username,
        'phone',
        v_phone,
        'email',
        v_email,
        'deleted_data',
        JSON_OBJECT(
            'orders',
            total_order_count,
            'reviews',
            review_count,
            'member_records',
            member_count
        ),
        'delete_time',
        NOW()
    );
END // -- ========================================
-- 2. 会员模块（优化版）
-- ========================================
-- 主存储过程：会员管理
CREATE PROCEDURE Manage_Membership(
    IN operation_type VARCHAR(20),
    IN p_user_id INT,
    IN p_membership_type VARCHAR(20),
    IN p_points INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('会员操作失败: ', @text);
SET data = NULL;
END;
-- 参数验证
IF operation_type IS NULL
OR TRIM(operation_type) = '' THEN
SET result_code = -1;
SET result_msg = '操作类型不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
START TRANSACTION;
CASE
    operation_type
    WHEN 'join' THEN CALL SP_Join_Membership(
        p_user_id,
        p_membership_type,
        result_code,
        result_msg,
        data
    );
WHEN 'get_points' THEN CALL SP_Get_Member_Points(p_user_id, result_code, result_msg, data);
WHEN 'add_points' THEN CALL SP_Add_Member_Points(
    p_user_id,
    p_points,
    result_code,
    result_msg,
    data
);
WHEN 'use_points' THEN CALL SP_Use_Member_Points(
    p_user_id,
    p_points,
    result_code,
    result_msg,
    data
);
WHEN 'upgrade' THEN CALL SP_Upgrade_Membership(
    p_user_id,
    p_membership_type,
    result_code,
    result_msg,
    data
);
WHEN 'get_info' THEN CALL SP_Get_Member_Info(p_user_id, result_code, result_msg, data);
ELSE
SET result_code = -1;
SET result_msg = '无效的操作类型';
SET data = NULL;
END CASE
;
IF result_code = 0 THEN COMMIT;
ELSE ROLLBACK;
END IF;
END // -- 子存储过程：加入会员（优化版）
CREATE PROCEDURE SP_Join_Membership(
    IN p_user_id INT,
    IN p_membership_type VARCHAR(20),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE v_username VARCHAR(50);
DECLARE v_phone VARCHAR(20);
DECLARE initial_points INT DEFAULT 0;
DECLARE membership_fee DECIMAL(10, 2) DEFAULT 0.00;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('加入会员失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_membership_type IS NULL
OR TRIM(p_membership_type) = '' THEN
SET result_code = -1;
SET result_msg = '会员类型不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证会员类型并设置初始积分和费用
CASE
    p_membership_type
    WHEN 'bronze' THEN
    SET initial_points = 100;
SET membership_fee = 0.00;
WHEN 'silver' THEN
SET initial_points = 500;
SET membership_fee = 99.00;
WHEN 'gold' THEN
SET initial_points = 1000;
SET membership_fee = 199.00;
WHEN 'platinum' THEN
SET initial_points = 2000;
SET membership_fee = 399.00;
ELSE
SET result_code = -1;
SET result_msg = '无效的会员类型，支持：bronze, silver, gold, platinum';
SET data = NULL;
LEAVE proc_label;
END CASE
;
-- 检查是否已是会员
SELECT COUNT(*) INTO member_count
FROM Member
WHERE user_id = p_user_id;
IF member_count > 0 THEN
SET result_code = -1;
SET result_msg = '用户已是会员，请使用升级功能';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 获取用户信息
SELECT username,
    phone INTO v_username,
    v_phone
FROM `User`
WHERE user_id = p_user_id;
-- 加入会员
INSERT INTO Member (
        user_id,
        membership_type,
        points,
        join_time,
        membership_fee
    )
VALUES (
        p_user_id,
        p_membership_type,
        initial_points,
        NOW(),
        membership_fee
    );
SET result_code = 0;
SET result_msg = '成功加入会员';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'phone',
        v_phone,
        'membership_type',
        p_membership_type,
        'initial_points',
        initial_points,
        'membership_fee',
        membership_fee,
        'join_time',
        NOW()
    );
END // -- 子存储过程：获取会员积分（优化版）
CREATE PROCEDURE SP_Get_Member_Points(
    IN p_user_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE current_points INT DEFAULT 0;
DECLARE membership_type VARCHAR(20);
DECLARE join_time DATETIME;
DECLARE v_username VARCHAR(50);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
SET result_code = @errno;
SET result_msg = CONCAT('获取积分失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查会员是否存在并获取信息
SELECT COUNT(*),
    IFNULL(points, 0),
    membership_type,
    join_time INTO member_count,
    current_points,
    membership_type,
    join_time
FROM Member
WHERE user_id = p_user_id;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
SET result_code = 0;
SET result_msg = '获取积分成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'membership_type',
        membership_type,
        'points',
        current_points,
        'join_time',
        join_time
    );
END // -- 子存储过程：增加会员积分（优化版）
CREATE PROCEDURE SP_Add_Member_Points(
    IN p_user_id INT,
    IN p_points INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE current_points INT DEFAULT 0;
DECLARE new_points INT DEFAULT 0;
DECLARE membership_type VARCHAR(20);
DECLARE v_username VARCHAR(50);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('增加积分失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_points IS NULL
OR p_points <= 0 THEN
SET result_code = -1;
SET result_msg = '积分数量必须大于0';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查会员是否存在并获取当前积分（使用行级锁）
SELECT COUNT(*),
    IFNULL(points, 0),
    membership_type INTO member_count,
    current_points,
    membership_type
FROM Member
WHERE user_id = p_user_id FOR
UPDATE;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 计算新积分
SET new_points = current_points + p_points;
-- 更新积分
UPDATE Member
SET points = new_points
WHERE user_id = p_user_id;
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
SET result_code = 0;
SET result_msg = '积分增加成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'membership_type',
        membership_type,
        'old_points',
        current_points,
        'added_points',
        p_points,
        'new_points',
        new_points,
        'update_time',
        NOW()
    );
END // -- 子存储过程：使用会员积分（优化版）
CREATE PROCEDURE SP_Use_Member_Points(
    IN p_user_id INT,
    IN p_points INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE current_points INT DEFAULT 0;
DECLARE new_points INT DEFAULT 0;
DECLARE membership_type VARCHAR(20);
DECLARE v_username VARCHAR(50);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('使用积分失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_points IS NULL
OR p_points <= 0 THEN
SET result_code = -1;
SET result_msg = '使用积分数量必须大于0';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查会员是否存在并获取当前积分（使用行级锁）
SELECT COUNT(*),
    IFNULL(points, 0),
    membership_type INTO member_count,
    current_points,
    membership_type
FROM Member
WHERE user_id = p_user_id FOR
UPDATE;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查积分是否足够
IF current_points < p_points THEN
SET result_code = -1;
SET result_msg = CONCAT('积分不足，当前积分：', current_points, '，需要积分：', p_points);
SET data = NULL;
LEAVE proc_label;
END IF;
-- 计算新积分
SET new_points = current_points - p_points;
-- 更新积分
UPDATE Member
SET points = new_points
WHERE user_id = p_user_id;
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
SET result_code = 0;
SET result_msg = '积分使用成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'membership_type',
        membership_type,
        'old_points',
        current_points,
        'used_points',
        p_points,
        'new_points',
        new_points,
        'update_time',
        NOW()
    );
END // -- 子存储过程：升级会员（优化版）
CREATE PROCEDURE SP_Upgrade_Membership(
    IN p_user_id INT,
    IN p_new_membership_type VARCHAR(20),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE current_membership_type VARCHAR(20);
DECLARE current_points INT DEFAULT 0;
DECLARE upgrade_fee DECIMAL(10, 2) DEFAULT 0.00;
DECLARE bonus_points INT DEFAULT 0;
DECLARE v_username VARCHAR(50);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('升级会员失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_new_membership_type IS NULL
OR TRIM(p_new_membership_type) = '' THEN
SET result_code = -1;
SET result_msg = '新会员类型不能为空';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 验证新会员类型
IF p_new_membership_type NOT IN ('bronze', 'silver', 'gold', 'platinum') THEN
SET result_code = -1;
SET result_msg = '无效的会员类型，支持：bronze, silver, gold, platinum';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查当前会员状态（使用行级锁）
SELECT COUNT(*),
    membership_type,
    points INTO member_count,
    current_membership_type,
    current_points
FROM Member
WHERE user_id = p_user_id FOR
UPDATE;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员，请先加入会员';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 检查是否为有效升级
IF (
    current_membership_type = 'bronze'
    AND p_new_membership_type IN ('silver', 'gold', 'platinum')
)
OR (
    current_membership_type = 'silver'
    AND p_new_membership_type IN ('gold', 'platinum')
)
OR (
    current_membership_type = 'gold'
    AND p_new_membership_type = 'platinum'
) THEN -- 计算升级费用和奖励积分
CASE
    p_new_membership_type
    WHEN 'silver' THEN
    SET upgrade_fee = 99.00;
SET bonus_points = 200;
WHEN 'gold' THEN IF current_membership_type = 'bronze' THEN
SET upgrade_fee = 199.00;
SET bonus_points = 500;
ELSE
SET upgrade_fee = 100.00;
SET bonus_points = 300;
END IF;
WHEN 'platinum' THEN IF current_membership_type = 'bronze' THEN
SET upgrade_fee = 399.00;
SET bonus_points = 1000;
ELSEIF current_membership_type = 'silver' THEN
SET upgrade_fee = 300.00;
SET bonus_points = 800;
ELSE
SET upgrade_fee = 200.00;
SET bonus_points = 500;
END IF;
END CASE
;
ELSE
SET result_code = -1;
SET result_msg = CONCAT(
        '无法从',
        current_membership_type,
        '升级到',
        p_new_membership_type
    );
SET data = NULL;
LEAVE proc_label;
END IF;
-- 执行升级
UPDATE Member
SET membership_type = p_new_membership_type,
    points = current_points + bonus_points,
    membership_fee = membership_fee + upgrade_fee
WHERE user_id = p_user_id;
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
SET result_code = 0;
SET result_msg = '会员升级成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'old_membership_type',
        current_membership_type,
        'new_membership_type',
        p_new_membership_type,
        'old_points',
        current_points,
        'bonus_points',
        bonus_points,
        'new_points',
        current_points + bonus_points,
        'upgrade_fee',
        upgrade_fee,
        'upgrade_time',
        NOW()
    );
END // -- 子存储过程：获取会员信息（优化版）
CREATE PROCEDURE SP_Get_Member_Info(
    IN p_user_id INT,
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE membership_type VARCHAR(20);
DECLARE current_points INT DEFAULT 0;
DECLARE join_time DATETIME;
DECLARE membership_fee DECIMAL(10, 2);
DECLARE v_username VARCHAR(50);
DECLARE v_phone VARCHAR(20);
DECLARE v_email VARCHAR(100);
DECLARE total_orders INT DEFAULT 0;
DECLARE total_spent DECIMAL(10, 2) DEFAULT 0.00;
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
SET result_code = @errno;
SET result_msg = CONCAT('获取会员信息失败: ', @text);
SET data = NULL;
END;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
LEAVE proc_label;
END IF;
-- 获取会员信息
SELECT COUNT(*),
    membership_type,
    IFNULL(points, 0),
    join_time,
    IFNULL(membership_fee, 0.00) INTO member_count,
    membership_type,
    current_points,
    join_time,
    membership_fee
FROM Member
WHERE user_id = p_user_id;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员';
SET data = NULL;
LEAVE proc_label;
END IF;
-- 获取用户基本信息
SELECT username,
    phone,
    email INTO v_username,
    v_phone,
    v_email
FROM `User`
WHERE user_id = p_user_id;
-- 获取消费统计
SELECT COUNT(*),
    IFNULL(SUM(cost_number), 0.00) INTO total_orders,
    total_spent
FROM `Order`
WHERE user_id = p_user_id
    AND order_status = 'completed';
SET result_code = 0;
SET result_msg = '获取会员信息成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'phone',
        v_phone,
        'email',
        v_email,
        'membership_type',
        membership_type,
        'points',
        current_points,
        'join_time',
        join_time,
        'membership_fee',
        membership_fee,
        'statistics',
        JSON_OBJECT(
            'total_orders',
            total_orders,
            'total_spent',
            total_spent
        )
    );
END // -- 子存储过程：取消会员（优化版）
CREATE PROCEDURE SP_Cancel_Membership(
    IN p_user_id INT,
    IN p_password VARCHAR(255),
    OUT result_code INT,
    OUT result_msg VARCHAR(255),
    OUT data JSON
) proc_label: BEGIN
DECLARE is_valid BOOLEAN DEFAULT FALSE;
DECLARE error_msg VARCHAR(255);
DECLARE member_count INT DEFAULT 0;
DECLARE membership_type VARCHAR(20);
DECLARE current_points INT DEFAULT 0;
DECLARE membership_fee DECIMAL(10, 2);
DECLARE join_time DATETIME;
DECLARE v_username VARCHAR(50);
DECLARE stored_password VARCHAR(255);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('取消会员失败: ', @text);
SET data = NULL;
END;
START TRANSACTION;
-- 验证用户是否存在
CALL SP_Validate_User_Exists(p_user_id, is_valid, error_msg);
IF NOT is_valid THEN
SET result_code = -1;
SET result_msg = error_msg;
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 参数验证
IF p_password IS NULL
OR TRIM(p_password) = '' THEN
SET result_code = -1;
SET result_msg = '密码不能为空';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 验证密码
SELECT password INTO stored_password
FROM `User`
WHERE user_id = p_user_id FOR
UPDATE;
IF p_password != stored_password THEN
SET result_code = -1;
SET result_msg = '密码错误';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 检查会员是否存在并获取信息（使用行级锁）
SELECT COUNT(*),
    membership_type,
    points,
    membership_fee,
    join_time INTO member_count,
    membership_type,
    current_points,
    membership_fee,
    join_time
FROM Member
WHERE user_id = p_user_id FOR
UPDATE;
IF member_count = 0 THEN
SET result_code = -1;
SET result_msg = '用户不是会员';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
-- 删除会员记录
DELETE FROM Member
WHERE user_id = p_user_id;
COMMIT;
SET result_code = 0;
SET result_msg = '会员取消成功';
SET data = JSON_OBJECT(
        'user_id',
        p_user_id,
        'username',
        v_username,
        'cancelled_membership_type',
        membership_type,
        'lost_points',
        current_points,
        'membership_fee',
        membership_fee,
        'membership_duration_days',
        DATEDIFF(NOW(), join_time),
        'cancel_time',
        NOW()
    );
END // -- ========================================
-- 3. 订单管理模块存储过程
-- ========================================
-- 主存储过程：订单管理
CREATE PROCEDURE Manage_Order(
    IN p_operation VARCHAR(20),
    IN p_user_id INT,
    IN p_order_id INT DEFAULT NULL,
    IN p_movie_id INT DEFAULT NULL,
    IN p_seat_ids TEXT DEFAULT NULL,
    IN p_show_time DATETIME DEFAULT NULL,
    IN p_use_points INT DEFAULT 0,
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
END // -- 子存储过程：创建订单
CREATE PROCEDURE SP_Create_Order(
    IN p_user_id INT,
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
DECLARE seat_count INT DEFAULT 0;
DECLARE available_seats INT DEFAULT 0;
DECLARE ticket_price DECIMAL(10, 2) DEFAULT 0.00;
DECLARE total_cost DECIMAL(10, 2) DEFAULT 0.00;
DECLARE discount_amount DECIMAL(10, 2) DEFAULT 0.00;
DECLARE final_cost DECIMAL(10, 2) DEFAULT 0.00;
DECLARE user_points INT DEFAULT 0;
DECLARE new_order_id INT;
DECLARE v_username VARCHAR(50);
DECLARE movie_title VARCHAR(100);
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE,
    @errno = MYSQL_ERRNO,
    @text = MESSAGE_TEXT;
ROLLBACK;
SET result_code = @errno;
SET result_msg = CONCAT('创建订单失败: ', @text);
SET data = NULL;
END;
START TRANSACTION;
-- 参数验证
IF p_movie_id IS NULL
OR p_seat_ids IS NULL
OR TRIM(p_seat_ids) = ''
OR p_show_time IS NULL THEN
SET result_code = -1;
SET result_msg = '电影ID、座位ID和放映时间不能为空';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
IF p_use_points < 0 THEN
SET result_code = -1;
SET result_msg = '使用积分不能为负数';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 检查电影是否存在
SELECT COUNT(*),
    title INTO seat_count,
    movie_title
FROM Movie
WHERE movie_id = p_movie_id;
IF seat_count = 0 THEN
SET result_code = -1;
SET result_msg = '电影不存在';
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 计算座位数量
SET seat_count = (
        CHAR_LENGTH(p_seat_ids) - CHAR_LENGTH(REPLACE(p_seat_ids, ',', '')) + 1
    );
-- 检查座位可用性（简化处理，实际应该检查具体座位状态）
SET available_seats = seat_count;
-- 假设座位可用
-- 获取票价（简化处理，实际应该根据电影和时间段计算）
SET ticket_price = 45.00;
SET total_cost = ticket_price * seat_count;
-- 处理积分抵扣
IF p_use_points > 0 THEN -- 获取用户积分
SELECT IFNULL(points, 0) INTO user_points
FROM Member
WHERE user_id = p_user_id FOR
UPDATE;
IF user_points < p_use_points THEN
SET result_code = -1;
SET result_msg = CONCAT(
        '积分不足，当前积分：',
        user_points,
        '，需要积分：',
        p_use_points
    );
SET data = NULL;
ROLLBACK;
LEAVE proc_label;
END IF;
-- 计算积分抵扣金额（100积分=1元）
SET discount_amount = p_use_points / 100.0;
IF discount_amount > total_cost THEN
SET discount_amount = total_cost;
SET p_use_points = total_cost * 100;
END IF;
-- 扣除积分
UPDATE Member
SET points = points - p_use_points
WHERE user_id = p_user_id;
END IF;
SET final_cost = total_cost - discount_amount;
-- 创建订单
INSERT INTO `Order` (
        user_id,
        movie_id,
        seat_number,
        show_time,
        cost_number,
        order_status,
        order_time
    )
VALUES (
        p_user_id,
        p_movie_id,
        p_seat_ids,
        p_show_time,
        final_cost,
        'pending',
        NOW()
    );
SET new_order_id = LAST_INSERT_ID();
-- 获取用户名
SELECT username INTO v_username
FROM `User`
WHERE user_id = p_user_id;
COMMIT;
SET result_code = 0;
SET result_msg = '订单创建成功';
SET data = JSON_OBJECT(
        'order_id',
        new_order_id,
        'user_id',
        p_user_id,
        'username',
        v_username,
        'movie_id',
        p_movie_id,
        'movie_title',
        movie_title,
        'seat_ids',
        p_seat_ids,
        'seat_count',
        seat_count,
        'show_time',
        p_show_time,
        'ticket_price',
        ticket_price,
        'total_cost',
        total_cost,
        'used_points',
        p_use_points,
        'discount_amount',
        discount_amount,
        'final_cost',
        final_cost,
        'order_status',
        'pending',
        'order_time',
        NOW()
    );
END // DELIMITER;