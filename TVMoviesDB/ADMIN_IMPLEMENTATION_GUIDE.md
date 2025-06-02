# 管理员功能实现指南

本文档为开发者提供影院管理员和系统管理员功能的实现指南。所有框架代码已经准备就绪，开发者只需要在指定的方法中填写具体的业务逻辑代码。

## 📁 文件结构

```
src/main/java/com/example/mysqltext/
├── controller/
│   ├── SystemAdminController.java     # 系统管理员控制器（已创建框架）
│   └── CinemaAdminController.java     # 影院管理员控制器（已创建框架）
├── service/
│   ├── SystemAdminService.java        # 系统管理员服务（已创建框架）
│   └── CinemaAdminService.java        # 影院管理员服务（已创建框架）
└── util/
    └── AdminAuthUtil.java             # 权限验证工具（已创建框架）
```

## 🎯 实现目标

### 系统管理员功能
- 系统统计和数据分析
- 用户管理
- 系统维护和配置
- 全局报告生成

### 影院管理员功能
- 影院信息管理
- 影厅管理（增删改查）
- 场次管理（增删改查）
- 运营报告
- 会员管理
- 实时座位监控

## 🔧 实现步骤

### 第一步：了解现有数据库结构

在开始实现之前，请查看以下文件了解数据库结构：
- `init.sql` - 数据库表结构
- `stored_procedures_documentation.md` - 存储过程文档
- `triggers_documentation.md` - 触发器文档

### 第二步：实现权限验证（AdminAuthUtil.java）

**优先级：高** - 这是所有管理员功能的基础

#### 需要实现的方法：

1. **getCurrentUser(HttpServletRequest request)**
   ```java
   // TODO: 从session或token获取当前用户
   // 建议实现方式：
   // 1. 从Session获取用户ID
   // 2. 调用UserService获取完整用户信息
   // 3. 验证用户状态是否有效
   ```

2. **validateSystemAdmin(HttpServletRequest request)**
   ```java
   // TODO: 验证系统管理员权限
   // 实现要点：
   // 1. 获取当前用户
   // 2. 检查用户是否为管理员
   // 3. 可以添加更细粒度的权限控制
   ```

3. **validateCinemaAdmin(HttpServletRequest request, Integer cinemaId)**
   ```java
   // TODO: 验证影院管理员权限
   // 实现要点：
   // 1. 获取当前用户
   // 2. 检查用户是否为管理员
   // 3. 如果指定影院ID，验证用户是否有该影院管理权限
   ```

### 第三步：实现系统管理员服务（SystemAdminService.java）

#### 核心方法实现指南：

1. **generateSalesReport(String startDate, String endDate)**
   ```java
   // TODO: 调用存储过程 Manage_System
   // 参考 stored_procedures_documentation.md
   // 实现步骤：
   // 1. 验证日期格式和范围
   // 2. 调用存储过程获取销售数据
   // 3. 格式化返回结果
   ```

2. **getMoviePerformanceStats(String startDate, String endDate)**
   ```java
   // TODO: 获取电影表现统计
   // 可以使用的数据表：
   // - Movie（电影信息）
   // - Screening（场次信息）
   // - Order（订单信息）
   // - OrderTicket（票务信息）
   ```

3. **getUserList(int page, int size, String searchKeyword)**
   ```java
   // TODO: 分页获取用户列表
   // 实现要点：
   // 1. 使用UserMapper进行分页查询
   // 2. 支持按用户名、邮箱搜索
   // 3. 返回用户基本信息和统计数据
   ```

### 第四步：实现影院管理员服务（CinemaAdminService.java）

#### 核心方法实现指南：

1. **getCinemaInfo(Integer cinemaId)**
   ```java
   // TODO: 获取影院详细信息
   // 实现步骤：
   // 1. 使用CinemaMapper.findById()获取基本信息
   // 2. 可以添加影厅数量、当日场次等统计信息
   ```

2. **addHall(Integer cinemaId, Hall hallData)**
   ```java
   // TODO: 添加新影厅
   // 实现步骤：
   // 1. 验证影厅数据（名称、座位配置等）
   // 2. 检查影厅名称是否重复
   // 3. 插入影厅记录
   // 4. 初始化座位配置
   ```

3. **addScreening(Integer cinemaId, Screening screeningData)**
   ```java
   // TODO: 添加新场次
   // 实现步骤：
   // 1. 验证场次数据
   // 2. 检查时间冲突
   // 3. 验证电影和影厅的有效性
   // 4. 创建场次记录
   // 5. 初始化场次座位状态
   ```

### 第五步：实现控制器层

控制器层的实现相对简单，主要是：
1. 调用权限验证
2. 参数验证
3. 调用服务层方法
4. 返回统一格式的响应

