# 天佑电影数据库配置指南

## 数据库环境要求

- MySQL 8.0 或以上版本
- 支持 UTF8MB4 字符集
- 确保 MySQL 服务正在运行

## 快速开始

### 1. 创建数据库

执行以下 SQL 脚本创建数据库和表结构：

```bash
mysql -u root -p < src/main/resources/sql/init.sql
```

或者在 MySQL 客户端中执行：

```sql
source /path/to/your/project/src/main/resources/sql/init.sql
```

### 2. 验证数据库配置

检查 `src/main/resources/application.properties` 中的数据库连接配置：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tianyoudb?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**请根据您的实际 MySQL 配置修改用户名和密码。**

### 3. 启动应用

```bash
./mvnw spring-boot:run
```

## 数据库表结构说明

### 核心表

1. **User** - 用户表
   - 存储用户基本信息
   - 包含密码强度验证约束
   - 手机号和邮箱唯一性约束

2. **Cinema** - 影院表
   - 影院基本信息和营业状态

3. **Hall** - 影厅表
   - 影厅信息，关联影院

4. **Movie** - 电影表
   - 电影详细信息和上映状态

5. **Screening** - 场次表
   - 电影放映场次信息
   - 剩余座位数约束（>=0）

6. **Order** - 订单表
   - 订单信息和支付状态
   - 订单金额约束（>0）

### 辅助表

- **Member** - 会员表（用户-影院关联）
- **ScreeningSeat** - 场次座位表
- **GroupTicketType** - 团体票类型表
- **PurchasedTicket** - 已购票表
- **VerificationTicket** - 验证票表
- **Review** - 评价表
- **RefundRecord** - 退款记录表

## 数据约束说明

### 业务约束

1. **密码强度**：必须包含数字、字母、特殊字符，长度至少8位
2. **积分系统**：会员积分不能为负数
3. **座位管理**：剩余座位数不能为负数
4. **金额验证**：订单金额和退款金额必须大于0
5. **唯一性约束**：
   - 用户手机号唯一
   - 用户邮箱唯一
   - 订单号唯一
   - 验证码唯一

### 外键关系

- 所有关联表都设置了适当的外键约束
- 使用 `ON DELETE CASCADE` 确保数据一致性

## 示例数据

初始化脚本包含以下示例数据：

- 1个管理员用户（admin@tianyou.com / Admin123!）
- 2个示例影院
- 5个示例影厅
- 3部示例电影
- 5个示例场次
- 3种团体票类型

## MyBatis 配置

项目已配置 MyBatis XML 映射文件：

- **位置**：`src/main/resources/mapper/`
- **命名规则**：`{Entity}Mapper.xml`
- **自动扫描**：已在 `application.properties` 中配置

### 可用的 Mapper

- `UserMapper.xml` - 用户数据操作
- `MovieMapper.xml` - 电影数据操作
- `CinemaMapper.xml` - 影院数据操作
- `ScreeningMapper.xml` - 场次数据操作
- `OrderMapper.xml` - 订单数据操作
- `RefundMapper.xml` - 退款记录操作

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 MySQL 服务是否启动
   - 验证用户名密码是否正确
   - 确认端口号（默认3306）

2. **字符编码问题**
   - 确保数据库使用 UTF8MB4 字符集
   - 检查连接URL中的字符编码参数

3. **权限问题**
   - 确保 MySQL 用户有足够权限创建数据库和表
   - 检查用户是否有 INSERT/UPDATE/DELETE 权限

### 重置数据库

如需重置数据库，执行：

```sql
DROP DATABASE IF EXISTS tianyoudb;
```

然后重新运行初始化脚本。

## 生产环境注意事项

1. **安全配置**
   - 修改默认密码
   - 使用环境变量存储敏感信息
   - 启用 SSL 连接

2. **性能优化**
   - 为常用查询字段添加索引
   - 配置连接池参数
   - 定期备份数据

3. **监控和日志**
   - 启用 SQL 日志记录
   - 监控数据库性能指标
   - 设置告警机制