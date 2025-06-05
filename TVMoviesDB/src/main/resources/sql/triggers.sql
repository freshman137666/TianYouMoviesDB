USE tianyoudb;
-- 设置分隔符
DELIMITER // -- =============================================
-- 1. Cinema 表触发器
-- =============================================
-- Cinema 插入前触发器：验证数据格式和业务规则
CREATE TRIGGER tr_cinema_before_insert BEFORE
INSERT ON Cinema FOR EACH ROW BEGIN
DECLARE cinema_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证影院名称
IF NEW.name IS NULL
OR TRIM(NEW.name) = '' THEN
SET error_msg = '影院名称不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证名称长度
IF CHAR_LENGTH(NEW.name) > 50 THEN
SET error_msg = '影院名称长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查影院名称唯一性
SELECT COUNT(*) INTO cinema_count
FROM Cinema
WHERE name = NEW.name
    AND address = NEW.address;
IF cinema_count > 0 THEN
SET error_msg = '同一地址的影院名称已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证地址
IF NEW.address IS NULL
OR TRIM(NEW.address) = '' THEN
SET error_msg = '影院地址不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证地址长度
IF CHAR_LENGTH(NEW.address) > 120 THEN
SET error_msg = '影院地址长度不能超过120个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证电话格式（中国手机号或固话）
IF NEW.contact_phone IS NOT NULL
AND NEW.contact_phone != '' THEN IF NEW.contact_phone NOT REGEXP '^(1[3-9][0-9]{9}|0[0-9]{2,3}-?[0-9]{7,8})$' THEN
SET error_msg = '联系电话格式不正确，请输入有效的中国手机号或固话';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 标准化数据
SET NEW.name = TRIM(NEW.name);
SET NEW.address = TRIM(NEW.address);
IF NEW.contact_phone IS NOT NULL THEN
SET NEW.contact_phone = TRIM(NEW.contact_phone);
END IF;
END // -- Cinema 更新前触发器：验证更新数据
CREATE TRIGGER tr_cinema_before_update BEFORE
UPDATE ON Cinema FOR EACH ROW BEGIN
DECLARE cinema_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证影院名称
IF NEW.name IS NULL
OR TRIM(NEW.name) = '' THEN
SET error_msg = '影院名称不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证名称长度
IF CHAR_LENGTH(NEW.name) > 50 THEN
SET error_msg = '影院名称长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查影院名称唯一性（排除自身）
SELECT COUNT(*) INTO cinema_count
FROM Cinema
WHERE name = NEW.name
    AND address = NEW.address
    AND cinema_id != NEW.cinema_id;
IF cinema_count > 0 THEN
SET error_msg = '同一地址的影院名称已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证地址
IF NEW.address IS NULL
OR TRIM(NEW.address) = '' THEN
SET error_msg = '影院地址不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证地址长度
IF CHAR_LENGTH(NEW.address) > 120 THEN
SET error_msg = '影院地址长度不能超过120个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证电话格式
IF NEW.contact_phone IS NOT NULL
AND NEW.contact_phone != '' THEN IF NEW.contact_phone NOT REGEXP '^(1[3-9][0-9]{9}|0[0-9]{2,3}-?[0-9]{7,8})$' THEN
SET error_msg = '联系电话格式不正确，请输入有效的中国手机号或固话';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 标准化数据
SET NEW.name = TRIM(NEW.name);
SET NEW.address = TRIM(NEW.address);
IF NEW.contact_phone IS NOT NULL THEN
SET NEW.contact_phone = TRIM(NEW.contact_phone);
END IF;
END // -- Cinema 更新后触发器：记录修改日志（注释掉，因为无 audit_log 表）
CREATE TRIGGER tr_cinema_after_update
AFTER
UPDATE ON Cinema FOR EACH ROW BEGIN -- INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values, update_time)
    -- VALUES ('Cinema', 'UPDATE', NEW.cinema_id, JSON_OBJECT('name', OLD.name, 'address', OLD.address), 
    --         JSON_OBJECT('name', NEW.name, 'address', NEW.address), NOW());
SET @dummy = 1;
-- 占位符
END // -- =============================================
-- 2. Hall 表触发器
-- =============================================
-- Hall 插入前触发器：验证影厅信息和业务规则
CREATE TRIGGER tr_hall_before_insert BEFORE
INSERT ON Hall FOR EACH ROW BEGIN
DECLARE hall_count INT DEFAULT 0;
DECLARE cinema_exists INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证影厅名称
IF NEW.hall_name IS NULL
OR TRIM(NEW.hall_name) = '' THEN
SET error_msg = '影厅名称不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证名称长度
IF CHAR_LENGTH(NEW.hall_name) > 50 THEN
SET error_msg = '影厅名称长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证影院是否存在
SELECT COUNT(*) INTO cinema_exists
FROM Cinema
WHERE cinema_id = NEW.cinema_id;
IF cinema_exists = 0 THEN
SET error_msg = '指定的影院不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查同一影院内影厅名称唯一性
SELECT COUNT(*) INTO hall_count
FROM Hall
WHERE cinema_id = NEW.cinema_id
    AND hall_name = NEW.hall_name;
IF hall_count > 0 THEN
SET error_msg = '同一影院内影厅名称已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证座位容量
IF NEW.seat_count IS NULL
OR NEW.seat_count <= 0
OR NEW.seat_count > 1000 THEN
SET error_msg = '影厅容量必须在1-1000之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证影厅类型
IF NEW.hall_type IS NOT NULL
AND NEW.hall_type NOT IN ('2D', '3D', 'IMAX', '杜比', '4D', '动感', '巨幕') THEN
SET error_msg = '影厅类型必须是：2D、3D、IMAX、杜比、4D、动感、巨幕中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
SET NEW.hall_name = TRIM(NEW.hall_name);
END // -- Hall 更新前触发器：验证更新数据
CREATE TRIGGER tr_hall_before_update BEFORE
UPDATE ON Hall FOR EACH ROW BEGIN
DECLARE hall_count INT DEFAULT 0;
DECLARE cinema_exists INT DEFAULT 0;
DECLARE future_screenings INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证影厅名称
IF NEW.hall_name IS NULL
OR TRIM(NEW.hall_name) = '' THEN
SET error_msg = '影厅名称不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证名称长度
IF CHAR_LENGTH(NEW.hall_name) > 50 THEN
SET error_msg = '影厅名称长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证影院是否存在
SELECT COUNT(*) INTO cinema_exists
FROM Cinema
WHERE cinema_id = NEW.cinema_id;
IF cinema_exists = 0 THEN
SET error_msg = '指定的影院不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查同一影院内影厅名称唯一性（排除自身）
SELECT COUNT(*) INTO hall_count
FROM Hall
WHERE cinema_id = NEW.cinema_id
    AND hall_name = NEW.hall_name
    AND hall_id != NEW.hall_id;
IF hall_count > 0 THEN
SET error_msg = '同一影院内影厅名称已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证座位容量
IF NEW.seat_count IS NULL
OR NEW.seat_count <= 0
OR NEW.seat_count > 1000 THEN
SET error_msg = '影厅容量必须在1-1000之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果容量减少，检查是否有未来排片会受影响
IF NEW.seat_count < OLD.seat_count THEN
SELECT COUNT(*) INTO future_screenings
FROM Screening s
    JOIN ScreeningSeat ss ON s.screening_id = ss.screening_id
WHERE s.hall_id = NEW.hall_id
    AND s.screening_time > NOW()
    AND (ss.seat_row * ss.seat_col > NEW.seat_count);
