package com.example.mysqltext.security;

import com.example.mysqltext.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT请求过滤器
 * 拦截每个请求并验证JWT token
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token格式: "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (Exception e) {
                logger.error("无法获取JWT Token中的用户名: {}", e.getMessage());
            }
        } else {
            logger.debug("JWT Token不存在或格式不正确");
        }

        // 验证token
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 如果token有效，设置Spring Security的认证
                if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {
                    // 从token中获取角色信息
                    java.util.List<String> roles = jwtUtil.getRolesFromToken(jwtToken);
                    java.util.List<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();

                    for (String role : roles) {
                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(role));
                    }

                    // 创建认证对象
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // 将用户ID添加到请求属性中，方便后续使用
                    Integer userId = jwtUtil.getUserIdFromToken(jwtToken);
                    if (userId != null) {
                        request.setAttribute("userId", userId);
                    }
                }
            } catch (Exception e) {
                logger.error("验证JWT Token时发生错误: {}", e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}