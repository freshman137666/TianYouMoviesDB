package com.example.mysqltext.controller;

import com.example.mysqltext.model.Order;
import com.example.mysqltext.model.PurchasedTicket;
import com.example.mysqltext.model.User;
import com.example.mysqltext.service.GroupTicketService;
import com.example.mysqltext.service.OrderService;
import com.example.mysqltext.service.UserService;
import com.example.mysqltext.util.PasswordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private GroupTicketService groupTicketService;

    /**
     * 更新用户信息
     */
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> updateRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 从请求中获取用户ID（实际项目中应该从JWT token中获取）
            // 这里暂时从localStorage传来的数据中获取，或者通过其他方式识别用户
            String name = (String) updateRequest.get("name");
            String email = (String) updateRequest.get("email");
            String phone = (String) updateRequest.get("phone");
            String currentPassword = (String) updateRequest.get("currentPassword");
            Integer userId = (Integer) updateRequest.get("userId");

            // 如果没有userId，尝试通过phone查找用户（临时方案）
            User currentUser = null;
            if (userId != null) {
                currentUser = userService.getUserById(userId);
            } else if (phone != null) {
                currentUser = userService.findByPhone(phone);
            } else if (email != null) {
                currentUser = userService.findByEmail(email);
            }

            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(response);
            }

            // 如果要修改邮箱或手机号，需要验证当前密码
            if ((email != null && !email.equals(currentUser.getEmail())) ||
                    (phone != null && !phone.equals(currentUser.getPhone()))) {
                if (currentPassword == null || currentPassword.trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "修改邮箱或手机号需要验证当前密码");
                    return ResponseEntity.badRequest().body(response);
                }

                // 验证当前密码
                if (!PasswordUtil.verifyPassword(currentPassword, currentUser.getSalt(), currentUser.getPassword())) {
                    response.put("success", false);
                    response.put("message", "当前密码错误");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // 验证邮箱格式
            if (email != null && !isValidEmail(email)) {
                response.put("success", false);
                response.put("message", "邮箱格式不正确");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证手机号格式
            if (phone != null && !isValidPhone(phone)) {
                response.put("success", false);
                response.put("message", "手机号格式不正确");
                return ResponseEntity.badRequest().body(response);
            }

            // 检查邮箱是否已被其他用户使用
            if (email != null && !email.equals(currentUser.getEmail())) {
                User existingUser = userService.findByEmail(email);
                if (existingUser != null && !existingUser.getUserId().equals(currentUser.getUserId())) {
                    response.put("success", false);
                    response.put("message", "邮箱已被其他用户使用");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // 检查手机号是否已被其他用户使用
            if (phone != null && !phone.equals(currentUser.getPhone())) {
                User existingUser = userService.findByPhone(phone);
                if (existingUser != null && !existingUser.getUserId().equals(currentUser.getUserId())) {
                    response.put("success", false);
                    response.put("message", "手机号已被其他用户使用");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // 更新用户信息
            if (name != null) {
                currentUser.setName(name.trim());
            }
            if (email != null) {
                currentUser.setEmail(email.trim());
            }
            if (phone != null) {
                currentUser.setPhone(phone.trim());
            }

            int result = userService.updateUser(currentUser);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "更新成功");

                // 返回更新后的用户信息
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", currentUser.getUserId());
                userInfo.put("name", currentUser.getName());
                userInfo.put("phone", currentUser.getPhone());
                userInfo.put("email", currentUser.getEmail());
                userInfo.put("isAdmin", currentUser.getIsAdmin());
                userInfo.put("registerTime", currentUser.getRegisterTime());

                response.put("user", userInfo);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "更新失败");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            logger.error("更新用户信息时发生错误", e);
            response.put("success", false);
            response.put("message", "更新失败，请稍后重试");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 修改密码
     */
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> passwordRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");
            String phone = passwordRequest.get("phone");
            String email = passwordRequest.get("email");
            Integer userId = null;

            // 尝试从请求中获取userId
            try {
                String userIdStr = passwordRequest.get("userId");
                if (userIdStr != null) {
                    userId = Integer.parseInt(userIdStr);
                }
            } catch (NumberFormatException e) {
                // 忽略解析错误
            }

            // 验证必填字段
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "请输入当前密码");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "请输入新密码");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证新密码强度
            if (!User.validatePassword(newPassword)) {
                response.put("success", false);
                response.put("message", "新密码必须至少8位，包含数字、字母和特殊字符");
                return ResponseEntity.badRequest().body(response);
            }

            // 查找用户
            User currentUser = null;
            if (userId != null) {
                currentUser = userService.getUserById(userId);
            } else if (phone != null) {
                currentUser = userService.findByPhone(phone);
            } else if (email != null) {
                currentUser = userService.findByEmail(email);
            }

            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证当前密码
            if (!PasswordUtil.verifyPassword(currentPassword, currentUser.getSalt(), currentUser.getPassword())) {
                response.put("success", false);
                response.put("message", "当前密码错误");
                return ResponseEntity.badRequest().body(response);
            }

            // 加密新密码
            String[] encryptedData = PasswordUtil.encryptPassword(newPassword);
            currentUser.setSalt(encryptedData[0]);
            currentUser.setPassword(encryptedData[1]);

            int result = userService.updateUser(currentUser);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "密码修改成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "密码修改失败");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            logger.error("修改密码时发生错误", e);
            response.put("success", false);
            response.put("message", "密码修改失败，请稍后重试");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 验证手机号格式
     */
    private boolean isValidPhone(String phone) {
        if (phone == null)
            return false;
        // 简单的手机号验证：11位数字，以1开头
        return phone.matches("^1[3-9]\\d{9}$");
    }

    /**
     * 验证邮箱格式
     */
    private boolean isValidEmail(String email) {
        if (email == null)
            return false;
        // 简单的邮箱验证
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserById(userId);
            if (user != null) {
                // 不返回密码等敏感信息
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", user.getUserId());
                userInfo.put("name", user.getName());
                userInfo.put("phone", user.getPhone());
                userInfo.put("email", user.getEmail());
                userInfo.put("isAdmin", user.getIsAdmin());
                userInfo.put("registerTime", user.getRegisterTime());

                response.put("success", true);
                response.put("data", userInfo);
                response.put("message", "获取用户信息成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取用户信息失败", e);
            response.put("success", false);
            response.put("message", "获取用户信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户订单历史
     */
    @GetMapping("/{userId}/orders")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            java.util.List<Order> orders = orderService.getOrdersByUserId(userId);
            response.put("success", true);
            response.put("data", orders);
            response.put("message", "获取用户订单成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户订单失败", e);
            response.put("success", false);
            response.put("message", "获取用户订单失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户团购票
     */
    @GetMapping("/{userId}/group-tickets")
    public ResponseEntity<Map<String, Object>> getUserGroupTickets(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<PurchasedTicket> groupTickets = groupTicketService.getUserPurchasedTickets(userId);
            response.put("success", true);
            response.put("data", groupTickets);
            response.put("message", "获取用户团购票成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户团购票失败", e);
            response.put("success", false);
            response.put("message", "获取用户团购票失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户待核验券
     */
    @GetMapping("/{userId}/pending-tickets")
    public ResponseEntity<Map<String, Object>> getUserPendingTickets(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> pendingTickets = orderService.getUserPendingTickets(userId);
            response.put("success", true);
            response.put("data", pendingTickets);
            response.put("message", "获取待核验券成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取待核验券失败", e);
            response.put("success", false);
            response.put("message", "获取待核验券失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户会员信息
     */
    @GetMapping("/{userId}/membership")
    public ResponseEntity<Map<String, Object>> getUserMembership(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> membership = userService.getUserMembership(userId);
            response.put("success", true);
            response.put("data", membership);
            response.put("message", "获取会员信息成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取会员信息失败", e);
            response.put("success", false);
            response.put("message", "获取会员信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 加入会员
     */
    @PostMapping("/{userId}/membership")
    public ResponseEntity<Map<String, Object>> joinMembership(
            @PathVariable Integer userId,
            @RequestBody Map<String, Object> membershipData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer cinemaId = (Integer) membershipData.get("cinemaId");

            if (cinemaId == null) {
                response.put("success", false);
                response.put("message", "缺少影院ID");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> result = userService.joinMembership(userId, cinemaId);
            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("data", result.get("membership"));
                response.put("message", "加入会员成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("加入会员失败", e);
            response.put("success", false);
            response.put("message", "加入会员失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}