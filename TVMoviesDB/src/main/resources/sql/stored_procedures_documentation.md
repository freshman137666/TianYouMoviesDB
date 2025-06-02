# 天佑电影购票网站存储过程文档

## 概述

本文档详细说明了天佑电影购票网站的存储过程设计，这些存储过程完美对应了电影购票业务的各个流程环节，确保了数据的一致性和业务逻辑的完整性。

## 存储过程模块划分

### 1. 用户管理模块 (User Management)

#### 主存储过程：`Manage_Users`
**功能**：统一管理用户相关的所有操作

**参数**：
- `operation_type`: 操作类型 ('register', 'login', 'update_profile', 'change_password', 'get_profile')
- `p_username`: 用户名
- `p_password`: 密码
- `p_email`: 邮箱
- `p_phone`: 手机号
- `p_user_id`: 用户ID
- `p_new_password`: 新密码

**子存储过程**：
- `SP_Register_User`: 用户注册
- `SP_Login_User`: 用户登录验证
- `SP_Update_User_Profile`: 更新用户资料
- `SP_Change_Password`: 修改密码
- `SP_Get_User_Profile`: 获取用户资料

**业务流程对应**：
- 用户注册流程
- 用户登录验证流程
- 个人信息管理流程

### 2. 会员管理模块 (Membership Management)

#### 主存储过程：`Manage_Membership`
**功能**：管理用户会员相关操作

**参数**：
- `operation_type`: 操作类型 ('upgrade', 'renew', 'get_benefits', 'check_status')
- `p_user_id`: 用户ID
- `p_membership_type`: 会员类型
- `p_payment_method`: 支付方式
- `p_bank_card_number`: 银行卡号

**子存储过程**：
- `SP_Upgrade_Membership`: 升级会员
- `SP_Renew_Membership`: 续费会员
- `SP_Get_Membership_Benefits`: 获取会员权益
- `SP_Check_Membership_Status`: 检查会员状态

**业务流程对应**：
- 会员升级流程
- 会员续费流程
- 会员权益查询流程

### 3. 订单管理模块 (Order Management)

#### 主存储过程：`Manage_Order_Lifecycle`
**功能**：管理订单的完整生命周期

**参数**：
- `operation_type`: 操作类型 ('lock_seats', 'create', 'process_payment', 'cancel', 'refund')
- `p_user_id`: 用户ID
- `p_screening_id`: 场次ID
- `p_seats`: 座位信息(JSON格式)
- `p_payment_method`: 支付方式
- `p_bank_card_number`: 银行卡号
- `p_order_id`: 订单ID
- `p_purchased_ticket_id`: 团购票ID

**子存储过程**：
- `SP_Lock_Seats`: 锁定座位
- `SP_Create_Order`: 创建订单
- `SP_Process_Payment`: 处理支付
- `SP_Cancel_Order`: 取消订单
- `SP_Process_Refund`: 处理退款
- `SP_Create_Verification_Codes`: 创建核验券

**业务流程对应**：
- 选座购票流程
- 支付处理流程
- 订单取消流程
- 退款处理流程

### 4. 评论管理模块 (Review Management)

#### 主存储过程：`Manage_Reviews`
**功能**：管理电影评论相关操作

**参数**：
- `operation_type`: 操作类型 ('submit', 'update', 'moderate', 'delete', 'get_movie_reviews')
- `p_user_id`: 用户ID
- `p_movie_id`: 电影ID
- `p_screening_id`: 场次ID
- `p_review_id`: 评论ID
- `p_rating`: 评分
- `p_comment`: 评论内容
- `p_status`: 审核状态

**子存储过程**：
- `SP_Submit_Review`: 提交评论
- `SP_Update_Review`: 更新评论
- `SP_Moderate_Review`: 审核评论
- `SP_Delete_Review`: 删除评论
- `SP_Get_Movie_Reviews`: 获取电影评论
- `SP_Update_Movie_Rating`: 更新电影评分

**业务流程对应**：
- 用户评论提交流程
- 评论审核管理流程
- 电影评分计算流程

### 5. 查询管理模块 (Query Management)

#### 主存储过程：`Manage_User_Queries`
**功能**：处理用户各类查询请求

**参数**：
- `operation_type`: 操作类型 ('order_history', 'refund_records', 'movie_details', 'available_screenings', 'cinema_list', 'now_playing')
- `p_user_id`: 用户ID
- `p_movie_id`: 电影ID
- `p_cinema_id`: 影院ID
- `p_query_date`: 查询日期
- `p_order_id`: 订单ID

