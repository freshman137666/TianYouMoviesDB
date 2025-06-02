package com.example.mysqltext.controller;

import com.example.mysqltext.model.User;
import com.example.mysqltext.service.UserService;
import com.example.mysqltext.util.PasswordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 验证必填字段
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "手机号不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "邮箱不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证密码强度
            if (!User.validatePassword(user.getPassword())) {
                response.put("success", false);
                response.put("message", "密码必须至少8位，包含数字、字母和特殊字符");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证手机号格式
            if (!isValidPhone(user.getPhone())) {
                response.put("success", false);
                response.put("message", "手机号格式不正确");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证邮箱格式
            if (!isValidEmail(user.getEmail())) {
                response.put("success", false);
                response.put("message", "邮箱格式不正确");
                return ResponseEntity.badRequest().body(response);
            }

            // 加密密码
            String[] encryptedData = PasswordUtil.encryptPassword(user.getPassword());
            user.setSalt(encryptedData[0]);
            user.setPassword(encryptedData[1]);
            user.setRegisterTime(LocalDateTime.now());
            user.setIsAdmin(false);

            // 注册用户
            int result = userService.registerUser(user);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "注册成功");
                response.put("userId", user.getUserId());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "注册失败");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (RuntimeException e) {
            logger.error("用户注册失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("用户注册时发生未知错误", e);
            response.put("success", false);
            response.put("message", "注册失败，请稍后重试");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            String phone = loginRequest.get("phone");
            String password = loginRequest.get("password");

            // 验证必填字段
            if (phone == null || phone.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "手机号不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (password == null || password.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            // 验证登录
            User user = userService.login(phone, password);

            if (user != null) {
                response.put("success", true);
                response.put("message", "登录成功");

                // 返回用户信息（不包含密码）
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", user.getUserId());
                userInfo.put("name", user.getName());
                userInfo.put("phone", user.getPhone());
                userInfo.put("email", user.getEmail());
                userInfo.put("isAdmin", user.getIsAdmin());
                userInfo.put("registerTime", user.getRegisterTime());

                response.put("user", userInfo);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "手机号或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            logger.error("用户登录时发生错误", e);
            response.put("success", false);
            response.put("message", "登录失败，请稍后重试");
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
     * 检查用户名是否可用
     */
    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Object>> checkPhone(@RequestParam String phone) {
        Map<String, Object> response = new HashMap<>();

        try {
            User existingUser = userService.findByPhone(phone);
            response.put("available", existingUser == null);
            response.put("message", existingUser == null ? "手机号可用" : "手机号已被使用");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("检查手机号时发生错误", e);
            response.put("available", false);
            response.put("message", "检查失败，请稍后重试");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 检查邮箱是否可用
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();

        try {
            User existingUser = userService.findByEmail(email);
            response.put("available", existingUser == null);
            response.put("message", existingUser == null ? "邮箱可用" : "邮箱已被使用");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("检查邮箱时发生错误", e);
            response.put("available", false);
            response.put("message", "检查失败，请稍后重试");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}