IF future_screenings > 0 THEN
SET error_msg = '容量减少会影响已有排片的座位安排，无法修改';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证影厅类型
IF NEW.hall_type IS NOT NULL
AND NEW.hall_type NOT IN ('2D', '3D', 'IMAX', '杜比', '4D', '动感', '巨幕') THEN
SET error_msg = '影厅类型必须是：2D、3D、IMAX、杜比、4D、动感、巨幕中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
SET NEW.hall_name = TRIM(NEW.hall_name);
END // -- Hall 删除前触发器：检查是否有未来的排片
CREATE TRIGGER tr_hall_before_delete BEFORE DELETE ON Hall FOR EACH ROW BEGIN
DECLARE screening_count INT DEFAULT 0;
-- 检查是否有未来的场次
SELECT COUNT(*) INTO screening_count
FROM Screening
WHERE hall_id = OLD.hall_id
    AND screening_time > NOW();
IF screening_count > 0 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = '该影厅还有未来的场次安排，无法删除';
END IF;
END // -- =============================================
-- 3. Movie 表触发器
-- =============================================
-- Movie 插入前触发器：验证电影信息和业务规则
CREATE TRIGGER tr_movie_before_insert BEFORE
INSERT ON Movie FOR EACH ROW BEGIN
DECLARE movie_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证电影标题
IF NEW.title IS NULL
OR TRIM(NEW.title) = '' THEN
SET error_msg = '电影标题不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证标题长度
IF CHAR_LENGTH(NEW.title) > 100 THEN
SET error_msg = '电影标题长度不能超过100个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查同名电影（同年份）
SELECT COUNT(*) INTO movie_count
FROM Movie
WHERE title = NEW.title
    AND YEAR(release_date) = YEAR(NEW.release_date);
IF movie_count > 0 THEN
SET error_msg = '同年份已存在同名电影';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证时长
IF NEW.duration IS NULL
OR NEW.duration <= 0
OR NEW.duration > 600 THEN
SET error_msg = '电影时长必须在1-600分钟之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证上映日期和撤档日期
IF NEW.release_date >= NEW.off_shelf_date THEN
SET error_msg = '撤档日期必须晚于上映日期';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证基础价格
IF NEW.base_price IS NULL
OR NEW.base_price <= 0
OR NEW.base_price > 1000 THEN
SET error_msg = '基础价格必须在0.01-1000元之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证分类
IF NEW.category IS NOT NULL
AND CHAR_LENGTH(NEW.category) > 100 THEN
SET error_msg = '电影分类长度不能超过100个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证导演
IF NEW.director IS NOT NULL
AND CHAR_LENGTH(NEW.director) > 50 THEN
SET error_msg = '导演信息长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证评分范围
IF NEW.rating IS NOT NULL
AND (
    NEW.rating < 1.0
    OR NEW.rating > 5.0
) THEN
SET error_msg = '电影评分必须在1.0-5.0之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
SET NEW.title = TRIM(NEW.title);
SET NEW.category = TRIM(NEW.category);
SET NEW.director = TRIM(NEW.director);
-- 设置默认评分
IF NEW.rating IS NULL THEN
SET NEW.rating = 5.0;
END IF;
END // -- Movie 更新前触发器：验证更新数据
CREATE TRIGGER tr_movie_before_update BEFORE
UPDATE ON Movie FOR EACH ROW BEGIN
DECLARE movie_count INT DEFAULT 0;
DECLARE future_screenings INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证电影标题
IF NEW.title IS NULL
OR TRIM(NEW.title) = '' THEN
SET error_msg = '电影标题不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证标题长度
IF CHAR_LENGTH(NEW.title) > 100 THEN
SET error_msg = '电影标题长度不能超过100个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查同名电影（同年份，排除自身）
SELECT COUNT(*) INTO movie_count
FROM Movie
WHERE title = NEW.title
    AND YEAR(release_date) = YEAR(NEW.release_date)
    AND movie_id != NEW.movie_id;
IF movie_count > 0 THEN
SET error_msg = '同年份已存在同名电影';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证时长
IF NEW.duration IS NULL
OR NEW.duration <= 0
OR NEW.duration > 600 THEN
SET error_msg = '电影时长必须在1-600分钟之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证上映日期和撤档日期
IF NEW.release_date >= NEW.off_shelf_date THEN
SET error_msg = '撤档日期必须晚于上映日期';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果提前撤档日期，检查是否有未来排片
IF NEW.off_shelf_date IS NOT NULL
AND (
    OLD.off_shelf_date IS NULL
    OR NEW.off_shelf_date < OLD.off_shelf_date
) THEN
SELECT COUNT(*) INTO future_screenings
FROM Screening
WHERE movie_id = NEW.movie_id
    AND screening_time > NOW()
    AND DATE(screening_time) > NEW.off_shelf_date;
IF future_screenings > 0 THEN
SET error_msg = CONCAT('提前撤档会影响', future_screenings, '场未来排片，无法修改');
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证基础价格
IF NEW.base_price IS NULL
OR NEW.base_price <= 0
OR NEW.base_price > 1000 THEN
SET error_msg = '基础价格必须在0.01-1000元之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证分类
IF NEW.category IS NOT NULL
AND CHAR_LENGTH(NEW.category) > 100 THEN
SET error_msg = '电影分类长度不能超过100个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证导演
IF NEW.director IS NOT NULL
AND CHAR_LENGTH(NEW.director) > 50 THEN
SET error_msg = '导演信息长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证评分范围
IF NEW.rating IS NOT NULL
AND (
    NEW.rating < 1.0
    OR NEW.rating > 5.0
) THEN
SET error_msg = '电影评分必须在1.0-5.0之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
SET NEW.title = TRIM(NEW.title);
SET NEW.category = TRIM(NEW.category);
SET NEW.director = TRIM(NEW.director);
END // -- Movie 更新后触发器：更新相关场次价格
CREATE TRIGGER tr_movie_after_update
AFTER
UPDATE ON Movie FOR EACH ROW BEGIN IF OLD.base_price != NEW.base_price THEN
UPDATE Screening
SET ticket_price = NEW.base_price * (ticket_price / OLD.base_price)
WHERE movie_id = NEW.movie_id
    AND screening_time > NOW();
END IF;
END // -- =============================================
-- 4. User 表触发器
-- =============================================
-- User 插入前触发器：验证用户信息和安全规则
CREATE TRIGGER tr_user_before_insert BEFORE
INSERT ON `User` FOR EACH ROW BEGIN
DECLARE user_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证用户名格式
IF NEW.name IS NULL
OR TRIM(NEW.name) = '' THEN
SET error_msg = '用户名不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证用户名长度
IF CHAR_LENGTH(NEW.name) > 50 THEN
SET error_msg = '用户名长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查用户名唯一性
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE name = NEW.name;
IF user_count > 0 THEN
SET error_msg = '用户名已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证密码（简化版：只检查是否为空）
IF NEW.password IS NULL
OR NEW.password = '' THEN
SET error_msg = '密码不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证手机号格式和唯一性
IF NEW.phone IS NOT NULL
AND NEW.phone != '' THEN IF NEW.phone NOT REGEXP '^1[3-9][0-9]{9}$' THEN
SET error_msg = '手机号格式不正确，请输入有效的中国手机号';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE phone = NEW.phone;
IF user_count > 0 THEN
SET error_msg = '手机号已被注册';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证邮箱格式和唯一性
IF NEW.email IS NOT NULL
AND NEW.email != '' THEN IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
SET error_msg = '邮箱格式不正确';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE email = NEW.email;
IF user_count > 0 THEN
SET error_msg = '邮箱已被注册';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 标准化数据
SET NEW.name = TRIM(NEW.name);
SET NEW.phone = TRIM(NEW.phone);
SET NEW.email = TRIM(LOWER(NEW.email));
-- 设置注册时间
IF NEW.register_time IS NULL THEN
SET NEW.register_time = NOW();
END IF;
END // -- User 更新前触发器：验证更新数据
CREATE TRIGGER tr_user_before_update BEFORE
UPDATE ON `User` FOR EACH ROW BEGIN
DECLARE user_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证用户名格式
IF NEW.name IS NULL
OR TRIM(NEW.name) = '' THEN
SET error_msg = '用户名不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证用户名长度
IF CHAR_LENGTH(NEW.name) > 50 THEN
SET error_msg = '用户名长度不能超过50个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查用户名唯一性（排除自身）
IF NEW.name != OLD.name THEN
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE name = NEW.name
    AND user_id != NEW.user_id;