#### 示例实现模式：
```java
@PostMapping("/api/admin/cinema/{cinemaId}/halls")
public ResponseEntity<?> addHall(
    @PathVariable Integer cinemaId,
    @RequestBody Hall hallData,
    HttpServletRequest request) {
    
    try {
        // 1. 权限验证
        User admin = adminAuthUtil.validateCinemaAdmin(request, cinemaId);
        
        // 2. 调用服务层
        Integer hallId = cinemaAdminService.addHall(cinemaId, hallData);
        
        // 3. 返回结果
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "影厅添加成功",
            "hallId", hallId
        ));
        
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", e.getMessage()
        ));
    }
}
```

## 📋 实现检查清单

### 权限验证模块 (AdminAuthUtil.java)
- [ ] `getCurrentUser()` - 从请求获取当前用户
- [ ] `validateSystemAdmin()` - 系统管理员权限验证
- [ ] `validateCinemaAdmin()` - 影院管理员权限验证
- [ ] `hasSystemAdminPermission()` - 系统管理权限检查
- [ ] `hasCinemaAdminPermission()` - 影院管理权限检查

### 系统管理员服务 (SystemAdminService.java)
- [ ] `generateSalesReport()` - 生成销售报告
- [ ] `getMoviePerformanceStats()` - 电影表现统计
- [ ] `getCinemaPerformanceStats()` - 影院表现统计
- [ ] `getSystemDataStats()` - 系统数据统计
- [ ] `performSystemCleanup()` - 系统清理
- [ ] `getUserList()` - 获取用户列表
- [ ] `updateUserStatus()` - 更新用户状态
- [ ] `getSystemConfig()` - 获取系统配置
- [ ] `updateSystemConfig()` - 更新系统配置

### 影院管理员服务 (CinemaAdminService.java)
- [ ] `getCinemaInfo()` - 获取影院信息
- [ ] `updateCinemaInfo()` - 更新影院信息
- [ ] `getCinemaHalls()` - 获取影厅列表
- [ ] `addHall()` - 添加影厅
- [ ] `updateHall()` - 更新影厅
- [ ] `deleteHall()` - 删除影厅
- [ ] `getCinemaScreenings()` - 获取场次列表
- [ ] `addScreening()` - 添加场次
- [ ] `updateScreening()` - 更新场次
- [ ] `cancelScreening()` - 取消场次
- [ ] `getCinemaReports()` - 获取运营报告
- [ ] `getCinemaMembers()` - 获取会员列表
- [ ] `getScreeningSeats()` - 获取座位状态

### 控制器层
- [ ] SystemAdminController - 所有API接口实现
- [ ] CinemaAdminController - 所有API接口实现

## 🔍 测试建议

### 单元测试
1. 为每个服务方法编写单元测试
2. 模拟数据库操作和权限验证
3. 测试异常情况处理

### 集成测试
1. 测试完整的API调用流程
2. 验证权限控制是否正确
3. 测试数据一致性

### 手动测试
1. 使用Postman或类似工具测试API
2. 验证前端集成
3. 测试并发场景

## 📚 参考资源

### 数据库相关
- `init.sql` - 完整的数据库表结构
- `stored_procedures_documentation.md` - 存储过程使用说明
- `triggers_documentation.md` - 触发器说明

### 现有代码参考
- `UserController.java` - 用户管理API参考
- `CinemaController.java` - 影院API参考
- `OrderController.java` - 订单处理参考
- `AuthController.java` - 认证流程参考

### 模型类
- `User.java` - 用户模型
- `Cinema.java` - 影院模型
- `Hall.java` - 影厅模型（如果存在）
- `Screening.java` - 场次模型（如果存在）
- `Order.java` - 订单模型

## ⚠️ 注意事项

1. **安全性**
   - 所有管理员操作都必须进行权限验证
   - 敏感操作需要记录操作日志
   - 输入参数必须进行验证和清理

2. **数据一致性**
   - 涉及多表操作时考虑使用事务
   - 删除操作前检查关联数据
   - 更新操作要验证数据完整性

3. **性能考虑**
   - 大数据量查询使用分页
   - 复杂统计可以考虑使用存储过程
   - 频繁查询的数据考虑缓存

4. **错误处理**
   - 提供清晰的错误信息
   - 记录详细的错误日志
   - 优雅处理异常情况

## 🚀 开始实现

建议按以下顺序进行实现：

1. **第一阶段**：实现权限验证模块（AdminAuthUtil.java）
2. **第二阶段**：实现基础的CRUD操作（影院、影厅、场次管理）
3. **第三阶段**：实现统计和报告功能
4. **第四阶段**：实现高级功能（系统清理、配置管理等）
5. **第五阶段**：完善错误处理和日志记录
6. **第六阶段**：编写测试和文档

每个阶段完成后，建议进行充分的测试再进入下一阶段。

---

**祝您实现顺利！如有问题，请参考现有代码或查阅相关文档。**