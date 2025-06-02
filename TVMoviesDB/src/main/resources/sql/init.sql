-- 天佑电影数据库初始化脚本
CREATE DATABASE IF NOT EXISTS tianyoudb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tianyoudb;
-- 1. 影院表
CREATE TABLE IF NOT EXISTS Cinema (
    cinema_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '影院ID',
    name VARCHAR(50) NOT NULL COMMENT '影院名称',
    address VARCHAR(120) NOT NULL COMMENT '影院地址',
    contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话'
) COMMENT = '影院表';
-- 2. 影厅表
CREATE TABLE IF NOT EXISTS Hall (
    hall_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '影厅ID',
    hall_name VARCHAR(50) NOT NULL COMMENT '影厅名称',
    cinema_id INT NOT NULL COMMENT '所属影院ID',
    seat_count INT NOT NULL CHECK (capacity > 0) COMMENT '座位容量',
    hall_type ENUM('2D', '3D', 'IMAX', '杜比', '4D', '动感', '巨幕') NOT NULL COMMENT '影厅类型',
    FOREIGN KEY (cinema_id) REFERENCES Cinema(cinema_id) ON DELETE CASCADE,
    INDEX idx_hall_cinema (cinema_id)
) COMMENT = '影厅表';
-- 3. 电影表
CREATE TABLE IF NOT EXISTS Movie (
    movie_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '电影ID',
    title VARCHAR(100) NOT NULL COMMENT '电影名称',
    description TEXT NOT NULL COMMENT '简介',
    actors TEXT NOT NULL COMMENT '演职人员',
    director VARCHAR(50) NOT NULL COMMENT '导演',
    duration INT NOT NULL CHECK (duration > 0) COMMENT '时长（分钟）',
    release_date DATE NOT NULL COMMENT '上映日期',
    off_shelf_date DATE NOT NULL COMMENT '撤档日期',
    category TEXT NOT NULL COMMENT '分类名称',
    rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (
        rating >= 1.0
        AND rating <= 5.0
    ) COMMENT '评分',
    release_region VARCHAR(50) NOT NULL COMMENT '制片国家/地区',
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0) COMMENT '指导价格',
    INDEX idx_movie_release (release_date)
) COMMENT = '电影表';
-- 4. 用户表
CREATE TABLE IF NOT EXISTS `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    name VARCHAR(50) NOT NULL COMMENT '用户名',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(100) NOT NULL CHECK (
        password REGEXP '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,100}$'
    ) COMMENT '密码，需含数字、字母、特殊字符，最小8位',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    is_admin TINYINT(1) DEFAULT 0 COMMENT '是否管理员（0:普通用户, 1:管理员）',
    INDEX idx_user_phone (phone)
) COMMENT = '用户表';
-- 5. 会员表
CREATE TABLE IF NOT EXISTS Member (
    user_id INT NOT NULL COMMENT '用户ID',
    cinema_id INT NOT NULL COMMENT '影院ID',
    points INT NOT NULL DEFAULT 0 CHECK (points >= 0) COMMENT '观影积分',
    PRIMARY KEY (user_id, cinema_id),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cinema_id) REFERENCES Cinema(cinema_id) ON DELETE CASCADE
) COMMENT = '会员表';
-- 6. 场次表
CREATE TABLE IF NOT EXISTS Screening (
    screening_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '场次ID',
    movie_id INT NOT NULL COMMENT '放映电影ID',
    hall_id INT NOT NULL COMMENT '所属影厅ID',
    screening_time DATETIME NOT NULL COMMENT '放映时间',
    ticket_price DECIMAL(10, 2) NOT NULL CHECK (ticket_price > 0) COMMENT '票价',
    seat_remain INT NOT NULL CHECK (seat_remain >= 0) COMMENT '剩余座位数量',
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (hall_id) REFERENCES Hall(hall_id) ON DELETE CASCADE,
    INDEX idx_screening_time (screening_time)
) COMMENT = '场次表';
-- 7. 场次座位表
CREATE TABLE IF NOT EXISTS ScreeningSeat (
    screening_seat_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '场次座位ID',
    screening_id INT NOT NULL COMMENT '场次ID',
    seat_row INT NOT NULL COMMENT '座位行号',
    seat_col INT NOT NULL COMMENT '座位列号',
    status ENUM('可用', '已锁定', '已售出') NOT NULL COMMENT '座位状态',
    lock_time DATETIME COMMENT '座位锁定时间',
    FOREIGN KEY (screening_id) REFERENCES Screening(screening_id) ON DELETE CASCADE,
    UNIQUE (screening_id, seat_row, seat_col)
) COMMENT = '场次座位表';
-- 8. 团购票类型表
CREATE TABLE IF NOT EXISTS GroupTicketType (
    type_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '团购票类型ID',
    ticket_type ENUM('学生票', '亲子票', '团体票') NOT NULL COMMENT '团购票类型',
    cinema_id INT NOT NULL COMMENT '所属影院ID',
    movie_id INT NOT NULL COMMENT '所属电影ID',
    min_client_count INT NOT NULL CHECK (min_client_count > 0) COMMENT '团购人数下限',
    max_client_count INT NOT NULL CHECK (max_client_count > 0) COMMENT '团购人数上限',
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0) COMMENT '单价',
    valid_until DATE NOT NULL COMMENT '有效日期',
    stock INT NOT NULL CHECK (stock >= 0) COMMENT '库存数量',
    is_active TINYINT(1) NOT NULL COMMENT '是否上架（1:上架, 0:下架）',
    FOREIGN KEY (cinema_id) REFERENCES Cinema(cinema_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    UNIQUE (ticket_type, cinema_id, movie_id)
) COMMENT = '团购票类型表';
-- 9. 已购团购票表
CREATE TABLE IF NOT EXISTS PurchasedGroupTicket (
    purchased_ticket_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '团购票ID',
    type_id INT NOT NULL COMMENT '团购票类型ID',
    user_id INT NOT NULL COMMENT '用户ID',
    unit_name VARCHAR(100) NOT NULL COMMENT '购买单位名称',
    ticket_count INT NOT NULL CHECK (ticket_count > 0) COMMENT '团购票张数',
    screening_id INT COMMENT '使用时的场次ID',
    FOREIGN KEY (type_id) REFERENCES GroupTicketType(type_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES Screening(screening_id) ON DELETE
    SET NULL
) COMMENT = '已购团购票表';
-- 12. 订单表
CREATE TABLE IF NOT EXISTS `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
    user_id INT NOT NULL COMMENT '用户ID',
    purchase_type ENUM('regular', 'group') NOT NULL COMMENT '订单类型',
    screening_id INT COMMENT '场次ID',
    purchased_ticket_id INT COMMENT '团购票ID',
    order_number VARCHAR(20) NOT NULL UNIQUE COMMENT '订单编号',
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '订单时间',
    status ENUM('待定', '已付', '已取消') NOT NULL COMMENT '订单状态',
    payment_method ENUM('信用卡', '微信', '支付宝') NOT NULL COMMENT '支付方式',
    bank_card_number VARCHAR(50) COMMENT '银行卡号',
    cost_number DECIMAL(10, 2) NOT NULL CHECK (cost_number > 0) COMMENT '支付金额',
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
    ticket_status ENUM('未使用', '已使用', '已退还') NOT NULL COMMENT '票务状态',
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES Screening(screening_id) ON DELETE
    SET NULL,
        FOREIGN KEY (purchased_ticket_id) REFERENCES PurchasedGroupTicket(purchased_ticket_id) ON DELETE
    SET NULL
) COMMENT = '订单表';
-- 触发器：确保 purchase_type 和 screening_id/purchased_ticket_id 的逻辑
DELIMITER // CREATE TRIGGER order_check BEFORE
INSERT ON `Order` FOR EACH ROW BEGIN IF (
        NEW.purchase_type = 'regular'
        AND (
            NEW.screening_id IS NULL
            OR NEW.purchased_ticket_id IS NOT NULL
        )
    )
    OR (
        NEW.purchase_type = 'group'
        AND (
            NEW.screening_id IS NOT NULL
            OR NEW.purchased_ticket_id IS NULL
        )
    ) THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = '订单类型与对应的场次id/团购票id不匹配';