IF user_count > 0 THEN
SET error_msg = '用户名已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证密码（简化版：如果密码被修改，只检查是否为空）
IF NEW.password != OLD.password THEN IF NEW.password IS NULL
OR NEW.password = '' THEN
SET error_msg = '密码不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证手机号格式和唯一性
IF NEW.phone IS NOT NULL
AND NEW.phone != '' THEN IF NEW.phone NOT REGEXP '^1[3-9][0-9]{9}$' THEN
SET error_msg = '手机号格式不正确，请输入有效的中国手机号';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.phone != OLD.phone
OR OLD.phone IS NULL THEN
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE phone = NEW.phone
    AND user_id != NEW.user_id;
IF user_count > 0 THEN
SET error_msg = '手机号已被注册';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
END IF;
-- 验证邮箱格式和唯一性
IF NEW.email IS NOT NULL
AND NEW.email != '' THEN IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
SET error_msg = '邮箱格式不正确';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.email != OLD.email
OR OLD.email IS NULL THEN
SELECT COUNT(*) INTO user_count
FROM `User`
WHERE email = NEW.email
    AND user_id != NEW.user_id;
IF user_count > 0 THEN
SET error_msg = '邮箱已被注册';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
END IF;
-- 标准化数据
SET NEW.name = TRIM(NEW.name);
SET NEW.phone = TRIM(NEW.phone);
SET NEW.email = TRIM(LOWER(NEW.email));
END // -- User 更新后触发器：记录重要信息变更
CREATE TRIGGER tr_user_after_update
AFTER
UPDATE ON `User` FOR EACH ROW BEGIN IF OLD.phone != NEW.phone
    OR OLD.email != NEW.email
    OR OLD.password != NEW.password THEN -- INSERT INTO security_log (user_id, operation, old_value, new_value, change_time)
    -- VALUES (NEW.user_id, 'SENSITIVE_INFO_CHANGE', 'masked', 'masked', NOW());
SET @dummy = 1;
-- 占位符
END IF;
END // -- =============================================
-- 5. Member 表触发器
-- =============================================
-- Member 插入前触发器：验证会员信息并初始化
CREATE TRIGGER tr_member_before_insert BEFORE
INSERT ON Member FOR EACH ROW BEGIN
DECLARE user_exists INT DEFAULT 0;
DECLARE cinema_exists INT DEFAULT 0;
DECLARE member_exists INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证用户是否存在
SELECT COUNT(*) INTO user_exists
FROM `User`
WHERE user_id = NEW.user_id;
IF user_exists = 0 THEN
SET error_msg = '指定的用户不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证影院是否存在
SELECT COUNT(*) INTO cinema_exists
FROM Cinema
WHERE cinema_id = NEW.cinema_id;
IF cinema_exists = 0 THEN
SET error_msg = '指定的影院不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查用户是否已经是该影院的会员
SELECT COUNT(*) INTO member_exists
FROM Member
WHERE user_id = NEW.user_id
    AND cinema_id = NEW.cinema_id;
IF member_exists > 0 THEN
SET error_msg = '用户已经是该影院的会员';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证积分不能为负数
IF NEW.points < 0 THEN
SET error_msg = '积分不能为负数';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 设置默认积分
IF NEW.points IS NULL THEN
SET NEW.points = 0;
END IF;
END // -- Member 更新前触发器：验证更新数据
CREATE TRIGGER tr_member_before_update BEFORE
UPDATE ON Member FOR EACH ROW BEGIN
DECLARE error_msg VARCHAR(255);
-- 验证积分不能为负数
IF NEW.points < 0 THEN
SET error_msg = '积分不能为负数';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 防止修改关键字段
IF NEW.user_id != OLD.user_id THEN
SET error_msg = '不允许修改用户ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.cinema_id != OLD.cinema_id THEN
SET error_msg = '不允许修改影院ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Member 更新后触发器：记录积分变化
CREATE TRIGGER tr_member_after_update
AFTER
UPDATE ON Member FOR EACH ROW BEGIN IF OLD.points != NEW.points THEN -- INSERT INTO points_log (user_id, cinema_id, old_points, new_points, change_reason, change_time)
    -- VALUES (NEW.user_id, NEW.cinema_id, OLD.points, NEW.points, '积分变化', NOW());
SET @dummy = 1;
END IF;
END // -- =============================================
-- 6. Screening 表触发器
-- =============================================
-- Screening 插入前触发器：验证排片信息和业务规则
CREATE TRIGGER tr_screening_before_insert BEFORE
INSERT ON Screening FOR EACH ROW BEGIN
DECLARE movie_exists INT DEFAULT 0;
DECLARE hall_exists INT DEFAULT 0;
DECLARE cinema_id_val INT DEFAULT 0;
DECLARE movie_duration INT DEFAULT 0;
DECLARE movie_base_price DECIMAL(10, 2) DEFAULT 0;
DECLARE movie_release_date DATE;
DECLARE movie_end_date DATE;
DECLARE conflict_count INT DEFAULT 0;
DECLARE hall_capacity INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证电影是否存在并获取信息
SELECT COUNT(*),
    MAX(duration),
    MAX(base_price),
    MAX(release_date),
    MAX(off_shelf_date) INTO movie_exists,
    movie_duration,
    movie_base_price,
    movie_release_date,
    movie_end_date
FROM Movie
WHERE movie_id = NEW.movie_id;
IF movie_exists = 0 THEN
SET error_msg = '指定的电影不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证影厅是否存在并获取影院信息
SELECT COUNT(*),
    MAX(cinema_id),
    MAX(seat_count) INTO hall_exists,
    cinema_id_val,
    hall_capacity
FROM Hall
WHERE hall_id = NEW.hall_id;
IF hall_exists = 0 THEN
SET error_msg = '指定的影厅不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证排片时间必须是未来时间
IF NEW.screening_time <= NOW() THEN
SET error_msg = '排片时间必须是未来时间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证排片时间在电影上映期间
IF DATE(NEW.screening_time) < movie_release_date THEN
SET error_msg = '排片时间不能早于电影上映日期';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF movie_end_date IS NOT NULL
AND DATE(NEW.screening_time) > movie_end_date THEN
SET error_msg = '排片时间不能晚于电影下映日期';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查影厅时间冲突（考虑电影时长和清场时间）
SELECT COUNT(*) INTO conflict_count
FROM Screening s
    JOIN Movie m ON s.movie_id = m.movie_id
WHERE s.hall_id = NEW.hall_id
    AND (
        (
            NEW.screening_time >= s.screening_time
            AND NEW.screening_time < DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
        OR (
            DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) > s.screening_time
            AND DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) <= DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
        OR (
            NEW.screening_time <= s.screening_time
            AND DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) >= DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
    );