**子存储过程**：
- `SP_Get_Order_History`: 获取订单历史
- `SP_Get_Refund_Records`: 获取退款记录
- `SP_Get_Movie_Details`: 获取电影详情
- `SP_Get_Available_Screenings`: 获取可用场次
- `SP_Get_Cinema_List`: 获取影院列表
- `SP_Get_Now_Playing_Movies`: 获取正在上映电影

**业务流程对应**：
- 用户订单查询流程
- 电影信息查询流程
- 场次查询流程

### 6. 座位管理模块 (Seat Management)

#### 主存储过程：`Manage_Seats`
**功能**：管理影厅座位相关操作

**参数**：
- `operation_type`: 操作类型 ('get_seat_map', 'initialize_screening_seats', 'update_seat_type', 'release_expired_locks')
- `p_screening_id`: 场次ID
- `p_hall_id`: 影厅ID
- `p_seat_row`: 座位行
- `p_seat_col`: 座位列
- `p_seat_type`: 座位类型
- `p_price_multiplier`: 价格倍数

**子存储过程**：
- `SP_Get_Seat_Map`: 获取座位图
- `SP_Initialize_Screening_Seats`: 初始化场次座位
- `SP_Update_Seat_Type`: 更新座位类型
- `SP_Release_Expired_Locks`: 释放过期锁定

**业务流程对应**：
- 座位图显示流程
- 座位锁定管理流程
- 座位类型配置流程

### 7. 团购票管理模块 (Group Ticket Management)

#### 主存储过程：`Manage_Group_Tickets`
**功能**：管理团购票相关操作

**参数**：
- `operation_type`: 操作类型 ('get_available_types', 'purchase', 'get_user_tickets', 'get_ticket_details')
- `p_user_id`: 用户ID
- `p_type_id`: 团购票类型ID
- `p_ticket_count`: 票数
- `p_payment_method`: 支付方式
- `p_bank_card_number`: 银行卡号
- `p_purchased_ticket_id`: 已购团购票ID

**子存储过程**：
- `SP_Get_Available_Group_Ticket_Types`: 获取可用团购票类型
- `SP_Purchase_Group_Tickets`: 购买团购票
- `SP_Get_User_Group_Tickets`: 获取用户团购票
- `SP_Get_Group_Ticket_Details`: 获取团购票详情

**业务流程对应**：
- 团购票购买流程
- 团购票使用流程
- 团购票管理流程

### 8. 系统管理模块 (System Management)

#### 主存储过程：`Manage_System`
**功能**：系统管理和统计分析

**参数**：
- `operation_type`: 操作类型 ('sales_report', 'movie_performance', 'cinema_performance', 'system_cleanup', 'data_statistics')
- `p_start_date`: 开始日期
- `p_end_date`: 结束日期
- `p_movie_id`: 电影ID
- `p_cinema_id`: 影院ID

**子存储过程**：
- `SP_Generate_Sales_Report`: 生成销售报告
- `SP_Get_Movie_Performance`: 获取电影表现
- `SP_Get_Cinema_Performance`: 获取影院表现
- `SP_System_Cleanup`: 系统清理
- `SP_Get_Data_Statistics`: 获取数据统计

**业务流程对应**：
- 销售数据分析流程
- 系统维护流程
- 运营统计流程

## 业务流程完整性分析

### 1. 用户购票完整流程

```sql
-- 1. 用户注册/登录
CALL Manage_Users('register', 'username', 'password', 'email', 'phone', NULL, NULL, @code, @msg, @data);
CALL Manage_Users('login', 'username', 'password', NULL, NULL, NULL, NULL, @code, @msg, @data);

-- 2. 查询电影和场次
CALL Manage_User_Queries('now_playing', NULL, NULL, NULL, NULL, NULL, @code, @msg, @data);
CALL Manage_User_Queries('available_screenings', NULL, movie_id, cinema_id, '2024-01-01', NULL, @code, @msg, @data);

-- 3. 获取座位图
CALL Manage_Seats('get_seat_map', screening_id, NULL, NULL, NULL, NULL, NULL, @code, @msg, @data);

-- 4. 锁定座位
CALL Manage_Order_Lifecycle('lock_seats', user_id, screening_id, '[{"row":5,"col":6},{"row":5,"col":7}]', NULL, NULL, NULL, NULL, @code, @msg, @data);

-- 5. 创建订单
CALL Manage_Order_Lifecycle('create', user_id, screening_id, '[{"row":5,"col":6},{"row":5,"col":7}]', NULL, NULL, NULL, NULL, @code, @msg, @data);

-- 6. 处理支付
CALL Manage_Order_Lifecycle('process_payment', NULL, NULL, NULL, '微信', NULL, order_id, NULL, @code, @msg, @data);
```

