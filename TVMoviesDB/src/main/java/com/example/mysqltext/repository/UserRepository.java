package com.example.mysqltext.repository;

import com.example.mysqltext.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private static final Logger logger = LoggerFactory.getLogger(UserRepository.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 查询所有用户
    public List<User> findAll() {
        try {
            String sql = "SELECT * FROM users";
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                return new User(
                        rs.getInt("id"),
                        rs.getString("name")
                );
            });
        } catch (Exception e) {
            logger.error("查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }

    // 添加用户
    public int save(User user) {
        try {
            String sql = "INSERT INTO users (id, name) VALUES (?, ?)";
            return jdbcTemplate.update(sql, user.getId(), user.getName());
        } catch (Exception e) {
            logger.error("添加用户时发生错误", e);
            throw new RuntimeException("添加用户失败: " + e.getMessage());
        }
    }

    // 更新用户
    public int update(User user) {
        try {
            String sql = "UPDATE users SET name = ? WHERE id = ?";
            return jdbcTemplate.update(sql, user.getName(), user.getId());
        } catch (Exception e) {
            logger.error("更新用户时发生错误", e);
            throw new RuntimeException("更新用户失败: " + e.getMessage());
        }
    }

    // 删除用户
    public int deleteById(int id) {
        try {
            String sql = "DELETE FROM users WHERE id = ?";
            return jdbcTemplate.update(sql, id);
        } catch (Exception e) {
            logger.error("删除用户时发生错误", e);
            throw new RuntimeException("删除用户失败: " + e.getMessage());
        }
    }

    // 根据 ID 查询用户
    public User findById(int id) {
        try {
            String sql = "SELECT * FROM users WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) ->
                    new User(
                            rs.getInt("id"),
                            rs.getString("name")
                    )
            );
        }catch (EmptyResultDataAccessException e) {
            logger.warn("未找到用户: id = {}", id);
            return null;
        } catch (Exception e) {
            logger.error("根据 ID 查询用户时发生错误", e);
            throw new RuntimeException("查询用户失败: " + e.getMessage());
        }
    }
}