IF conflict_count > 0 THEN
SET error_msg = '该时间段影厅已有排片，存在时间冲突';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证票价合理性
IF NEW.ticket_price IS NOT NULL THEN IF NEW.ticket_price <= 0
OR NEW.ticket_price > 1000 THEN
SET error_msg = '票价必须在0.01-1000元之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
ELSE
SET NEW.ticket_price = movie_base_price;
END IF;
-- 设置剩余座位数
SET NEW.seat_remain = hall_capacity;
END // -- Screening 插入后触发器：创建座位
CREATE TRIGGER tr_screening_after_insert
AFTER
INSERT ON Screening FOR EACH ROW BEGIN
DECLARE row_count INT DEFAULT 10;
-- 假设每行10个座位，实际需根据影厅布局调整
DECLARE col_count INT DEFAULT 0;
DECLARE i INT DEFAULT 1;
DECLARE j INT DEFAULT 1;
DECLARE hall_capacity INT DEFAULT 0;
DECLARE done INT DEFAULT FALSE;
DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
SET done = TRUE;
-- 获取影厅容量
SELECT seat_count INTO hall_capacity
FROM Hall
WHERE hall_id = NEW.hall_id;
-- 计算列数
SET col_count = CEIL(hall_capacity / row_count);
-- 为该场次创建座位
WHILE i <= row_count
AND NOT done DO
SET j = 1;
WHILE j <= col_count
AND NOT done DO IF (i - 1) * col_count + j <= hall_capacity THEN
INSERT INTO ScreeningSeat (
        screening_id,
        seat_row,
        seat_col,
        status,
        lock_time
    )
VALUES (NEW.screening_id, i, j, '可用', NULL);
END IF;
SET j = j + 1;
END WHILE;
SET i = i + 1;
END WHILE;
-- 如果创建座位失败，记录错误
IF done THEN
SET @error_msg = CONCAT('为排片ID ', NEW.screening_id, ' 创建座位时发生错误');
END IF;
END // -- Screening 更新前触发器：验证更新操作
CREATE TRIGGER tr_screening_before_update BEFORE
UPDATE ON Screening FOR EACH ROW BEGIN
DECLARE sold_tickets INT DEFAULT 0;
DECLARE conflict_count INT DEFAULT 0;
DECLARE movie_duration INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 检查是否有已售出的票
SELECT COUNT(*) INTO sold_tickets
FROM ScreeningSeat
WHERE screening_id = NEW.screening_id
    AND status = '已售出';
-- 如果有已售票，限制某些字段的修改
IF sold_tickets > 0 THEN IF NEW.screening_time != OLD.screening_time THEN
SET error_msg = '该场次有已售出的票，无法修改放映时间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.hall_id != OLD.hall_id THEN
SET error_msg = '该场次有已售出的票，无法修改影厅';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.movie_id != OLD.movie_id THEN
SET error_msg = '该场次有已售出的票，无法修改电影';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 如果修改放映时间，检查时间冲突
IF NEW.screening_time != OLD.screening_time THEN IF NEW.screening_time <= NOW() THEN
SET error_msg = '新的放映时间必须是未来时间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
SELECT duration INTO movie_duration
FROM Movie
WHERE movie_id = NEW.movie_id;
SELECT COUNT(*) INTO conflict_count
FROM Screening s
    JOIN Movie m ON s.movie_id = m.movie_id
WHERE s.hall_id = NEW.hall_id
    AND s.screening_id != NEW.screening_id
    AND (
        (
            NEW.screening_time >= s.screening_time
            AND NEW.screening_time < DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
        OR (
            DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) > s.screening_time
            AND DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) <= DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
        OR (
            NEW.screening_time <= s.screening_time
            AND DATE_ADD(
                NEW.screening_time,
                INTERVAL (movie_duration + 30) MINUTE
            ) >= DATE_ADD(
                s.screening_time,
                INTERVAL (m.duration + 30) MINUTE
            )
        )
    );
IF conflict_count > 0 THEN
SET error_msg = '新的时间段与其他排片存在冲突';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证票价
IF NEW.ticket_price IS NOT NULL
AND (
    NEW.ticket_price <= 0
    OR NEW.ticket_price > 1000
) THEN
SET error_msg = '票价必须在0.01-1000元之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Screening 删除前触发器：检查是否有已售票
CREATE TRIGGER tr_screening_before_delete BEFORE DELETE ON Screening FOR EACH ROW BEGIN
DECLARE sold_tickets INT DEFAULT 0;
DECLARE locked_tickets INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 检查是否有已售出的票
SELECT COUNT(*) INTO sold_tickets
FROM ScreeningSeat
WHERE screening_id = OLD.screening_id
    AND status = '已售出';
IF sold_tickets > 0 THEN
SET error_msg = CONCAT('该场次有', sold_tickets, '张已售出的票，无法删除');
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查是否有锁定的座位
SELECT COUNT(*) INTO locked_tickets
FROM ScreeningSeat
WHERE screening_id = OLD.screening_id
    AND status = '已锁定';
IF locked_tickets > 0 THEN
SET error_msg = CONCAT('该场次有', locked_tickets, '个座位被锁定，请稍后再试');
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- =============================================
-- 7. ScreeningSeat 表触发器
-- =============================================
-- ScreeningSeat 更新前触发器：验证状态变更
CREATE TRIGGER tr_screening_seat_before_update BEFORE
UPDATE ON ScreeningSeat FOR EACH ROW BEGIN
DECLARE screening_time DATETIME;
DECLARE error_msg VARCHAR(255);
-- 获取排片时间
SELECT screening_time INTO screening_time
FROM Screening
WHERE screening_id = NEW.screening_id;
-- 检查是否已过放映时间
IF screening_time <= NOW() THEN
SET error_msg = '放映时间已过，无法修改座位状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证状态转换的合法性
IF OLD.status = '已售出'
AND NEW.status != '已售出' THEN
SET error_msg = '已售出的座位不能改为其他状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF OLD.status = '可用'
AND NEW.status = '已售出' THEN
SET error_msg = '座位状态不能直接从可用变为已售出，必须先锁定';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证状态值
IF NEW.status NOT IN ('可用', '已锁定', '已售出') THEN
SET error_msg = '座位状态必须是：可用、已锁定、已售出中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 设置锁定时间
IF NEW.status = '已锁定'
AND OLD.status != '已锁定' THEN
SET NEW.lock_time = NOW();
ELSEIF NEW.status != '已锁定' THEN
SET NEW.lock_time = NULL;
END IF;
END // -- ScreeningSeat 更新后触发器：更新剩余座位数
CREATE TRIGGER tr_screening_seat_after_update
AFTER
UPDATE ON ScreeningSeat FOR EACH ROW BEGIN
DECLARE available_seats INT DEFAULT 0;
-- 只有当状态发生变化时才更新剩余座位数
IF OLD.status != NEW.status THEN
SELECT COUNT(*) INTO available_seats
FROM ScreeningSeat
WHERE screening_id = NEW.screening_id
    AND status = '可用';
UPDATE Screening
SET seat_remain = available_seats
WHERE screening_id = NEW.screening_id;
END IF;
END // -- =============================================
-- 8. GroupTicketType 表触发器
-- =============================================
-- GroupTicketType 插入前触发器：验证团体票信息
CREATE TRIGGER tr_group_ticket_type_before_insert BEFORE
INSERT ON GroupTicketType FOR EACH ROW BEGIN
DECLARE cinema_exists INT DEFAULT 0;
DECLARE movie_exists INT DEFAULT 0;
DECLARE duplicate_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证影院是否存在
SELECT COUNT(*) INTO cinema_exists
FROM Cinema
WHERE cinema_id = NEW.cinema_id;
IF cinema_exists = 0 THEN
SET error_msg = '指定的影院不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证电影是否存在
SELECT COUNT(*) INTO movie_exists
FROM Movie
WHERE movie_id = NEW.movie_id;
IF movie_exists = 0 THEN
SET error_msg = '指定的电影不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查同一影院和电影的团体票类型唯一性
SELECT COUNT(*) INTO duplicate_count
FROM GroupTicketType
WHERE cinema_id = NEW.cinema_id
    AND movie_id = NEW.movie_id
    AND ticket_type = NEW.ticket_type;