### 2. 团购票使用流程

```sql
-- 1. 查看可用团购票类型
CALL Manage_Group_Tickets('get_available_types', NULL, NULL, NULL, NULL, NULL, NULL, @code, @msg, @data);

-- 2. 购买团购票
CALL Manage_Group_Tickets('purchase', user_id, type_id, 5, '微信', NULL, NULL, @code, @msg, @data);

-- 3. 使用团购票购票
CALL Manage_Order_Lifecycle('create', user_id, screening_id, '[{"row":5,"col":6}]', NULL, NULL, NULL, purchased_ticket_id, @code, @msg, @data);
```

### 3. 会员升级流程

```sql
-- 1. 检查当前会员状态
CALL Manage_Membership('check_status', user_id, NULL, NULL, NULL, @code, @msg, @data);

-- 2. 升级会员
CALL Manage_Membership('upgrade', user_id, 'VIP', '微信', NULL, @code, @msg, @data);
```

### 4. 评论管理流程

```sql
-- 1. 提交评论
CALL Manage_Reviews('submit', user_id, movie_id, screening_id, NULL, 4.5, '电影很好看！', NULL, @code, @msg, @data);

-- 2. 获取电影评论
CALL Manage_Reviews('get_movie_reviews', NULL, movie_id, NULL, NULL, NULL, NULL, NULL, @code, @msg, @data);
```

## 数据一致性保证

### 1. 事务处理
所有主存储过程都使用事务处理，确保操作的原子性：
- 开始事务：`START TRANSACTION`
- 异常处理：`DECLARE EXIT HANDLER FOR SQLEXCEPTION`
- 提交/回滚：根据结果决定 `COMMIT` 或 `ROLLBACK`

### 2. 座位锁定机制
- 座位锁定时间：15分钟
- 自动释放过期锁定
- 防止超卖问题

### 3. 库存管理
- 实时更新剩余座位数
- 团购票使用次数控制
- 会员有效期管理

### 4. 数据完整性
- 外键约束检查
- 业务规则验证
- 状态一致性维护

## 性能优化特性

### 1. 批量操作
- 批量初始化座位
- 批量创建核验券
- 批量数据查询

### 2. 索引优化
- 基于查询模式的索引设计
- 复合索引支持复杂查询

### 3. 缓存友好
- JSON格式返回数据
- 减少多次查询
- 结构化数据输出

## 安全性考虑

### 1. 参数验证
- 输入参数合法性检查
- 业务规则验证
- 权限控制

### 2. 错误处理
- 统一错误码和错误信息
- 异常情况处理
- 日志记录支持

### 3. 数据保护
- 敏感信息处理
- 软删除机制
- 审计跟踪

## 扩展性设计

### 1. 模块化设计
- 功能模块独立
- 接口标准化
- 易于维护和扩展

### 2. 配置化管理
- 座位类型可配置
- 价格策略可调整
- 业务规则可修改

### 3. 监控支持
- 系统统计数据
- 性能监控指标
- 业务分析报告

## 使用建议

### 1. 调用规范
- 始终检查返回的 `result_code`
- 处理 `result_msg` 中的错误信息
- 解析 `data` 中的业务数据

### 2. 错误处理
- `result_code = 0` 表示成功
- `result_code = -1` 表示失败
- 根据 `result_msg` 进行相应处理

### 3. 数据格式
- 座位信息使用 JSON 数组格式
- 日期使用 DATE 类型
- 时间使用 DATETIME 类型

### 4. 定期维护
- 定期执行系统清理
- 监控座位锁定情况
- 检查数据一致性

## 总结

这套存储过程设计完美对应了电影购票网站的所有业务流程，具有以下特点：

1. **完整性**：覆盖了从用户注册到购票、评论、退款的完整业务链
2. **一致性**：通过事务处理和约束检查保证数据一致性
3. **可靠性**：完善的错误处理和异常恢复机制
4. **高性能**：优化的查询和批量操作
5. **可扩展**：模块化设计便于功能扩展
6. **易维护**：标准化接口和文档完善

通过这些存储过程，可以确保电影购票网站的业务逻辑在数据库层面得到完整实现，提供稳定可靠的数据服务支持。