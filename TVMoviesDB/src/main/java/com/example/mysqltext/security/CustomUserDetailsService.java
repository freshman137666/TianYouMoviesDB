package com.example.mysqltext.security;

import com.example.mysqltext.model.User;
import com.example.mysqltext.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 自定义用户详情服务
 * 实现Spring Security的UserDetailsService接口
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // 这里username可能是手机号或邮箱
            User user = null;

            // 先尝试通过手机号查找
            if (username.matches("^1[3-9]\\d{9}$")) {
                user = userService.getUserByPhone(username);
            } else if (username.contains("@")) {
                // 通过邮箱查找
                user = userService.getUserByEmail(username);
            }

            if (user == null) {
                logger.error("用户不存在: {}", username);
                throw new UsernameNotFoundException("用户不存在: " + username);
            }

            // 构建用户权限
            Collection<GrantedAuthority> authorities = getAuthorities(user);

            return new org.springframework.security.core.userdetails.User(
                    username,
                    user.getPassword(), // 这里是加密后的密码
                    true, // enabled
                    true, // accountNonExpired
                    true, // credentialsNonExpired
                    true, // accountNonLocked
                    authorities);
        } catch (Exception e) {
            logger.error("加载用户详情时发生错误: {}", e.getMessage());
            throw new UsernameNotFoundException("加载用户详情失败: " + e.getMessage());
        }
    }

    /**
     * 获取用户权限
     */
    private Collection<GrantedAuthority> getAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 添加基本用户角色
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        // 根据管理员类型添加不同的角色
        if (user.getAdminType() != null) {
            switch (user.getAdminType()) {
                case SYSTEM:
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_SYSTEM_ADMIN"));
                    break;
                case CINEMA:
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_CINEMA_ADMIN"));
                    break;
                case NONE:
                default:
                    // 普通用户不添加额外角色
                    break;
            }
        }

        return authorities;
    }
}