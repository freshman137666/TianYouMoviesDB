package com.example.mysqltext.repository;

import com.example.mysqltext.mapper.UserMapper;
import com.example.mysqltext.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {
    
    private static final Logger logger = LoggerFactory.getLogger(UserRepository.class);
    
    @Autowired
    private UserMapper userMapper;
    
    public List<User> findAll() {
        try {
            return userMapper.findAll();
        } catch (Exception e) {
            logger.error("查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }
    
    public User findById(int id) {
        try {
            return userMapper.findById(id);
        } catch (Exception e) {
            logger.error("根据 ID 查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }
    
    public int save(User user) {
        try {
            return userMapper.save(user);
        } catch (Exception e) {
            logger.error("添加用户时发生错误", e);
            throw new RuntimeException("添加用户失败: " + e.getMessage());
        }
    }
    
    public int update(User user) {
        try {
            return userMapper.update(user);
        } catch (Exception e) {
            logger.error("更新用户时发生错误", e);
            throw new RuntimeException("更新用户失败: " + e.getMessage());
        }
    }
    
    public int deleteById(int id) {
        try {
            return userMapper.deleteById(id);
        } catch (Exception e) {
            logger.error("删除用户时发生错误", e);
            throw new RuntimeException("删除用户失败: " + e.getMessage());
        }
    }
}