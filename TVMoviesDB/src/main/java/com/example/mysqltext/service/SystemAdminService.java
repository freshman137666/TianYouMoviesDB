package com.example.mysqltext.service;

import com.example.mysqltext.model.User;
import com.example.mysqltext.model.Cinema;
import com.example.mysqltext.model.Movie;
import com.example.mysqltext.model.Order;
import com.example.mysqltext.mapper.UserMapper;
import com.example.mysqltext.mapper.CinemaMapper;
import com.example.mysqltext.mapper.MovieMapper;
import com.example.mysqltext.mapper.OrderMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统管理员服务类
 * 提供系统级别的管理功能实现
 */
@Service
public class SystemAdminService {

    private static final Logger logger = LoggerFactory.getLogger(SystemAdminService.class);

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CinemaMapper cinemaMapper;

    @Autowired
    private MovieMapper movieMapper;

    @Autowired
    private OrderMapper orderMapper;

    // TODO: 注入其他需要的 Mapper
    // @Autowired
    // private SystemMapper systemMapper;

    /**
     * 生成销售报告
     * TODO: 实现销售数据统计功能
     * 
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 销售报告数据
     */
    public Map<String, Object> generateSalesReport(String startDate, String endDate) {
        try {
            // TODO: 实现销售报告生成逻辑
            // 实现步骤：
            // 1. 调用存储过程 SP_Generate_Sales_Report
            // 2. 处理返回的数据
            // 3. 格式化报告数据

            Map<String, Object> reportData = new HashMap<>();

            // 获取实际数据
            List<Order> allOrders = orderMapper.findAll();
            List<Cinema> allCinemas = cinemaMapper.findAll();
            List<Movie> allMovies = movieMapper.findAll();

            // 计算总销售额和订单数
            double totalRevenue = allOrders != null
                    ? allOrders.stream()
                            .mapToDouble(
                                    order -> order.getCostNumber() != null ? order.getCostNumber().doubleValue() : 0.0)
                            .sum()
                    : 0.0;
            int totalOrders = allOrders != null ? allOrders.size() : 0;
            int totalTickets = totalOrders; // 假设每个订单一张票
            double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;

            reportData.put("totalRevenue", totalRevenue);
            reportData.put("totalOrders", totalOrders);
            reportData.put("totalTickets", totalTickets);
            reportData.put("averageOrderValue", averageOrderValue);
            reportData.put("topMovies",
                    allMovies != null ? allMovies.subList(0, Math.min(5, allMovies.size())) : List.of());
            reportData.put("topCinemas",
                    allCinemas != null ? allCinemas.subList(0, Math.min(5, allCinemas.size())) : List.of());
            reportData.put("dailySales", List.of(Map.of("date", LocalDate.now().toString(), "sales", totalRevenue)));
            reportData.put("paymentMethods", Map.of("在线支付", totalOrders * 0.8, "现金支付", totalOrders * 0.2));

            // TODO: 调用存储过程获取实际数据
            // systemMapper.generateSalesReport(startDate, endDate);

            logger.info("销售报告生成成功，时间范围：{} 到 {}", startDate, endDate);
            return reportData;

        } catch (Exception e) {
            logger.error("生成销售报告失败", e);
            throw new RuntimeException("生成销售报告失败: " + e.getMessage());
        }
    }

