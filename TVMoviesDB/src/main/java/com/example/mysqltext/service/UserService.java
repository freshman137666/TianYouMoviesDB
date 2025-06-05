package com.example.mysqltext.service;

import com.example.mysqltext.mapper.MembershipMapper;
import com.example.mysqltext.model.User;
import com.example.mysqltext.repository.UserRepository;
// import com.example.mysqltext.util.PasswordUtil; // 暂时注释掉加密工具
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipMapper membershipMapper;

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
    public int deleteUser(Integer userId) {
        try {
            return userRepository.deleteById(userId);
        } catch (Exception e) {
            logger.error("删除用户时发生错误", e);
            throw new RuntimeException("删除用户失败: " + e.getMessage());
        }
    }

    // 根据 ID 查询用户
    public User getUserById(Integer userId) {
        try {
            return userRepository.findById(userId);
        } catch (Exception e) {
            logger.error("根据 ID 查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    // 根据手机号查询用户
    public User getUserByPhone(String phone) {
        try {
            return userRepository.findByPhone(phone);
        } catch (Exception e) {
            logger.error("根据手机号查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    // 根据邮箱查询用户
    public User getUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            logger.error("根据邮箱查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    // 用户登录验证（简化版：直接字符串匹配）
    public User login(String phone, String password) {
        try {
            User user = userRepository.findByPhone(phone);
            if (user != null && password.equals(user.getPassword())) {
                logger.info("用户登录成功: {}", phone);
                return user;
            }
            logger.warn("用户登录失败 - 用户名或密码错误: {}", phone);
            return null;
        } catch (Exception e) {
            logger.error("用户登录验证时发生数据库错误: {}", e.getMessage(), e);
            // 返回null而不是抛出异常，让Controller层处理
            return null;
        }
    }

    // 用户注册
    public int registerUser(User user) {
        try {
            // 检查手机号是否已存在
            if (userRepository.findByPhone(user.getPhone()) != null) {
                throw new RuntimeException("手机号已存在");
            }
            // 检查邮箱是否已存在
            if (userRepository.findByEmail(user.getEmail()) != null) {
                throw new RuntimeException("邮箱已存在");
            }
            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("用户注册时发生错误", e);
            throw new RuntimeException("注册失败: " + e.getMessage());
        }
    }

    // 根据手机号查找用户（供API使用）
    public User findByPhone(String phone) {
        try {
            return userRepository.findByPhone(phone);
        } catch (Exception e) {
            logger.error("根据手机号查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    // 根据邮箱查找用户（供API使用）
    public User findByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            logger.error("根据邮箱查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    /**
     * 获取用户会员信息
     */
    public Map<String, Object> getUserMembership(Integer userId) {
        try {
            return membershipMapper.findByUserId(userId);
        } catch (Exception e) {
            logger.error("获取用户会员信息失败: userId={}", userId, e);
            throw new RuntimeException("获取用户会员信息失败", e);
        }
    }

    /**
     * 加入会员
     */
    public Map<String, Object> joinMembership(Integer userId, Integer cinemaId) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查用户是否已经是该影院的会员
            Map<String, Object> existingMembership = membershipMapper.findByUserIdAndCinemaId(userId, cinemaId);
            if (existingMembership != null) {
                result.put("success", false);
                result.put("message", "您已经是该影院的会员");
                return result;
            }

            // 创建会员记录
            Map<String, Object> membershipData = new HashMap<>();
            membershipData.put("userId", userId);
            membershipData.put("cinemaId", cinemaId);
            membershipData.put("joinTime", LocalDateTime.now());
            membershipData.put("points", 0);
            membershipData.put("level", "普通会员");
            membershipData.put("isActive", true);

            int insertResult = membershipMapper.save(membershipData);
            if (insertResult > 0) {
                result.put("success", true);
                result.put("membership", membershipData);
                result.put("message", "加入会员成功");
            } else {
                result.put("success", false);
                result.put("message", "加入会员失败");
            }

            return result;
        } catch (Exception e) {
            logger.error("加入会员失败: userId={}, cinemaId={}", userId, cinemaId, e);
            result.put("success", false);
            result.put("message", "加入会员失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 修改密码
     */
    public boolean changePassword(Integer userId, String oldPassword, String newPassword) {
        try {
            User user = userRepository.findById(userId);
            if (user == null) {
                return false;
            }

            // 验证旧密码
            if (!oldPassword.equals(user.getPassword())) {
                return false;
            }

            // 直接设置新密码
            user.setPassword(newPassword);

            int result = userRepository.update(user);
            return result > 0;
        } catch (Exception e) {
            logger.error("修改密码失败: userId={}", userId, e);
            return false;
        }
    }
}