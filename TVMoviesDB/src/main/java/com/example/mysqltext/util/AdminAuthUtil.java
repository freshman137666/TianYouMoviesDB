package com.example.mysqltext.util;

import com.example.mysqltext.model.User;
import com.example.mysqltext.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * 管理员权限验证工具类
 * 提供统一的权限检查功能
 */
@Component
public class AdminAuthUtil {

    private static final Logger logger = LoggerFactory.getLogger(AdminAuthUtil.class);

    @Autowired
    private UserService userService;

    /**
     * 验证用户是否为系统管理员
     * TODO: 实现系统管理员权限验证
     * 
     * @param request HTTP请求对象
     * @return 验证结果
     * @throws RuntimeException 权限不足时抛出异常
     */
    public User validateSystemAdmin(HttpServletRequest request) {
        try {
            // TODO: 实现系统管理员验证逻辑
            // 实现步骤：
            // 1. 从session或token获取用户信息
            // 2. 验证用户是否登录
            // 3. 验证用户是否为管理员
            // 4. 验证用户是否有系统管理权限

            User currentUser = getCurrentUser(request);

            if (currentUser == null) {
                throw new RuntimeException("用户未登录");
            }

            if (!currentUser.getIsAdmin()) {
                throw new RuntimeException("权限不足：需要管理员权限");
            }

            // TODO: 如果有更细粒度的权限控制，在这里添加
            // 例如：检查用户是否有系统管理权限
            // if (!hasSystemAdminPermission(currentUser)) {
            // throw new RuntimeException("权限不足：需要系统管理员权限");
            // }

            logger.info("系统管理员权限验证通过，用户ID：{}", currentUser.getUserId());
            return currentUser;

        } catch (Exception e) {
            logger.warn("系统管理员权限验证失败：{}", e.getMessage());
            throw new RuntimeException("权限验证失败: " + e.getMessage());
        }
    }

    /**
     * 验证用户是否为影院管理员
     * TODO: 实现影院管理员权限验证
     * 
     * @param request  HTTP请求对象
     * @param cinemaId 影院ID（可选，用于验证管理权限）
     * @return 验证结果
     * @throws RuntimeException 权限不足时抛出异常
     */
    public User validateCinemaAdmin(HttpServletRequest request, Integer cinemaId) {
        try {
            // TODO: 实现影院管理员验证逻辑
            // 实现步骤：
            // 1. 从session或token获取用户信息
            // 2. 验证用户是否登录
            // 3. 验证用户是否为管理员
            // 4. 如果指定了影院ID，验证用户是否有该影院的管理权限

            User currentUser = getCurrentUser(request);

            if (currentUser == null) {
                throw new RuntimeException("用户未登录");
            }

            if (!currentUser.getIsAdmin()) {
                throw new RuntimeException("权限不足：需要管理员权限");
            }

            // TODO: 如果指定了影院ID，验证管理权限
            if (cinemaId != null) {
                // TODO: 实现影院管理权限验证
                // 这里可能需要查询用户与影院的关联关系
                // if (!hasCinemaAdminPermission(currentUser, cinemaId)) {
                // throw new RuntimeException("权限不足：无权管理该影院");
                // }
            }

            logger.info("影院管理员权限验证通过，用户ID：{}，影院ID：{}", currentUser.getUserId(), cinemaId);
            return currentUser;

        } catch (Exception e) {
            logger.warn("影院管理员权限验证失败：{}", e.getMessage());
            throw new RuntimeException("权限验证失败: " + e.getMessage());
        }
    }

    /**
     * 验证用户是否为普通管理员（系统管理员或影院管理员）
     * TODO: 实现通用管理员权限验证
     * 
     * @param request HTTP请求对象
     * @return 验证结果
     * @throws RuntimeException 权限不足时抛出异常
     */
    public User validateAdmin(HttpServletRequest request) {
        try {
            // TODO: 实现通用管理员验证逻辑
            // 实现步骤：
            // 1. 从session或token获取用户信息
            // 2. 验证用户是否登录
            // 3. 验证用户是否为管理员

            User currentUser = getCurrentUser(request);

            if (currentUser == null) {
                throw new RuntimeException("用户未登录");
            }

            if (!currentUser.getIsAdmin()) {
                throw new RuntimeException("权限不足：需要管理员权限");
            }

            logger.info("管理员权限验证通过，用户ID：{}", currentUser.getUserId());
            return currentUser;

        } catch (Exception e) {
            logger.warn("管理员权限验证失败：{}", e.getMessage());
            throw new RuntimeException("权限验证失败: " + e.getMessage());
        }
    }