    /**
     * 获取电影表现统计
     * TODO: 实现电影表现分析功能
     * 
     * @param movieId   电影ID（可选）
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 电影表现数据
     */
    public Map<String, Object> getMoviePerformance(Integer movieId, String startDate, String endDate) {
        try {
            // TODO: 实现电影表现统计逻辑
            // 实现步骤：
            // 1. 调用存储过程 SP_Get_Movie_Performance
            // 2. 处理返回的数据
            // 3. 计算相关指标

            Map<String, Object> performanceData = new HashMap<>();

            // 获取实际数据
            List<Order> allOrders = orderMapper.findAll();
            List<Movie> allMovies = movieMapper.findAll();

            Movie targetMovie = null;
            if (movieId != null) {
                targetMovie = movieMapper.findById(movieId);
            }

            // 计算电影表现数据
            double boxOffice = allOrders != null
                    ? allOrders.stream()
                            .mapToDouble(
                                    order -> order.getCostNumber() != null ? order.getCostNumber().doubleValue() : 0.0)
                            .sum()
                    : 0.0;
            int ticketsSold = allOrders != null ? allOrders.size() : 0;

            performanceData.put("movieInfo",
                    targetMovie != null ? Map.of("title", targetMovie.getTitle(), "director", targetMovie.getDirector())
                            : Map.of());
            performanceData.put("boxOffice", boxOffice);
            performanceData.put("ticketsSold", ticketsSold);
            performanceData.put("screenings", ticketsSold); // 假设每场一张票
            performanceData.put("occupancyRate", 0.75); // 假设75%上座率
            performanceData.put("averageRating",
                    targetMovie != null && targetMovie.getRating() != null ? targetMovie.getRating() : 0.0);
            performanceData.put("refundRate", 0.05); // 假设5%退票率
            performanceData.put("cinemaPerformance", List.of(Map.of("cinemaName", "示例影院", "revenue", boxOffice * 0.5)));
            performanceData.put("timeSlotPerformance", List.of(Map.of("timeSlot", "19:00-21:00", "occupancy", 0.8)));

            // TODO: 调用存储过程获取实际数据
            // systemMapper.getMoviePerformance(movieId, startDate, endDate);

            logger.info("电影表现统计获取成功，电影ID：{}，时间范围：{} 到 {}", movieId, startDate, endDate);
            return performanceData;

        } catch (Exception e) {
            logger.error("获取电影表现统计失败", e);
            throw new RuntimeException("获取电影表现统计失败: " + e.getMessage());
        }
    }

    /**
     * 获取影院表现统计
     * TODO: 实现影院表现分析功能
     * 
     * @param cinemaId  影院ID（可选）
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 影院表现数据
     */
    public Map<String, Object> getCinemaPerformance(Integer cinemaId, String startDate, String endDate) {
        try {
            // TODO: 实现影院表现统计逻辑
            // 实现步骤：
            // 1. 调用存储过程 SP_Get_Cinema_Performance
            // 2. 处理返回的数据
            // 3. 计算相关指标

            Map<String, Object> performanceData = new HashMap<>();

            // 获取实际数据
            List<Order> allOrders = orderMapper.findAll();
            List<Cinema> allCinemas = cinemaMapper.findAll();
            List<Movie> allMovies = movieMapper.findAll();

            Cinema targetCinema = null;
            if (cinemaId != null) {
                targetCinema = cinemaMapper.findById(cinemaId);
            }

            // 计算影院表现数据
            double totalRevenue = allOrders != null
                    ? allOrders.stream()
                            .mapToDouble(
                                    order -> order.getCostNumber() != null ? order.getCostNumber().doubleValue() : 0.0)
                            .sum()
                    : 0.0;
            int totalTickets = allOrders != null ? allOrders.size() : 0;

            performanceData.put("cinemaInfo",
                    targetCinema != null ? Map.of("name", targetCinema.getName(), "address", targetCinema.getAddress())
                            : Map.of());
            performanceData.put("totalRevenue", totalRevenue);
            performanceData.put("totalTickets", totalTickets);
            performanceData.put("totalScreenings", totalTickets); // 假设每场一张票
            performanceData.put("averageOccupancy", 0.72); // 假设72%平均上座率
            performanceData.put("hallUtilization", List.of(Map.of("hallName", "1号厅", "utilization", 0.85)));
            performanceData.put("peakHours", List.of(Map.of("hour", "19:00-21:00", "occupancy", 0.9)));
            performanceData.put("memberConversion", 0.35); // 假设35%会员转化率
            performanceData.put("topMovies",
                    allMovies != null ? allMovies.subList(0, Math.min(3, allMovies.size())) : List.of());

            // TODO: 调用存储过程获取实际数据
            // systemMapper.getCinemaPerformance(cinemaId, startDate, endDate);

            logger.info("影院表现统计获取成功，影院ID：{}，时间范围：{} 到 {}", cinemaId, startDate, endDate);
            return performanceData;

        } catch (Exception e) {
            logger.error("获取影院表现统计失败", e);
            throw new RuntimeException("获取影院表现统计失败: " + e.getMessage());
        }
    }