IF duplicate_count > 0 THEN
SET error_msg = '该影院和电影的团体票类型已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证票价
IF NEW.unit_price IS NULL
OR NEW.unit_price <= 0 THEN
SET error_msg = '单价必须大于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证购买人数范围
IF NEW.min_client_count IS NULL
OR NEW.min_client_count <= 0
OR NEW.min_client_count > NEW.max_client_count THEN
SET error_msg = '最小购买人数必须大于0且不大于最大购买人数';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证有效期
IF NEW.valid_until IS NULL
OR NEW.valid_until <= NOW() THEN
SET error_msg = '有效期必须是未来时间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证有效期不能超过1年
IF NEW.valid_until > DATE_ADD(NOW(), INTERVAL 1 YEAR) THEN
SET error_msg = '有效期不能超过1年';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证库存
IF NEW.stock IS NULL
OR NEW.stock < 0 THEN
SET error_msg = '库存必须大于或等于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 设置默认状态
IF NEW.is_active IS NULL THEN
SET NEW.is_active = 1;
END IF;
END // -- GroupTicketType 更新前触发器：验证更新操作
CREATE TRIGGER tr_group_ticket_type_before_update BEFORE
UPDATE ON GroupTicketType FOR EACH ROW BEGIN
DECLARE duplicate_count INT DEFAULT 0;
DECLARE used_count INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 检查是否有已使用的团体票
SELECT COUNT(*) INTO used_count
FROM PurchasedGroupTicket
WHERE type_id = NEW.type_id;
-- 如果有已使用的团体票，限制某些字段的修改
IF used_count > 0 THEN IF NEW.cinema_id != OLD.cinema_id THEN
SET error_msg = '该团体票类型已有购买记录，无法修改影院';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.movie_id != OLD.movie_id THEN
SET error_msg = '该团体票类型已有购买记录，无法修改电影';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.ticket_type != OLD.ticket_type THEN
SET error_msg = '该团体票类型已有购买记录，无法修改票类型';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 检查名称重复（排除当前记录）
SELECT COUNT(*) INTO duplicate_count
FROM GroupTicketType
WHERE cinema_id = NEW.cinema_id
    AND movie_id = NEW.movie_id
    AND ticket_type = NEW.ticket_type
    AND type_id != NEW.type_id;
IF duplicate_count > 0 THEN
SET error_msg = '该影院和电影的团体票类型已存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证票价
IF NEW.unit_price IS NULL
OR NEW.unit_price <= 0 THEN
SET error_msg = '单价必须大于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证购买人数范围
IF NEW.min_client_count IS NULL
OR NEW.min_client_count <= 0
OR NEW.min_client_count > NEW.max_client_count THEN
SET error_msg = '最小购买人数必须大于0且不大于最大购买人数';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证有效期
IF NEW.valid_until IS NULL THEN
SET error_msg = '有效期不能为空';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证有效期不能超过1年
IF NEW.valid_until > DATE_ADD(NOW(), INTERVAL 1 YEAR) THEN
SET error_msg = '有效期不能超过1年';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证库存
IF NEW.stock IS NULL
OR NEW.stock < 0 THEN
SET error_msg = '库存必须大于或等于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果过期，自动设置为无效
IF NEW.valid_until <= NOW()
AND NEW.is_active = 1 THEN
SET NEW.is_active = 0;
END IF;
END // -- =============================================
-- 9. PurchasedGroupTicket 表触发器
-- =============================================
-- PurchasedGroupTicket 插入前触发器：验证购买信息
CREATE TRIGGER tr_purchased_group_ticket_before_insert BEFORE
INSERT ON PurchasedGroupTicket FOR EACH ROW BEGIN
DECLARE ticket_exists INT DEFAULT 0;
DECLARE ticket_valid_until DATETIME;
DECLARE min_client_count INT DEFAULT 0;
DECLARE max_client_count INT DEFAULT 0;
DECLARE unit_price_val DECIMAL(10, 2);
DECLARE user_exists INT DEFAULT 0;
DECLARE cinema_id_val INT;
DECLARE error_msg VARCHAR(255);
-- 验证用户是否存在
SELECT COUNT(*) INTO user_exists
FROM `User`
WHERE user_id = NEW.user_id;
IF user_exists = 0 THEN
SET error_msg = '指定的用户不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证团体票类型信息
SELECT COUNT(*),
    valid_until,
    min_client_count,
    max_client_count,
    unit_price,
    cinema_id INTO ticket_exists,
    ticket_valid_until,
    min_client_count,
    max_client_count,
    unit_price_val,
    cinema_id_val
FROM GroupTicketType
WHERE type_id = NEW.type_id;
IF ticket_exists = 0 THEN
SET error_msg = '团体票类型不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证团体票状态
IF (
    SELECT is_active
    FROM GroupTicketType
    WHERE type_id = NEW.type_id
) != 1 THEN
SET error_msg = '团体票类型当前不可用';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证有效期
IF ticket_valid_until <= NOW() THEN
SET error_msg = '团体票类型已过期';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证购买数量
IF NEW.ticket_count IS NULL
OR NEW.ticket_count <= 0 THEN
SET error_msg = '购买数量必须大于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.ticket_count < min_client_count THEN
SET error_msg = CONCAT('购买数量不能少于', min_client_count, '张');
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.ticket_count > max_client_count THEN
SET error_msg = CONCAT('购买数量不能超过', max_client_count, '张');
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- PurchasedGroupTicket 插入后触发器：更新相关统计
CREATE TRIGGER tr_purchased_group_ticket_after_insert
AFTER
INSERT ON PurchasedGroupTicket FOR EACH ROW BEGIN
DECLARE cinema_id_val INT;
DECLARE member_exists INT DEFAULT 0;
DECLARE current_points INT DEFAULT 0;
DECLARE points_to_add INT DEFAULT 0;
DECLARE unit_price_val DECIMAL(10, 2);
-- 获取影院ID和单价
SELECT cinema_id,
    unit_price INTO cinema_id_val,
    unit_price_val
FROM GroupTicketType
WHERE type_id = NEW.type_id;
-- 检查用户是否是该影院的会员
SELECT COUNT(*),
    COALESCE(points, 0) INTO member_exists,
    current_points
FROM Member
WHERE user_id = NEW.user_id
    AND cinema_id = cinema_id_val;
-- 如果是会员，增加积分（每消费1元增加1积分）
IF member_exists > 0 THEN
SET points_to_add = FLOOR(NEW.ticket_count * unit_price_val);
UPDATE Member
SET points = points + points_to_add
WHERE user_id = NEW.user_id
    AND cinema_id = cinema_id_val;
END IF;
END // -- =============================================
-- 10. Order 表触发器
-- =============================================
-- Order 插入前触发器：生成订单号并验证
CREATE TRIGGER tr_order_before_insert BEFORE
INSERT ON `Order` FOR EACH ROW BEGIN
DECLARE user_exists INT DEFAULT 0;
DECLARE screening_exists INT DEFAULT 0;
DECLARE screening_time DATETIME;
DECLARE error_msg VARCHAR(255);
-- 验证用户是否存在
SELECT COUNT(*) INTO user_exists
FROM `User`
WHERE user_id = NEW.user_id;
IF user_exists = 0 THEN
SET error_msg = '指定的用户不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果是常规订单，验证排片信息
IF NEW.purchase_type = 'regular'
AND NEW.screening_id IS NOT NULL THEN
SELECT COUNT(*),
    screening_time INTO screening_exists,
    screening_time
