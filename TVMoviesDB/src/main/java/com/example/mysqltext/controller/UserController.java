package com.example.mysqltext.controller;

import com.example.mysqltext.model.User;
import com.example.mysqltext.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // 获取所有用户
    @GetMapping
    public String getAllUsers(Model model) {
        try {
            List<User> users = userService.getAllUsers();
            model.addAttribute("users", users);
            return "users";
        } catch (Exception e) {
            logger.error("获取用户列表时发生错误", e);
            model.addAttribute("error", "获取用户列表失败: " + e.getMessage());
            return "error";
        }
    }

    // 添加用户
    @PostMapping
    public String addUser(User user, RedirectAttributes redirectAttributes) {
        try {
            userService.addUser(user);
            redirectAttributes.addFlashAttribute("message", "用户添加成功！");
            return "redirect:/users";
        } catch (Exception e) {
            logger.error("添加用户时发生错误", e);
            redirectAttributes.addFlashAttribute("error", "添加用户失败: " + e.getMessage());
            return "redirect:/users";
        }
    }

    // 更新用户
    @PutMapping
    public String updateUser(User user, RedirectAttributes redirectAttributes) {
        try {
            userService.updateUser(user);
            redirectAttributes.addFlashAttribute("message", "用户更新成功！");
            return "redirect:/users";
        } catch (Exception e) {
            logger.error("更新用户时发生错误", e);
            redirectAttributes.addFlashAttribute("error", "更新用户失败: " + e.getMessage());
            return "redirect:/users";
        }
    }

    // 删除用户
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id, RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("message", "用户删除成功！");
            return "redirect:/users";
        } catch (Exception e) {
            logger.error("删除用户时发生错误", e);
            redirectAttributes.addFlashAttribute("error", "删除用户失败: " + e.getMessage());
            return "redirect:/users";
        }
    }

    // 根据 ID 查询用户
    @GetMapping("/{id}")
    public String getUserById(@PathVariable int id, Model model) {
        try {
            User user = userService.getUserById(id);
            model.addAttribute("user", user);
            return "user-detail";
        } catch (Exception e) {
            logger.error("根据 ID 查询用户时发生错误", e);
            model.addAttribute("error", "查询用户失败: " + e.getMessage());
            return "error";
        }
    }
}