    /**
     * 获取系统数据统计
     * TODO: 实现系统整体数据统计功能
     * 
     * @return 系统统计数据
     */
    public Map<String, Object> getDataStatistics() {
        try {
            // TODO: 实现系统数据统计逻辑
            // 实现步骤：
            // 1. 调用存储过程 SP_Get_Data_Statistics
            // 2. 处理返回的数据
            // 3. 计算系统指标

            Map<String, Object> statisticsData = new HashMap<>();

            // 获取实际数据
            List<User> allUsers = userMapper.findAll();
            List<Cinema> allCinemas = cinemaMapper.findAll();
            List<Movie> allMovies = movieMapper.findAll();
            List<Order> allOrders = orderMapper.findAll();

            // 计算统计数据
            int totalUsers = allUsers != null ? allUsers.size() : 0;
            int totalCinemas = allCinemas != null ? allCinemas.size() : 0;
            int totalMovies = allMovies != null ? allMovies.size() : 0;
            int totalOrders = allOrders != null ? allOrders.size() : 0;

            statisticsData.put("userStatistics", Map.of(
                    "totalUsers", totalUsers,
                    "activeUsers", (int) (totalUsers * 0.7),
                    "newUsersToday", Math.max(1, totalUsers / 30),
                    "memberUsers", (int) (totalUsers * 0.4)));

            statisticsData.put("movieStatistics", Map.of(
                    "totalMovies", totalMovies,
                    "currentMovies", (int) (totalMovies * 0.6),
                    "upcomingMovies", (int) (totalMovies * 0.4),
                    "moviesByCategory", Map.of("动作", totalMovies * 0.3, "喜剧", totalMovies * 0.25)));

            statisticsData.put("cinemaStatistics", Map.of(
                    "totalCinemas", totalCinemas,
                    "totalHalls", totalCinemas * 8,
                    "totalSeats", totalCinemas * 8 * 120,
                    "cinemasByRegion", Map.of("市中心", totalCinemas * 0.4, "郊区", totalCinemas * 0.6)));

            double totalRevenue = allOrders != null
                    ? allOrders.stream()
                            .mapToDouble(
                                    order -> order.getCostNumber() != null ? order.getCostNumber().doubleValue() : 0.0)
                            .sum()
                    : 0.0;

            statisticsData.put("orderStatistics", Map.of(
                    "totalOrders", totalOrders,
                    "ordersToday", Math.max(1, totalOrders / 30),
                    "pendingOrders", (int) (totalOrders * 0.1),
                    "completedOrders", (int) (totalOrders * 0.9),
                    "cancelledOrders", (int) (totalOrders * 0.05)));

            statisticsData.put("revenueStatistics", Map.of(
                    "totalRevenue", totalRevenue,
                    "revenueToday", totalRevenue / 30,
                    "averageOrderValue", totalOrders > 0 ? totalRevenue / totalOrders : 0.0,
                    "revenueByPaymentMethod", Map.of("在线支付", totalRevenue * 0.8, "现金支付", totalRevenue * 0.2)));

            statisticsData.put("systemHealth", Map.of(
                    "cpuUsage", 45.2,
                    "memoryUsage", 62.8,
                    "diskUsage", 38.5,
                    "activeConnections", Math.max(10, totalUsers / 10)));

            // TODO: 调用存储过程获取实际数据
            // systemMapper.getDataStatistics();

            logger.info("系统数据统计获取成功");
            return statisticsData;

        } catch (Exception e) {
            logger.error("获取系统数据统计失败", e);
            throw new RuntimeException("获取系统数据统计失败: " + e.getMessage());
        }
    }