FROM Screening
WHERE screening_id = NEW.screening_id;
IF screening_exists = 0 THEN
SET error_msg = '指定的排片不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF screening_time <= NOW() THEN
SET error_msg = '该场次已开始或已结束，无法购票';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 生成订单号
IF NEW.order_number IS NULL
OR NEW.order_number = '' THEN
SET NEW.order_number = CONCAT(
        'ORD',
        DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),
        LPAD(FLOOR(RAND() * 10000), 4, '0')
    );
END IF;
-- 设置订单时间
IF NEW.order_time IS NULL THEN
SET NEW.order_time = NOW();
END IF;
-- 验证支付金额
IF NEW.cost_number IS NULL
OR NEW.cost_number <= 0 THEN
SET error_msg = '支付金额必须大于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证购买类型
IF NEW.purchase_type NOT IN ('regular', 'group') THEN
SET error_msg = '购买类型必须是：regular（常规）或group（团体）';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 设置默认状态
IF NEW.status IS NULL THEN
SET NEW.status = '已付';
END IF;
-- 验证状态值
IF NEW.status NOT IN ('待定', '已付', '已取消') THEN
SET error_msg = '订单状态必须是：待定、已付、已取消中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果状态是已付，设置支付时间
IF NEW.status = '已付'
AND NEW.payment_time IS NULL THEN
SET NEW.payment_time = NOW();
END IF;
END // -- Order 更新前触发器：验证状态变更
CREATE TRIGGER tr_order_before_update BEFORE
UPDATE ON `Order` FOR EACH ROW BEGIN
DECLARE screening_time DATETIME;
DECLARE error_msg VARCHAR(255);
-- 验证状态转换的合法性
IF OLD.status = '已取消'
AND NEW.status != '已取消' THEN
SET error_msg = '已取消的订单不能改为其他状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证状态值
IF NEW.status NOT IN ('待定', '已付', '已取消') THEN
SET error_msg = '订单状态必须是：待定、已付、已取消中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果是常规订单且要取消，检查是否还能取消
IF OLD.status != '已取消'
AND NEW.status = '已取消'
AND NEW.purchase_type = 'regular'
AND NEW.screening_id IS NOT NULL THEN
SELECT screening_time INTO screening_time
FROM Screening
WHERE screening_id = NEW.screening_id;
IF screening_time <= DATE_ADD(NOW(), INTERVAL 30 MINUTE) THEN
SET error_msg = '开场前30分钟内不能取消订单';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 设置支付时间
IF OLD.status != '已付'
AND NEW.status = '已付'
AND NEW.payment_time IS NULL THEN
SET NEW.payment_time = NOW();
END IF;
END // -- Order 更新后触发器：处理订单状态变化
CREATE TRIGGER tr_order_after_update
AFTER
UPDATE ON `Order` FOR EACH ROW BEGIN
DECLARE cinema_id_val INT;
DECLARE member_exists INT DEFAULT 0;
DECLARE points_to_add INT DEFAULT 0;
-- 如果订单被取消，释放座位
IF OLD.status != '已取消'
AND NEW.status = '已取消' THEN IF NEW.purchase_type = 'regular'
AND NEW.screening_id IS NOT NULL THEN
UPDATE ScreeningSeat
SET status = '可用',
    lock_time = NULL
WHERE screening_id = NEW.screening_id
    AND screening_seat_id IN (
        SELECT screening_seat_id
        FROM Verification
        WHERE order_id = NEW.order_id
    );
END IF;
END IF;
-- 如果订单从待定变为已付，给会员增加积分
IF OLD.status = '待定'
AND NEW.status = '已付' THEN IF NEW.purchase_type = 'regular'
AND NEW.screening_id IS NOT NULL THEN
SELECT c.cinema_id INTO cinema_id_val
FROM Screening s
    JOIN Hall h ON s.hall_id = h.hall_id
    JOIN Cinema c ON h.cinema_id = c.cinema_id
WHERE s.screening_id = NEW.screening_id;
ELSEIF NEW.purchase_type = 'group' THEN
SELECT gtt.cinema_id INTO cinema_id_val
FROM PurchasedGroupTicket pgt
    JOIN GroupTicketType gtt ON pgt.type_id = gtt.type_id
WHERE pgt.purchased_ticket_id = NEW.purchased_ticket_id
LIMIT 1;
END IF;
IF cinema_id_val IS NOT NULL THEN
SELECT COUNT(*) INTO member_exists
FROM Member
WHERE user_id = NEW.user_id
    AND cinema_id = cinema_id_val;
IF member_exists > 0 THEN
SET points_to_add = FLOOR(NEW.cost_number);
UPDATE Member
SET points = points + points_to_add
WHERE user_id = NEW.user_id
    AND cinema_id = cinema_id_val;
END IF;
END IF;
END IF;
END // -- =============================================
-- 11. Verification 表触发器
-- =============================================
-- Verification 插入前触发器：生成核验码并验证
CREATE TRIGGER tr_verification_before_insert BEFORE
INSERT ON Verification FOR EACH ROW BEGIN
DECLARE order_exists INT DEFAULT 0;
DECLARE order_status VARCHAR(10);
DECLARE user_id_val INT;
DECLARE screening_exists INT DEFAULT 0;
DECLARE seat_status VARCHAR(10);
DECLARE error_msg VARCHAR(255);
-- 验证订单是否存在且有效
SELECT COUNT(*),
    status,
    user_id INTO order_exists,
    order_status,
    user_id_val
FROM `Order`
WHERE order_id = NEW.order_id;
IF order_exists = 0 THEN
SET error_msg = '指定的订单不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF order_status != '已付' THEN
SET error_msg = '只有已支付的订单才能生成验证码';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 如果指定了座位，验证座位信息
IF NEW.screening_seat_id IS NOT NULL THEN
SELECT COUNT(*),
    status INTO screening_exists,
    seat_status
FROM ScreeningSeat
WHERE screening_seat_id = NEW.screening_seat_id;
IF screening_exists = 0 THEN
SET error_msg = '指定的座位不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF seat_status != '已锁定' THEN
SET error_msg = '座位状态必须是已锁定才能生成验证码';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 生成唯一核验码
IF NEW.verification_code IS NULL
OR NEW.verification_code = '' THEN
SET NEW.verification_code = UPPER(
        CONCAT(
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(user_id_val, 4, '0'),
            LPAD(FLOOR(RAND() * 10000), 4, '0')
        )
    );
END IF;
-- 设置默认值
IF NEW.is_used IS NULL THEN
SET NEW.is_used = 0;
END IF;
END // -- Verification 更新前触发器：验证核销操作
CREATE TRIGGER tr_verification_before_update BEFORE
UPDATE ON Verification FOR EACH ROW BEGIN
DECLARE screening_time DATETIME;
DECLARE seat_status VARCHAR(10);
DECLARE error_msg VARCHAR(255);
-- 如果要标记为已使用，进行验证
IF OLD.is_used = 0
AND NEW.is_used = 1 THEN IF NEW.screening_seat_id IS NOT NULL THEN
SELECT s.screening_time,
    ss.status INTO screening_time,
    seat_status
FROM ScreeningSeat ss
    JOIN Screening s ON ss.screening_id = s.screening_id
