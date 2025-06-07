package com.example.mysqltext.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT工具类
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // JWT密钥 - 增加长度至少64字节(512位)以满足HS512算法要求
    private static final String SECRET_KEY = "mySecretKeyForJWTTokenGenerationAndValidation123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    // Token有效期（24小时）
    private static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000;

    private final SecretKey key;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    /**
     * 从token中获取用户名
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * 从token中获取过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * 从token中获取指定的claim
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 从token中获取所有claims
     */
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            logger.error("解析JWT token失败: {}", e.getMessage());
            throw new RuntimeException("无效的JWT token");
        }
    }

    /**
     * 检查token是否过期
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * 为用户生成token
     */
    public String generateToken(String username, Integer userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return createToken(claims, username);
    }

    /**
     * 为用户生成包含角色信息的token
     */
    public String generateTokenWithRoles(String username, Integer userId,
            com.example.mysqltext.model.User.AdminType adminType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        // 添加角色信息
        java.util.List<String> roles = new java.util.ArrayList<>();
        roles.add("ROLE_USER");

        if (adminType != null) {
            switch (adminType) {
                case SYSTEM:
                    roles.add("ROLE_ADMIN");
                    roles.add("ROLE_SYSTEM_ADMIN");
                    break;
                case CINEMA:
                    roles.add("ROLE_ADMIN");
                    roles.add("ROLE_CINEMA_ADMIN");
                    break;
                case NONE:
                default:
                    // 普通用户不添加额外角色
                    break;
            }
        }

        claims.put("roles", roles);
        return createToken(claims, username);
    }

    /**
     * 创建token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 验证token
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = getUsernameFromToken(token);
            return (username.equals(tokenUsername) && !isTokenExpired(token));
        } catch (Exception e) {
            logger.error("验证JWT token失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 从token中获取用户ID
     */
    public Integer getUserIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.get("userId", Integer.class);
        } catch (Exception e) {
            logger.error("从JWT token获取用户ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从token中获取用户角色
     */
    @SuppressWarnings("unchecked")
    public java.util.List<String> getRolesFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (java.util.List<String>) claims.get("roles");
        } catch (Exception e) {
            logger.error("从JWT token获取角色信息失败: {}", e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    /**
     * 检查token是否有效
     */
    public boolean isTokenValid(String token) {
        try {
            getAllClaimsFromToken(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}