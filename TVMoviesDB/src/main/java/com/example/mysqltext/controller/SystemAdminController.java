package com.example.mysqltext.controller;

import com.example.mysqltext.model.Movie;
import com.example.mysqltext.model.Cinema;
import com.example.mysqltext.model.User;
import com.example.mysqltext.service.SystemAdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统管理员控制器
 * 负责系统级别的管理功能，包括数据统计、系统维护、用户管理等
 * 
 * 注意：此控制器包含管理员权限验证，需要在实际使用时添加权限检查
 */
@RestController
@RequestMapping("/api/admin/system")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemAdminController {

    private static final Logger logger = LoggerFactory.getLogger(SystemAdminController.class);

    @Autowired
    private SystemAdminService systemAdminService;

    /**
     * 获取系统销售报告
     * TODO: 实现销售数据统计功能
     * 
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 销售报告数据
     */
    @GetMapping("/sales-report")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.generateSalesReport(startDate, endDate)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 调用存储过程 SP_Generate_Sales_Report
            // 3. 返回包含以下数据的报告：
            // - 总销售额
            // - 订单数量
            // - 热门电影排行
            // - 热门影院排行
            // - 日销售趋势

            Map<String, Object> salesData = systemAdminService.generateSalesReport(startDate, endDate);

            response.put("success", true);
            response.put("data", salesData);
            response.put("message", "销售报告生成成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("生成销售报告失败", e);
            response.put("success", false);
            response.put("message", "生成销售报告失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取电影表现统计
     * TODO: 实现电影表现分析功能
     * 
     * @param movieId   电影ID（可选，为空则获取所有电影）
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 电影表现数据
     */
    @GetMapping("/movie-performance")
    public ResponseEntity<Map<String, Object>> getMoviePerformance(
            @RequestParam(required = false) Integer movieId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.getMoviePerformance(movieId, startDate, endDate)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 调用存储过程 SP_Get_Movie_Performance
            // 3. 返回包含以下数据：
            // - 票房收入
            // - 观影人次
            // - 场次利用率
            // - 用户评分统计
            // - 退票率

            Map<String, Object> performanceData = systemAdminService.getMoviePerformance(movieId, startDate, endDate);

            response.put("success", true);
            response.put("data", performanceData);
            response.put("message", "电影表现统计获取成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取电影表现统计失败", e);
            response.put("success", false);
            response.put("message", "获取电影表现统计失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取影院表现统计
     * TODO: 实现影院表现分析功能
     * 
     * @param cinemaId  影院ID（可选，为空则获取所有影院）
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 影院表现数据
     */
    @GetMapping("/cinema-performance")
    public ResponseEntity<Map<String, Object>> getCinemaPerformance(
            @RequestParam(required = false) Integer cinemaId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.getCinemaPerformance(cinemaId, startDate,
            // endDate)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 调用存储过程 SP_Get_Cinema_Performance
            // 3. 返回包含以下数据：
            // - 影院总收入
            // - 观影人次
            // - 影厅利用率
            // - 热门时段分析
            // - 会员转化率

            Map<String, Object> performanceData = systemAdminService.getCinemaPerformance(cinemaId, startDate, endDate);

            response.put("success", true);
            response.put("data", performanceData);
            response.put("message", "影院表现统计获取成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取影院表现统计失败", e);
            response.put("success", false);
            response.put("message", "获取影院表现统计失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取系统数据统计
     * TODO: 实现系统整体数据统计功能
     * 
     * @return 系统统计数据
     */
    @GetMapping("/data-statistics")
    public ResponseEntity<Map<String, Object>> getDataStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.getDataStatistics()
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 调用存储过程 SP_Get_Data_Statistics
            // 3. 返回包含以下数据：
            // - 用户总数及增长趋势
            // - 电影总数及分类统计
            // - 影院总数及分布
            // - 订单总数及状态分布
            // - 系统活跃度指标

            Map<String, Object> statisticsData = systemAdminService.getDataStatistics();

            response.put("success", true);
            response.put("data", statisticsData);
            response.put("message", "系统数据统计获取成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取系统数据统计失败", e);
            response.put("success", false);
            response.put("message", "获取系统数据统计失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 执行系统清理
     * TODO: 实现系统数据清理功能
     * 
     * @return 清理结果
     */
    @PostMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> performSystemCleanup() {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.performSystemCleanup()
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 调用存储过程 SP_System_Cleanup
            // 3. 执行以下清理操作：
            // - 清理过期的座位锁定
            // - 清理过期的订单
            // - 清理系统日志
            // - 优化数据库表
            // - 更新统计数据

            Map<String, Object> cleanupResult = systemAdminService.performSystemCleanup();

            response.put("success", true);
            response.put("data", cleanupResult);
            response.put("message", "系统清理完成");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("系统清理失败", e);
            response.put("success", false);
            response.put("message", "系统清理失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取所有用户列表（管理员功能）
     * TODO: 实现用户管理功能
     * 
     * @param page    页码
     * @param size    每页大小
     * @param keyword 搜索关键词（可选）
     * @return 用户列表
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.getAllUsers(page, size, keyword)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 分页查询用户列表
            // 3. 支持按用户名、手机号、邮箱搜索
            // 4. 返回用户基本信息（不包含密码等敏感信息）

            Map<String, Object> usersData = systemAdminService.getAllUsers(page, size, keyword);

            response.put("success", true);
            response.put("data", usersData);
            response.put("message", "获取用户列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户列表失败", e);
            response.put("success", false);
            response.put("message", "获取用户列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // 添加用户功能已被移除

    /**
     * 更新用户信息
     * 
     * @param userId   用户ID
     * @param userData 用户数据
     * @return 更新结果
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Integer userId,
            @RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.updateUser(userId, userData);

            response.put("success", result);
            response.put("message", result ? "用户更新成功" : "用户更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新用户失败", e);
            response.put("success", false);
            response.put("message", "更新用户失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 删除用户
     * 
     * @param userId 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.deleteUser(userId);

            response.put("success", result);
            response.put("message", result ? "用户删除成功" : "用户删除失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除用户失败", e);
            response.put("success", false);
            response.put("message", "删除用户失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 禁用/启用用户账户
     * TODO: 实现用户账户状态管理功能
     * 
     * @param userId 用户ID
     * @param action 操作类型（disable/enable）
     * @return 操作结果
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Integer userId,
            @RequestParam String action) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.updateUserStatus(userId, action)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 验证操作类型（disable/enable）
            // 3. 更新用户状态
            // 4. 记录操作日志

            boolean result = systemAdminService.updateUserStatus(userId, action);

            response.put("success", result);
            response.put("message", result ? "用户状态更新成功" : "用户状态更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新用户状态失败", e);
            response.put("success", false);
            response.put("message", "更新用户状态失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取系统配置
     * TODO: 实现系统配置管理功能
     * 
     * @return 系统配置信息
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getSystemConfig() {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.getSystemConfig()
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 获取系统配置参数
            // 3. 返回可配置的系统参数

            Map<String, Object> configData = systemAdminService.getSystemConfig();

            response.put("success", true);
            response.put("data", configData);
            response.put("message", "获取系统配置成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取系统配置失败", e);
            response.put("success", false);
            response.put("message", "获取系统配置失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 更新系统配置
     * TODO: 实现系统配置更新功能
     * 
     * @param configData 配置数据
     * @return 更新结果
     */
    @PutMapping("/config")
    public ResponseEntity<Map<String, Object>> updateSystemConfig(
            @RequestBody Map<String, Object> configData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: 调用 systemAdminService.updateSystemConfig(configData)
            // 实现思路：
            // 1. 验证管理员权限
            // 2. 验证配置参数的有效性
            // 3. 更新系统配置
            // 4. 记录配置变更日志

            boolean result = systemAdminService.updateSystemConfig(configData);

            response.put("success", result);
            response.put("message", result ? "系统配置更新成功" : "系统配置更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新系统配置失败", e);
            response.put("success", false);
            response.put("message", "更新系统配置失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取系统统计数据
     * 
     * @return 系统统计数据
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> statsData = systemAdminService.getSystemStats();

            response.put("success", true);
            response.put("totalUsers", statsData.get("totalUsers"));
            response.put("totalCinemas", statsData.get("totalCinemas"));
            response.put("totalMovies", statsData.get("totalMovies"));
            response.put("totalOrders", statsData.get("totalOrders"));
            response.put("message", "获取统计数据成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取统计数据失败", e);
            response.put("success", false);
            response.put("message", "获取统计数据失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取所有影院列表
     * 
     * @return 影院列表
     */
    @GetMapping("/cinemas")
    public ResponseEntity<Map<String, Object>> getAllCinemas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Cinema> cinemas = systemAdminService.getAllCinemas();

            response.put("success", true);
            response.put("data", cinemas);
            response.put("message", "获取影院列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取影院列表失败", e);
            response.put("success", false);
            response.put("message", "获取影院列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 添加单个影院
     * 
     * @param cinemaData 影院数据
     * @return 添加结果
     */
    @PostMapping("/cinemas")
    public ResponseEntity<Map<String, Object>> addCinema(@RequestBody Map<String, Object> cinemaData) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.addCinema(cinemaData);

            response.put("success", result);
            response.put("message", result ? "影院添加成功" : "影院添加失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("添加影院失败", e);
            response.put("success", false);
            response.put("message", "添加影院失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 批量上传影院
     * 
     * @param file CSV文件
     * @return 上传结果
     */
    @PostMapping("/cinemas/batch-upload")
    public ResponseEntity<Map<String, Object>> batchUploadCinemas(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = systemAdminService.batchUploadCinemas(file);

            response.put("success", true);
            response.put("data", result);
            response.put("message", "批量上传成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("批量上传影院失败", e);
            response.put("success", false);
            response.put("message", "批量上传失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取所有电影列表
     * 
     * @return 电影列表
     */
    @GetMapping("/movies")
    public ResponseEntity<Map<String, Object>> getAllMovies() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Movie> movies = systemAdminService.getAllMovies();

            response.put("success", true);
            response.put("data", movies);
            response.put("message", "获取电影列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取电影列表失败", e);
            response.put("success", false);
            response.put("message", "获取电影列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 添加单个电影
     * 
     * @param movieData 电影数据
     * @return 添加结果
     */
    @PostMapping("/movies")
    public ResponseEntity<Map<String, Object>> addMovie(@RequestBody Map<String, Object> movieData) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.addMovie(movieData);

            response.put("success", result);
            response.put("message", result ? "电影添加成功" : "电影添加失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("添加电影失败", e);
            response.put("success", false);
            response.put("message", "添加电影失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 更新电影信息
     * 
     * @param movieId   电影ID
     * @param movieData 电影数据
     * @return 更新结果
     */
    @PutMapping("/movies/{movieId}")
    public ResponseEntity<Map<String, Object>> updateMovie(@PathVariable Integer movieId,
            @RequestBody Map<String, Object> movieData) {
        Map<String, Object> response = new HashMap<>();
        try {
            movieData.put("movieId", movieId);
            boolean result = systemAdminService.updateMovie(movieData);

            response.put("success", result);
            response.put("message", result ? "电影更新成功" : "电影更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新电影失败", e);
            response.put("success", false);
            response.put("message", "更新电影失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 删除电影
     * 
     * @param movieId 电影ID
     * @return 删除结果
     */
    @DeleteMapping("/movies/{movieId}")
    public ResponseEntity<Map<String, Object>> deleteMovie(@PathVariable Integer movieId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.deleteMovie(movieId);

            response.put("success", result);
            response.put("message", result ? "电影删除成功" : "电影删除失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除电影失败", e);
            response.put("success", false);
            response.put("message", "删除电影失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 批量上传电影
     * 
     * @param file CSV文件
     * @return 上传结果
     */
    @PostMapping("/movies/batch-upload")
    public ResponseEntity<Map<String, Object>> batchUploadMovies(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = systemAdminService.batchUploadMovies(file);

            response.put("success", true);
            response.put("data", result);
            response.put("message", "批量上传成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("批量上传电影失败", e);
            response.put("success", false);
            response.put("message", "批量上传失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 更新影院信息
     * 
     * @param cinemaId   影院ID
     * @param cinemaData 影院数据
     * @return 更新结果
     */
    @PutMapping("/cinemas/{cinemaId}")
    public ResponseEntity<Map<String, Object>> updateCinema(@PathVariable Integer cinemaId,
            @RequestBody Map<String, Object> cinemaData) {
        Map<String, Object> response = new HashMap<>();
        try {
            cinemaData.put("cinemaId", cinemaId);
            boolean result = systemAdminService.updateCinema(cinemaData);

            response.put("success", result);
            response.put("message", result ? "影院更新成功" : "影院更新失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新影院失败", e);
            response.put("success", false);
            response.put("message", "更新影院失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 删除影院
     * 
     * @param cinemaId 影院ID
     * @return 删除结果
     */
    @DeleteMapping("/cinemas/{cinemaId}")
    public ResponseEntity<Map<String, Object>> deleteCinema(@PathVariable Integer cinemaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean result = systemAdminService.deleteCinema(cinemaId);

            response.put("success", result);
            response.put("message", result ? "影院删除成功" : "影院删除失败");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除影院失败", e);
            response.put("success", false);
            response.put("message", "删除影院失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // TODO: 添加权限验证的私有方法
    // private boolean isSystemAdmin(Integer userId) {
    // // 验证用户是否为系统管理员
    // return true;
    // }
}