WHERE ss.screening_seat_id = NEW.screening_seat_id;
IF screening_time > DATE_ADD(NOW(), INTERVAL 2 HOUR) THEN
SET error_msg = '开场前2小时内才能核销';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF screening_time < DATE_SUB(NOW(), INTERVAL 30 MINUTE) THEN
SET error_msg = '开场后30分钟内无法核销';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF seat_status != '已锁定' THEN
SET error_msg = '只有已锁定的座位才能核销';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
SET NEW.use_time = NOW();
END IF;
-- 验证已使用的验证码不能改回未使用
IF OLD.is_used = 1
AND NEW.is_used = 0 THEN
SET error_msg = '已使用的验证码不能改回未使用状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Verification 更新后触发器：处理核销后续操作
CREATE TRIGGER tr_verification_after_update
AFTER
UPDATE ON Verification FOR EACH ROW BEGIN IF OLD.is_used = 0
    AND NEW.is_used = 1 THEN IF NEW.screening_seat_id IS NOT NULL THEN
UPDATE ScreeningSeat
SET status = '已售出',
    lock_time = NULL
WHERE screening_seat_id = NEW.screening_seat_id;
END IF;
END IF;
END // -- =============================================
-- 12. Review 表触发器
-- =============================================
-- Review 插入前触发器：验证评论信息
CREATE TRIGGER tr_review_before_insert BEFORE
INSERT ON Review FOR EACH ROW BEGIN
DECLARE user_exists INT DEFAULT 0;
DECLARE movie_exists INT DEFAULT 0;
DECLARE screening_exists INT DEFAULT 0;
DECLARE has_watched INT DEFAULT 0;
DECLARE duplicate_review INT DEFAULT 0;
DECLARE error_msg VARCHAR(255);
-- 验证用户是否存在
SELECT COUNT(*) INTO user_exists
FROM `User`
WHERE user_id = NEW.user_id;
IF user_exists = 0 THEN
SET error_msg = '指定的用户不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证电影是否存在
SELECT COUNT(*) INTO movie_exists
FROM Movie
WHERE movie_id = NEW.movie_id;
IF movie_exists = 0 THEN
SET error_msg = '指定的电影不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证排片是否存在
SELECT COUNT(*) INTO screening_exists
FROM Screening
WHERE screening_id = NEW.screening_id;
IF screening_exists = 0 THEN
SET error_msg = '指定的排片不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证用户是否观看过该场次
SELECT COUNT(*) INTO has_watched
FROM `Order` o
    JOIN Verification v ON o.order_id = v.order_id
WHERE o.user_id = NEW.user_id
    AND o.screening_id = NEW.screening_id
    AND o.status = '已付'
    AND v.is_used = 1;
IF has_watched = 0 THEN
SET error_msg = '只有观看过该场次的用户才能评论';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 检查是否已经评论过
SELECT COUNT(*) INTO duplicate_review
FROM Review
WHERE user_id = NEW.user_id
    AND screening_id = NEW.screening_id;
IF duplicate_review > 0 THEN
SET error_msg = '您已经对该场次进行过评论';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证评分
IF NEW.rating IS NOT NULL
AND (
    NEW.rating < 1.0
    OR NEW.rating > 5.0
) THEN
SET error_msg = '评分必须在1.0-5.0之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证评论内容
IF NEW.comment IS NOT NULL
AND LENGTH(TRIM(NEW.comment)) > 1000 THEN
SET error_msg = '评论内容不能超过1000个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
IF NEW.comment IS NOT NULL THEN
SET NEW.comment = TRIM(NEW.comment);
END IF;
-- 设置默认值
IF NEW.review_time IS NULL THEN
SET NEW.review_time = NOW();
END IF;
IF NEW.status IS NULL THEN
SET NEW.status = '批准';
END IF;
-- 验证状态值
IF NEW.status NOT IN ('待定', '批准', '拒绝') THEN
SET error_msg = '评论状态必须是：待定、批准、拒绝中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Review 插入后触发器：更新电影评分
CREATE TRIGGER tr_review_after_insert
AFTER
INSERT ON Review FOR EACH ROW BEGIN
DECLARE avg_rating DECIMAL(3, 1);
DECLARE review_count INT DEFAULT 0;
-- 只有当新评论状态为'批准'且有评分时才更新电影评分
IF NEW.status = '批准'
AND NEW.rating IS NOT NULL THEN
SELECT AVG(rating),
    COUNT(*) INTO avg_rating,
    review_count
FROM Review
WHERE movie_id = NEW.movie_id
    AND status = '批准'
    AND rating IS NOT NULL;
UPDATE Movie
SET rating = ROUND(avg_rating, 1)
WHERE movie_id = NEW.movie_id;
END IF;
END // -- Review 更新前触发器：验证评论更新
CREATE TRIGGER tr_review_before_update BEFORE
UPDATE ON Review FOR EACH ROW BEGIN
DECLARE error_msg VARCHAR(255);
-- 验证评分
IF NEW.rating IS NOT NULL
AND (
    NEW.rating < 1.0
    OR NEW.rating > 5.0
) THEN
SET error_msg = '评分必须在1.0-5.0之间';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证评论内容
IF NEW.comment IS NOT NULL
AND LENGTH(TRIM(NEW.comment)) > 1000 THEN
SET error_msg = '评论内容不能超过1000个字符';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证状态值
IF NEW.status NOT IN ('待定', '批准', '拒绝') THEN
SET error_msg = '评论状态必须是：待定、批准、拒绝中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 防止修改关键字段
IF NEW.user_id != OLD.user_id THEN
SET error_msg = '不允许修改评论的用户ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.movie_id != OLD.movie_id THEN
SET error_msg = '不允许修改评论的电影ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF NEW.screening_id != OLD.screening_id THEN
SET error_msg = '不允许修改评论的排片ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 标准化数据
IF NEW.comment IS NOT NULL THEN
SET NEW.comment = TRIM(NEW.comment);
END IF;
END // -- Review 更新后触发器：更新电影评分
CREATE TRIGGER tr_review_after_update
AFTER
UPDATE ON Review FOR EACH ROW BEGIN
DECLARE avg_rating DECIMAL(3, 1);
DECLARE review_count INT DEFAULT 0;
-- 如果评分或状态发生变化，更新电影评分
IF (
    OLD.rating != NEW.rating
    OR OLD.status != NEW.status
)
AND NEW.status = '批准'
AND NEW.rating IS NOT NULL THEN
SELECT AVG(rating),
    COUNT(*) INTO avg_rating,
    review_count
FROM Review
WHERE movie_id = NEW.movie_id
    AND status = '批准'
    AND rating IS NOT NULL;
UPDATE Movie
SET rating = ROUND(avg_rating, 1)
WHERE movie_id = NEW.movie_id;
END IF;
-- 如果状态从批准变为非批准，重新计算评分
IF OLD.status = '批准'
AND NEW.status != '批准' THEN
SELECT AVG(rating),
    COUNT(*) INTO avg_rating,
    review_count
FROM Review
WHERE movie_id = NEW.movie_id
    AND status = '批准'
    AND rating IS NOT NULL;
IF review_count = 0 THEN
UPDATE Movie
SET rating = 5.0
WHERE movie_id = NEW.movie_id;
ELSE
UPDATE Movie
SET rating = ROUND(avg_rating, 1)
WHERE movie_id = NEW.movie_id;
END IF;
END IF;
END // -- =============================================
-- 13. Refund 表触发器
-- =============================================
-- Refund 插入前触发器：验证退款信息
CREATE TRIGGER tr_refund_before_insert BEFORE
INSERT ON Refund FOR EACH ROW BEGIN
DECLARE order_exists INT DEFAULT 0;
DECLARE order_status VARCHAR(10);
DECLARE screening_time DATETIME;
DECLARE purchase_type VARCHAR(20);
DECLARE error_msg VARCHAR(255);
-- 验证订单是否存在
SELECT COUNT(*),
    status,
    purchase_type,
    screening_id INTO order_exists,
    order_status,
    purchase_type,
    screening_time