    /**
     * 执行系统清理
     * TODO: 实现系统数据清理功能
     * 
     * @return 清理结果
     */
    public Map<String, Object> performSystemCleanup() {
        try {
            // TODO: 实现系统清理逻辑
            // 实现步骤：
            // 1. 调用存储过程 SP_System_Cleanup
            // 2. 执行各种清理操作
            // 3. 记录清理结果

            Map<String, Object> cleanupResult = new HashMap<>();

            // 示例数据结构 - 需要替换为实际实现
            cleanupResult.put("expiredSeatsReleased", 0); // 释放的过期座位锁定
            cleanupResult.put("expiredOrdersCancelled", 0); // 取消的过期订单
            cleanupResult.put("logEntriesDeleted", 0); // 删除的日志条目
            cleanupResult.put("tempFilesDeleted", 0); // 删除的临时文件
            cleanupResult.put("databaseOptimized", false); // 数据库优化状态
            cleanupResult.put("cleanupTime", LocalDate.now().toString()); // 清理时间

            // TODO: 调用存储过程执行实际清理
            // systemMapper.performSystemCleanup();

            logger.info("系统清理完成");
            return cleanupResult;

        } catch (Exception e) {
            logger.error("系统清理失败", e);
            throw new RuntimeException("系统清理失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有用户列表
     * 
     * @param page    页码
     * @param size    每页大小
     * @param keyword 搜索关键词
     * @return 用户列表数据
     */
    public Map<String, Object> getAllUsers(int page, int size, String keyword) {
        try {
            Map<String, Object> usersData = new HashMap<>();

            // 获取所有用户
            List<User> allUsers = userMapper.findAll();

            // 过滤敏感信息并转换为返回格式
            List<Map<String, Object>> userList = allUsers.stream()
                    .map(user -> {
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("userId", user.getUserId());
                        userData.put("name", user.getName());
                        userData.put("phone", user.getPhone());
                        userData.put("email", user.getEmail());
                        userData.put("adminType", user.getAdminType() != null ? user.getAdminType() : "none");
                        userData.put("managedCinemaId", user.getManagedCinemaId());
                        userData.put("registerTime", user.getRegisterTime());
                        return userData;
                    })
                    .collect(java.util.stream.Collectors.toList());

            usersData.put("users", userList);
            usersData.put("totalCount", userList.size());
            usersData.put("currentPage", page);
            usersData.put("pageSize", size);
            usersData.put("totalPages", (int) Math.ceil((double) userList.size() / size));

            logger.info("获取用户列表成功，页码：{}，大小：{}，关键词：{}", page, size, keyword);
            return usersData;

        } catch (Exception e) {
            logger.error("获取用户列表失败", e);
            throw new RuntimeException("获取用户列表失败: " + e.getMessage());
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
    public boolean updateUser(Integer userId, Map<String, Object> userData) {
        try {
            User user = userMapper.findById(userId);
            if (user == null) {
                throw new RuntimeException("用户不存在");
            }

            user.setName((String) userData.get("name"));
            user.setPhone((String) userData.get("phone"));
            user.setEmail((String) userData.get("email"));

            // 正确处理AdminType枚举转换
            String adminTypeStr = (String) userData.get("adminType");
            if (adminTypeStr != null) {
                user.setAdminType(User.AdminType.fromValue(adminTypeStr));
            }

            // 如果提供了密码，则更新密码
            if (userData.get("password") != null && !userData.get("password").toString().isEmpty()) {
                user.setPassword((String) userData.get("password")); // 注意：实际应用中需要加密
            }

            // 处理管理的影院ID
            if (userData.get("managedCinemaId") != null && !userData.get("managedCinemaId").toString().isEmpty()) {
                user.setManagedCinemaId(Integer.parseInt(userData.get("managedCinemaId").toString()));
            } else {
                user.setManagedCinemaId(null);
            }

            int result = userMapper.update(user);
            logger.info("用户更新成功，用户ID：{}", userId);
            return result > 0;

        } catch (Exception e) {
            logger.error("更新用户失败", e);
            throw new RuntimeException("更新用户失败: " + e.getMessage());
        }
    }

    /**
     * 删除用户
     * 
     * @param userId 用户ID
     * @return 删除结果
     */
    public boolean deleteUser(Integer userId) {
        try {
            int result = userMapper.deleteById(userId);
            logger.info("用户删除成功，用户ID：{}", userId);
            return result > 0;

        } catch (Exception e) {
            logger.error("删除用户失败", e);
            throw new RuntimeException("删除用户失败: " + e.getMessage());
        }
    }

    /**
     * 更新用户状态
     * TODO: 实现用户状态管理功能
     * 
     * @param userId 用户ID
     * @param action 操作类型
     * @return 操作结果
     */
    public boolean updateUserStatus(Integer userId, String action) {
        try {
            // TODO: 实现用户状态更新逻辑
            // 实现步骤：
            // 1. 验证用户存在性
            // 2. 验证操作类型
            // 3. 更新用户状态
            // 4. 记录操作日志

            // 验证操作类型
            if (!"disable".equals(action) && !"enable".equals(action)) {
                throw new IllegalArgumentException("无效的操作类型: " + action);
            }

            // TODO: 实现实际的状态更新逻辑
            // User user = userMapper.findById(userId);
            // if (user == null) {
            // throw new RuntimeException("用户不存在");
            // }
            //
            // boolean newStatus = "enable".equals(action);
            // userMapper.updateUserStatus(userId, newStatus);

            logger.info("用户状态更新成功，用户ID：{}，操作：{}", userId, action);
            return true;

        } catch (Exception e) {
            logger.error("更新用户状态失败", e);
            throw new RuntimeException("更新用户状态失败: " + e.getMessage());
        }
    }

    /**
     * 获取系统配置
     * TODO: 实现系统配置管理功能
     * 
     * @return 系统配置数据
     */
    public Map<String, Object> getSystemConfig() {
        try {
            // TODO: 实现系统配置获取逻辑
            // 实现步骤：
            // 1. 从配置表或配置文件读取配置
            // 2. 组织配置数据
            // 3. 返回配置信息

            Map<String, Object> configData = new HashMap<>();

            // 示例配置数据 - 需要替换为实际实现
            configData.put("seatLockTimeout", 15); // 座位锁定超时时间（分钟）
            configData.put("orderTimeout", 30); // 订单超时时间（分钟）
            configData.put("maxTicketsPerOrder", 6); // 每单最大票数
            configData.put("refundDeadline", 2); // 退票截止时间（小时）
            configData.put("memberPointsRate", 0.01); // 积分比例
            configData.put("systemMaintenanceMode", false); // 系统维护模式

            // TODO: 从实际配置源获取数据
            // configData = systemMapper.getSystemConfig();

            logger.info("获取系统配置成功");
            return configData;

        } catch (Exception e) {
            logger.error("获取系统配置失败", e);
            throw new RuntimeException("获取系统配置失败: " + e.getMessage());
        }
    }

    /**
     * 更新系统配置
     * TODO: 实现系统配置更新功能
     * 
     * @param configData 配置数据
     * @return 更新结果
     */
    public boolean updateSystemConfig(Map<String, Object> configData) {
        try {
            // TODO: 实现系统配置更新逻辑
            // 实现步骤：
            // 1. 验证配置参数的有效性
            // 2. 更新配置
            // 3. 记录配置变更日志
            // 4. 通知相关服务配置变更

            // 验证配置参数
            validateConfigData(configData);

            // TODO: 实现实际的配置更新逻辑
            // systemMapper.updateSystemConfig(configData);

            logger.info("系统配置更新成功");
            return true;

        } catch (Exception e) {
            logger.error("更新系统配置失败", e);
            throw new RuntimeException("更新系统配置失败: " + e.getMessage());
        }
    }

    /**
     * 验证配置数据的有效性
     * TODO: 实现配置验证逻辑
     * 
     * @param configData 配置数据
     */
    private void validateConfigData(Map<String, Object> configData) {
        // TODO: 实现配置验证逻辑
        // 验证各个配置项的取值范围和类型

        // 示例验证逻辑
        if (configData.containsKey("seatLockTimeout")) {
            Integer timeout = (Integer) configData.get("seatLockTimeout");
            if (timeout == null || timeout < 5 || timeout > 60) {
                throw new IllegalArgumentException("座位锁定超时时间必须在5-60分钟之间");
            }
        }

        if (configData.containsKey("maxTicketsPerOrder")) {
            Integer maxTickets = (Integer) configData.get("maxTicketsPerOrder");
            if (maxTickets == null || maxTickets < 1 || maxTickets > 10) {
                throw new IllegalArgumentException("每单最大票数必须在1-10之间");
            }
        }

        // TODO: 添加更多配置项的验证逻辑
    }

    /**
     * 获取系统统计数据
     * 
     * @return 系统统计数据
     */
    public Map<String, Object> getSystemStats() {
        try {
            Map<String, Object> statsData = new HashMap<>();

            // 获取用户总数
            List<User> allUsers = userMapper.findAll();
            statsData.put("totalUsers", allUsers != null ? allUsers.size() : 0);

            // 获取影院总数
            List<Cinema> allCinemas = cinemaMapper.findAll();
            statsData.put("totalCinemas", allCinemas != null ? allCinemas.size() : 0);

            // 获取电影总数
            List<Movie> allMovies = movieMapper.findAll();
            statsData.put("totalMovies", allMovies != null ? allMovies.size() : 0);

            // 获取订单总数
            List<Order> allOrders = orderMapper.findAll();
            statsData.put("totalOrders", allOrders != null ? allOrders.size() : 0);

            logger.info("获取系统统计数据成功 - 用户: {}, 影院: {}, 电影: {}, 订单: {}",
                    statsData.get("totalUsers"), statsData.get("totalCinemas"),
                    statsData.get("totalMovies"), statsData.get("totalOrders"));
            return statsData;

        } catch (Exception e) {
            logger.error("获取系统统计数据失败", e);
            throw new RuntimeException("获取系统统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有影院列表
     * 
     * @return 影院列表
     */
    public List<Cinema> getAllCinemas() {
        try {
            List<Cinema> cinemas = cinemaMapper.findAll();
            logger.info("获取影院列表成功，共{}个影院", cinemas != null ? cinemas.size() : 0);
            return cinemas != null ? cinemas : List.of();
        } catch (Exception e) {
            logger.error("获取影院列表失败", e);
            throw new RuntimeException("获取影院列表失败: " + e.getMessage());
        }
    }

    /**
     * 添加单个影院
     * 
     * @param cinemaData 影院数据
     * @return 添加结果
     */
    public boolean addCinema(Map<String, Object> cinemaData) {
        try {
            Cinema cinema = new Cinema();
            cinema.setName((String) cinemaData.get("name"));
            cinema.setAddress((String) cinemaData.get("address"));
            cinema.setContactPhone((String) cinemaData.get("contactPhone"));

            // 验证必填字段
            if (cinema.getName() == null || cinema.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("影院名称不能为空");
            }
            if (cinema.getAddress() == null || cinema.getAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("影院地址不能为空");
            }
            if (cinema.getContactPhone() == null || cinema.getContactPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("影院电话不能为空");
            }

            int result = cinemaMapper.save(cinema);
            logger.info("添加影院成功: {}", cinema.getName());
            return result > 0;
        } catch (Exception e) {
            logger.error("添加影院失败", e);
            throw new RuntimeException("添加影院失败: " + e.getMessage());
        }
    }

    /**
     * 批量上传影院
     * 
     * @param file CSV文件
     * @return 上传结果
     */
    public Map<String, Object> batchUploadCinemas(org.springframework.web.multipart.MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("上传文件不能为空");
            }

            if (!file.getOriginalFilename().endsWith(".csv")) {
                throw new IllegalArgumentException("只支持CSV格式文件");
            }

            // 读取CSV文件内容
            String content = new String(file.getBytes(), "UTF-8");
            String[] lines = content.split("\n");

            if (lines.length <= 1) {
                throw new IllegalArgumentException("CSV文件内容为空或格式错误");
            }

            int successCount = 0;
            int failCount = 0;
            StringBuilder errorMessages = new StringBuilder();

            // 跳过标题行，从第二行开始处理
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty())
                    continue;

                try {
                    String[] fields = line.split(",");
                    if (fields.length < 3) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：字段不足\n");
                        continue;
                    }

                    Cinema cinema = new Cinema();
                    cinema.setName(fields[0].trim());
                    cinema.setAddress(fields[1].trim());
                    cinema.setContactPhone(fields[2].trim());

                    // 验证数据
                    if (cinema.getName().isEmpty() || cinema.getAddress().isEmpty()
                            || cinema.getContactPhone().isEmpty()) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：必填字段不能为空\n");
                        continue;
                    }

                    int result = cinemaMapper.save(cinema);
                    if (result > 0) {
                        successCount++;
                    } else {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：保存失败\n");
                    }
                } catch (Exception e) {
                    failCount++;
                    errorMessages.append("第").append(i + 1).append("行：").append(e.getMessage()).append("\n");
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("successCount", successCount);
            result.put("failCount", failCount);
            result.put("errorMessages", errorMessages.toString());

            logger.info("批量上传影院完成 - 成功: {}, 失败: {}", successCount, failCount);
            return result;
        } catch (Exception e) {
            logger.error("批量上传影院失败", e);
            throw new RuntimeException("批量上传影院失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有电影列表
     * 
     * @return 电影列表
     */
    public List<Movie> getAllMovies() {
        try {
            List<Movie> movies = movieMapper.findAll();
            logger.info("获取电影列表成功，共{}部电影", movies != null ? movies.size() : 0);
            return movies;
        } catch (Exception e) {
            logger.error("获取电影列表失败", e);
            throw new RuntimeException("获取电影列表失败: " + e.getMessage());
        }
    }

    /**
     * 添加电影
     * 
     * @param movieData 电影数据
     * @return 是否成功
     */
    public boolean addMovie(Map<String, Object> movieData) {
        try {
            // 验证必填字段
            if (movieData.get("title") == null || movieData.get("title").toString().trim().isEmpty()) {
                throw new IllegalArgumentException("电影标题不能为空");
            }
            if (movieData.get("director") == null || movieData.get("director").toString().trim().isEmpty()) {
                throw new IllegalArgumentException("导演不能为空");
            }

            Movie movie = new Movie();
            movie.setTitle(movieData.get("title").toString());
            movie.setDirector(movieData.get("director").toString());
            movie.setActors(movieData.get("actors") != null ? movieData.get("actors").toString() : "");
            movie.setCategory(movieData.get("genre") != null ? movieData.get("genre").toString() : "");

            if (movieData.get("duration") != null) {
                movie.setDuration(Integer.parseInt(movieData.get("duration").toString()));
            }
            if (movieData.get("rating") != null) {
                movie.setRating(new BigDecimal(movieData.get("rating").toString()));
            }
            if (movieData.get("basePrice") != null) {
                movie.setBasePrice(new BigDecimal(movieData.get("basePrice").toString()));
            }

            movie.setDescription(movieData.get("description") != null ? movieData.get("description").toString() : "");
            movie.setReleaseRegion(movieData.get("releaseRegion") != null ? movieData.get("releaseRegion").toString() : "");
            movie.setPosterUrl(movieData.get("posterUrl") != null ? movieData.get("posterUrl").toString() : "");
            if (movieData.get("releaseDate") != null) {
                try {
                    movie.setReleaseDate(LocalDate.parse(movieData.get("releaseDate").toString()));
                } catch (Exception e) {
                    // 如果日期解析失败，使用当前日期
                    movie.setReleaseDate(LocalDate.now());
                }
            }
            if (movieData.get("offShelfDate") != null) {
                try {
                    movie.setOffShelfDate(LocalDate.parse(movieData.get("offShelfDate").toString()));
                } catch (Exception e) {
                    // 如果日期解析失败，使用默认撤档日期（上映日期后一年）
                    LocalDate releaseDate = movie.getReleaseDate() != null ? movie.getReleaseDate() : LocalDate.now();
                    movie.setOffShelfDate(releaseDate.plusYears(1));
                }
            } else {
                // 如果没有提供撤档日期，默认设置为上映日期后一年
                LocalDate releaseDate = movie.getReleaseDate() != null ? movie.getReleaseDate() : LocalDate.now();
                movie.setOffShelfDate(releaseDate.plusYears(1));
            }

            movieMapper.save(movie);
            logger.info("添加电影成功: {}", movie.getTitle());
            return true;
        } catch (Exception e) {
            logger.error("添加电影失败", e);
            throw new RuntimeException("添加电影失败: " + e.getMessage());
        }
    }

    /**
     * 更新电影信息
     * 
     * @param movieData 电影数据
     * @return 是否成功
     */
    public boolean updateMovie(Map<String, Object> movieData) {
        try {
            Integer movieId = Integer.parseInt(movieData.get("movieId").toString());
            Movie existingMovie = movieMapper.findById(movieId);
            if (existingMovie == null) {
                throw new IllegalArgumentException("电影不存在");
            }

            // 更新电影信息
            if (movieData.get("title") != null) {
                existingMovie.setTitle(movieData.get("title").toString());
            }
            if (movieData.get("director") != null) {
                existingMovie.setDirector(movieData.get("director").toString());
            }
            if (movieData.get("actors") != null) {
                existingMovie.setActors(movieData.get("actors").toString());
            }
            if (movieData.get("genre") != null) {
                existingMovie.setCategory(movieData.get("genre").toString());
            }
            if (movieData.get("duration") != null) {
                existingMovie.setDuration(Integer.parseInt(movieData.get("duration").toString()));
            }
            if (movieData.get("rating") != null) {
                existingMovie.setRating(new BigDecimal(movieData.get("rating").toString()));
            }
            if (movieData.get("description") != null) {
                existingMovie.setDescription(movieData.get("description").toString());
            }
            // Movie类没有posterUrl和status字段，跳过这些设置
            if (movieData.get("releaseDate") != null) {
                try {
                    existingMovie.setReleaseDate(LocalDate.parse(movieData.get("releaseDate").toString()));
                } catch (Exception e) {
                    // 如果日期解析失败，保持原有日期不变
                }
            }

            movieMapper.update(existingMovie);
            logger.info("更新电影成功: {}", existingMovie.getTitle());
            return true;
        } catch (Exception e) {
            logger.error("更新电影失败", e);
            throw new RuntimeException("更新电影失败: " + e.getMessage());
        }
    }

    /**
     * 删除电影
     * 
     * @param movieId 电影ID
     * @return 是否成功
     */
    public boolean deleteMovie(Integer movieId) {
        try {
            Movie existingMovie = movieMapper.findById(movieId);
            if (existingMovie == null) {
                throw new IllegalArgumentException("电影不存在");
            }

            movieMapper.deleteById(movieId);
            logger.info("删除电影成功: {}", existingMovie.getTitle());
            return true;
        } catch (Exception e) {
            logger.error("删除电影失败", e);
            throw new RuntimeException("删除电影失败: " + e.getMessage());
        }
    }

    /**
     * 更新影院信息
     * 
     * @param cinemaData 影院数据
     * @return 是否成功
     */
    public boolean updateCinema(Map<String, Object> cinemaData) {
        try {
            Integer cinemaId = (Integer) cinemaData.get("cinemaId");
            if (cinemaId == null) {
                throw new IllegalArgumentException("影院ID不能为空");
            }

            Cinema existingCinema = cinemaMapper.findById(cinemaId);
            if (existingCinema == null) {
                throw new IllegalArgumentException("影院不存在");
            }

            // 验证必填字段
            String name = (String) cinemaData.get("name");
            String address = (String) cinemaData.get("address");
            String contactPhone = (String) cinemaData.get("contactPhone");

            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("影院名称不能为空");
            }
            if (address == null || address.trim().isEmpty()) {
                throw new IllegalArgumentException("影院地址不能为空");
            }
            if (contactPhone == null || contactPhone.trim().isEmpty()) {
                throw new IllegalArgumentException("影院电话不能为空");
            }

            existingCinema.setName(name);
            existingCinema.setAddress(address);
            existingCinema.setContactPhone(contactPhone);

            cinemaMapper.update(existingCinema);
            logger.info("更新影院成功: {}", existingCinema.getName());
            return true;
        } catch (Exception e) {
            logger.error("更新影院失败", e);
            throw new RuntimeException("更新影院失败: " + e.getMessage());
        }
    }

    /**
     * 删除影院
     * 
     * @param cinemaId 影院ID
     * @return 是否成功
     */
    public boolean deleteCinema(Integer cinemaId) {
        try {
            Cinema existingCinema = cinemaMapper.findById(cinemaId);
            if (existingCinema == null) {
                throw new IllegalArgumentException("影院不存在");
            }

            cinemaMapper.deleteById(cinemaId);
            logger.info("删除影院成功: {}", existingCinema.getName());
            return true;
        } catch (Exception e) {
            logger.error("删除影院失败", e);
            throw new RuntimeException("删除影院失败: " + e.getMessage());
        }
    }

    /**
     * 批量上传电影
     * 
     * @param file CSV文件
     * @return 上传结果
     */
    public Map<String, Object> batchUploadMovies(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("文件不能为空");
            }

            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            String[] lines = content.split("\n");

            int successCount = 0;
            int failCount = 0;
            StringBuilder errorMessages = new StringBuilder();

            // 跳过标题行
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty()) {
                    continue;
                }

                try {
                    String[] fields = line.split(",");
                    if (fields.length < 9) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：字段不足\n");
                        continue;
                    }

                    Movie movie = new Movie();
                    movie.setTitle(fields[0].trim());
                    movie.setDirector(fields[1].trim());
                    movie.setActors(fields[2].trim());
                    movie.setCategory(fields[3].trim());

                    try {
                        movie.setDuration(Integer.parseInt(fields[4].trim()));
                    } catch (NumberFormatException e) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：时长格式错误\n");
                        continue;
                    }

                    try {
                        movie.setRating(new BigDecimal(fields[5].trim()));
                    } catch (NumberFormatException e) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：评分格式错误\n");
                        continue;
                    }

                    movie.setDescription(fields[6].trim());
                    // 解析日期字符串为LocalDate
                    try {
                        movie.setReleaseDate(LocalDate.parse(fields[7].trim()));
                    } catch (Exception e) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：日期格式错误，请使用YYYY-MM-DD格式\n");
                        continue;
                    }
                    // Movie类没有status和posterUrl字段，跳过这些设置

                    // 验证必填字段
                    if (movie.getTitle().isEmpty() || movie.getDirector().isEmpty()) {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：标题和导演不能为空\n");
                        continue;
                    }

                    int result = movieMapper.save(movie);
                    if (result > 0) {
                        successCount++;
                    } else {
                        failCount++;
                        errorMessages.append("第").append(i + 1).append("行：保存失败\n");
                    }
                } catch (Exception e) {
                    failCount++;
                    errorMessages.append("第").append(i + 1).append("行：").append(e.getMessage()).append("\n");
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("successCount", successCount);
            result.put("failCount", failCount);
            result.put("errorMessages", errorMessages.toString());

            logger.info("批量上传电影完成 - 成功: {}, 失败: {}", successCount, failCount);
            return result;
        } catch (Exception e) {
            logger.error("批量上传电影失败", e);
            throw new RuntimeException("批量上传电影失败: " + e.getMessage());
        }
    }
}