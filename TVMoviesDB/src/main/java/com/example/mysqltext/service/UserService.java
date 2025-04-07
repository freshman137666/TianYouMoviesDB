package com.example.mysqltext.service;

import com.example.mysqltext.model.User;
import com.example.mysqltext.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    // 获取所有用户
    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            logger.error("获取用户列表时发生错误", e);
            throw new RuntimeException("获取用户列表失败: " + e.getMessage());
        }
    }

    // 添加用户
    public int addUser(User user) {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("添加用户时发生错误", e);
            throw new RuntimeException("添加用户失败: " + e.getMessage());
        }
    }

    // 更新用户
    public int updateUser(User user) {
        try {
            return userRepository.update(user);
        } catch (Exception e) {
            logger.error("更新用户时发生错误", e);
            throw new RuntimeException("更新用户失败: " + e.getMessage());
        }
    }

    // 删除用户
    public int deleteUser(int id) {
        try {
            return userRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("删除用户时发生错误", e);
            throw new RuntimeException("删除用户失败: " + e.getMessage());
        }
    }

    // 根据 ID 查询用户
    public User getUserById(int id) {
        try {
            return userRepository.findById(id);
        } catch (Exception e) {
            logger.error("根据 ID 查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }
}