    /**
     * 从请求中获取当前用户
     * TODO: 实现用户信息获取逻辑
     * 
     * @param request HTTP请求对象
     * @return 当前用户信息
     */
    private User getCurrentUser(HttpServletRequest request) {
        try {
            // TODO: 实现用户信息获取逻辑
            // 实现方式可以是：
            // 1. 从Session获取
            // 2. 从JWT Token获取
            // 3. 从其他认证方式获取

            // 方式1：从Session获取（示例实现）
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object userObj = session.getAttribute("user");
                if (userObj instanceof User) {
                    return (User) userObj;
                }

                // 如果session中存储的是用户ID
                Object userIdObj = session.getAttribute("userId");
                if (userIdObj instanceof Integer) {
                    Integer userId = (Integer) userIdObj;
                    return userService.getUserById(userId);
                }
            }

            // 方式2：从Header中的Token获取（示例实现）
            // String token = request.getHeader("Authorization");
            // if (token != null && token.startsWith("Bearer ")) {
            // String jwt = token.substring(7);
            // return jwtUtil.getUserFromToken(jwt);
            // }

            return null;

        } catch (Exception e) {
            logger.error("获取当前用户信息失败", e);
            return null;
        }
    }

    /**
     * 检查用户是否有系统管理权限
     * TODO: 实现系统管理权限检查
     * 
     * @param user 用户对象
     * @return 是否有权限
     */
    private boolean hasSystemAdminPermission(User user) {
        // TODO: 实现系统管理权限检查逻辑
        // 这里可以根据具体需求实现：
        // 1. 检查用户角色
        // 2. 检查用户权限表
        // 3. 检查用户组权限

        // 示例：简单的管理员检查
        return user.getIsAdmin();

        // 更复杂的权限检查示例：
        // return user.getIsAdmin() && user.getRole().equals("SYSTEM_ADMIN");
    }

    /**
     * 检查用户是否有指定影院的管理权限
     * TODO: 实现影院管理权限检查
     * 
     * @param user     用户对象
     * @param cinemaId 影院ID
     * @return 是否有权限
     */
    private boolean hasCinemaAdminPermission(User user, Integer cinemaId) {
        // TODO: 实现影院管理权限检查逻辑
        // 这里可以根据具体需求实现：
        // 1. 查询用户与影院的关联关系
        // 2. 检查用户是否为该影院的管理员
        // 3. 系统管理员默认有所有影院的管理权限

        // 示例：系统管理员有所有权限
        if (hasSystemAdminPermission(user)) {
            return true;
        }

        // TODO: 查询用户与影院的关联关系
        // return cinemaAdminMapper.hasPermission(user.getUserId(), cinemaId);

        // 临时实现：所有管理员都有权限
        return user.getIsAdmin();
    }

    /**
     * 记录权限验证日志
     * TODO: 实现权限验证日志记录
     * 
     * @param user     用户对象
     * @param action   操作类型
     * @param resource 资源信息
     * @param success  是否成功
     */
    public void logPermissionCheck(User user, String action, String resource, boolean success) {
        try {
            // TODO: 实现权限验证日志记录
            // 可以记录到：
            // 1. 数据库日志表
            // 2. 文件日志
            // 3. 外部日志系统

            String userId = user != null ? user.getUserId().toString() : "unknown";
            String username = user != null ? user.getName() : "unknown";

            if (success) {
                logger.info("权限验证成功 - 用户：{}({}), 操作：{}, 资源：{}",
                        username, userId, action, resource);
            } else {
                logger.warn("权限验证失败 - 用户：{}({}), 操作：{}, 资源：{}",
                        username, userId, action, resource);
            }

            // TODO: 记录到数据库
            // auditLogService.recordPermissionCheck(userId, action, resource, success);

        } catch (Exception e) {
            logger.error("记录权限验证日志失败", e);
        }
    }

    /**
     * 生成权限不足的错误响应
     * TODO: 实现统一的权限错误响应
     * 
     * @param message 错误消息
     * @return 错误响应对象
     */
    public static RuntimeException createPermissionDeniedException(String message) {
        return new RuntimeException("权限不足: " + message);
    }

    /**
     * 生成未登录的错误响应
     * TODO: 实现统一的未登录错误响应
     * 
     * @return 错误响应对象
     */
    public static RuntimeException createNotLoggedInException() {
        return new RuntimeException("用户未登录，请先登录");
    }
}