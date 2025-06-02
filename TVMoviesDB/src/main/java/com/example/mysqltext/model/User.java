package com.example.mysqltext.model;

import java.time.LocalDateTime;

public class User {
    private Integer userId;
    private String password;
    private String salt;
    private String name;
    private String phone;
    private String email;
    private LocalDateTime registerTime;
    private Boolean isAdmin;

    // 构造方法
    public User() {
    }

    public User(String password, String name, String phone, String email) {
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.registerTime = LocalDateTime.now();
        this.isAdmin = false;
    }

    // Getter 和 Setter
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if (!isValidPassword(password)) {
            throw new IllegalArgumentException("密码必须包含数字、字母和特殊字符");
        }
        this.password = password;
    }

    // 密码验证方法
    private boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasDigit = false;
        boolean hasLetter = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                hasDigit = true;
            } else if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (!Character.isWhitespace(c)) {
                hasSpecial = true;
            }
        }

        return hasDigit && hasLetter && hasSpecial;
    }

    // 公共密码验证方法
    public static boolean validatePassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasDigit = false;
        boolean hasLetter = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                hasDigit = true;
            } else if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (!Character.isWhitespace(c)) {
                hasSpecial = true;
            }
        }

        return hasDigit && hasLetter && hasSpecial;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getRegisterTime() {
        return registerTime;
    }

    public void setRegisterTime(LocalDateTime registerTime) {
        this.registerTime = registerTime;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", registerTime=" + registerTime +
                ", isAdmin=" + isAdmin +
                '}';
    }
}