END IF;
END // DELIMITER;
-- 10. 待核验券表
CREATE TABLE IF NOT EXISTS Verification (
    verification_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '待核验券ID',
    purchased_ticket_id INT COMMENT '团购票ID',
    order_id INT COMMENT '订单ID',
    verification_code VARCHAR(16) NOT NULL UNIQUE COMMENT '核验码',
    user_id INT NOT NULL COMMENT '用户ID',
    is_used TINYINT(1) DEFAULT 0 COMMENT '是否使用（0:未使用, 1:已使用）',
    use_time DATETIME COMMENT '核销时间',
    screening_seat_id INT COMMENT '场次座位ID',
    FOREIGN KEY (purchased_ticket_id) REFERENCES PurchasedGroupTicket(purchased_ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_seat_id) REFERENCES ScreeningSeat(screening_seat_id) ON DELETE
    SET NULL
) COMMENT = '待核验券表';
-- 触发器：确保 purchased_ticket_id 和 order_id 只有一个不为空
DELIMITER // CREATE TRIGGER verification_check BEFORE
INSERT ON Verification FOR EACH ROW BEGIN IF (
        NEW.purchased_ticket_id IS NOT NULL
        AND NEW.order_id IS NOT NULL
    )
    OR (
        NEW.purchased_ticket_id IS NULL
        AND NEW.order_id IS NULL
    ) THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'purchased_ticket_id 和 order_id 只有一个不为空';
END IF;
END // DELIMITER;
-- 11. 评论表（无变化，检查约束无冲突）
CREATE TABLE IF NOT EXISTS Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
    user_id INT NOT NULL COMMENT '用户ID',
    movie_id INT NOT NULL COMMENT '电影ID',
    screening_id INT NOT NULL COMMENT '场次ID',
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
    rating DECIMAL(2, 1) CHECK (
        rating >= 1.0
        AND rating <= 5.0
    ) COMMENT '评分',
    comment TEXT COMMENT '评论内容',
    status ENUM('待定', '批准', '拒绝') DEFAULT '批准' COMMENT '评论状态',
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES Screening(screening_id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id, screening_id)
) COMMENT = '评论表';
-- 13. 退款记录表（无变化，检查约束无冲突）
CREATE TABLE IF NOT EXISTS Refund (
    refund_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '退款记录ID',
    order_id INT NOT NULL COMMENT '订单ID',
    refund_amount DECIMAL(10, 2) NOT NULL CHECK (refund_amount > 0) COMMENT '退款金额',
    refund_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '退款时间',
    refund_method ENUM('信用卡', '微信', '支付宝') NOT NULL COMMENT '退款方式',
    bank_card_number VARCHAR(50) COMMENT '银行卡号',
    status ENUM('已完成', '处理中', '失败') DEFAULT '已完成' COMMENT '退款状态',
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE
) COMMENT = '退款记录表';