FROM `Order`
WHERE order_id = NEW.order_id;
IF order_exists = 0 THEN
SET error_msg = '指定的订单不存在';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证订单状态
IF order_status != '已付' THEN
SET error_msg = '只有已支付的订单可以发起退款';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 对于常规订单，检查是否在开场前30分钟
IF purchase_type = 'regular'
AND screening_time IS NOT NULL THEN
SELECT screening_time INTO screening_time
FROM Screening
WHERE screening_id = screening_time;
IF screening_time <= DATE_ADD(NOW(), INTERVAL 30 MINUTE) THEN
SET error_msg = '常规订单开场前30分钟内不能退款';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END IF;
-- 验证退款金额
IF NEW.refund_amount IS NULL
OR NEW.refund_amount <= 0 THEN
SET error_msg = '退款金额必须大于0';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证退款方式
IF NEW.refund_method IS NOT NULL
AND NEW.refund_method NOT IN ('银行卡', '支付宝', '微信') THEN
SET error_msg = '退款方式必须是：银行卡、支付宝、微信中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 设置默认值
IF NEW.refund_time IS NULL THEN
SET NEW.refund_time = NOW();
END IF;
IF NEW.status IS NULL THEN
SET NEW.status = '处理中';
END IF;
-- 验证状态值
IF NEW.status NOT IN ('处理中', '已完成', '失败') THEN
SET error_msg = '退款状态必须是：处理中、已完成、失败中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Refund 更新前触发器：验证状态变更
CREATE TRIGGER tr_refund_before_update BEFORE
UPDATE ON Refund FOR EACH ROW BEGIN
DECLARE error_msg VARCHAR(255);
-- 验证状态转换
IF OLD.status = '已完成'
AND NEW.status != '已完成' THEN
SET error_msg = '已完成的退款不能更改状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
IF OLD.status = '失败'
AND NEW.status != '失败' THEN
SET error_msg = '失败的退款不能更改状态';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 验证状态值
IF NEW.status NOT IN ('处理中', '已完成', '失败') THEN
SET error_msg = '退款状态必须是：处理中、已完成、失败中的一种';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
-- 防止修改关键字段
IF NEW.order_id != OLD.order_id THEN
SET error_msg = '不允许修改退款的订单ID';
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = error_msg;
END IF;
END // -- Refund 更新后触发器：处理退款状态变化
CREATE TRIGGER tr_refund_after_update
AFTER
UPDATE ON Refund FOR EACH ROW BEGIN
DECLARE cinema_id_val INT;
DECLARE member_exists INT DEFAULT 0;
DECLARE points_to_deduct INT DEFAULT 0;
-- 如果退款完成，更新订单状态并释放座位
IF OLD.status != '已完成'
AND NEW.status = '已完成' THEN
UPDATE `Order`
SET status = '已取消'
WHERE order_id = NEW.order_id;
-- 释放座位
IF (
    SELECT purchase_type
    FROM `Order`
    WHERE order_id = NEW.order_id
) = 'regular' THEN
UPDATE ScreeningSeat
SET status = '可用',
    lock_time = NULL
WHERE screening_seat_id IN (
        SELECT screening_seat_id
        FROM Verification
        WHERE order_id = NEW.order_id
    );
END IF;
-- 扣除会员积分
SELECT o.user_id,
    o.purchase_type,
    o.screening_id,
    o.purchased_ticket_id INTO @user_id,
    @purchase_type,
    @screening_id,
    @purchased_ticket_id
FROM `Order` o
WHERE o.order_id = NEW.order_id;
IF @purchase_type = 'regular'
AND @screening_id IS NOT NULL THEN
SELECT c.cinema_id INTO cinema_id_val
FROM Screening s
    JOIN Hall h ON s.hall_id = h.hall_id
    JOIN Cinema c ON h.cinema_id = c.cinema_id
WHERE s.screening_id = @screening_id;
ELSEIF @purchase_type = 'group'
AND @purchased_ticket_id IS NOT NULL THEN
SELECT gtt.cinema_id INTO cinema_id_val
FROM PurchasedGroupTicket pgt
    JOIN GroupTicketType gtt ON pgt.type_id = gtt.type_id
WHERE pgt.purchased_ticket_id = @purchased_ticket_id;
END IF;
IF cinema_id_val IS NOT NULL THEN
SELECT COUNT(*) INTO member_exists
FROM Member
WHERE user_id = @user_id
    AND cinema_id = cinema_id_val;
IF member_exists > 0 THEN
SET points_to_deduct = FLOOR(NEW.refund_amount);
UPDATE Member
SET points = GREATEST(points - points_to_deduct, 0)
WHERE user_id = @user_id
    AND cinema_id = cinema_id_val;
END IF;
END IF;
END IF;
END // -- =============================================
-- 14. 事件调度器
-- =============================================
-- 清理过期的座位锁定
CREATE EVENT IF NOT EXISTS clear_expired_locks ON SCHEDULE EVERY 10 MINUTE DO BEGIN
DECLARE affected_rows INT DEFAULT 0;
-- 清理超过15分钟的锁定座位
UPDATE ScreeningSeat
SET status = '可用',
    lock_time = NULL
WHERE status = '已锁定'
    AND lock_time < DATE_SUB(NOW(), INTERVAL 15 MINUTE);
SET affected_rows = ROW_COUNT();
-- INSERT INTO system_log (event_type, description, event_time)
-- VALUES ('CLEAR_EXPIRED_LOCKS', CONCAT('清理了 ', affected_rows, ' 个过期的座位锁定'), NOW());
END // -- 清理过期的团体票类型
CREATE EVENT IF NOT EXISTS clear_expired_group_tickets ON SCHEDULE EVERY 1 DAY DO BEGIN
UPDATE GroupTicketType
SET is_active = 0
WHERE valid_until < NOW()
    AND is_active = 1;
-- INSERT INTO system_log (event_type, description, event_time)
-- VALUES ('CLEAR_EXPIRED_GROUP_TICKETS', '清理了过期的团体票类型', NOW());
END // -- 自动更新电影评分
CREATE EVENT IF NOT EXISTS update_movie_ratings ON SCHEDULE EVERY 1 HOUR DO BEGIN
DECLARE done INT DEFAULT FALSE;
DECLARE movie_id_val INT;
DECLARE avg_rating DECIMAL(3, 1);
DECLARE review_count INT;
DECLARE cur CURSOR FOR
SELECT movie_id
FROM Movie;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
OPEN cur;
read_loop: LOOP FETCH cur INTO movie_id_val;
IF done THEN LEAVE read_loop;
END IF;
SELECT AVG(rating),
    COUNT(*) INTO avg_rating,
    review_count
FROM Review
WHERE movie_id = movie_id_val
    AND status = '批准'
    AND rating IS NOT NULL;
IF review_count > 0 THEN
UPDATE Movie
SET rating = ROUND(avg_rating, 1)
WHERE movie_id = movie_id_val;
ELSE
UPDATE Movie
SET rating = 5.0
WHERE movie_id = movie_id_val;
END IF;
END LOOP;
CLOSE cur;
END // -- 启用事件调度器
SET GLOBAL event_scheduler = ON;
-- 恢复分隔符
DELIMITER;