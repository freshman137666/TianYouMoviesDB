package com.example.mysqltext.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public class User {
    public enum AdminType {
        NONE("none"), CINEMA("cinema"), SYSTEM("system");

        private final String value;

        AdminType(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static AdminType fromValue(String value) {
            if (value == null) {
                return NONE;
            }
            for (AdminType type : AdminType.values()) {
                if (type.value.equalsIgnoreCase(value)) {
                    return type;
                }
            }
            return NONE; // 默认返回NONE而不是抛出异常
        }

    }

    private Integer userId;
    private String password;
    private String name;
    private String phone;
    private String email;
    private LocalDateTime registerTime;
    private AdminType adminType;
    private Integer managedCinemaId;

    // 构造方法
    public User() {
    }

    public User(String password, String name, String phone, String email) {
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.registerTime = LocalDateTime.now();
        this.adminType = AdminType.NONE;
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
        // 直接设置密码，不进行验证
        // 注册时会在Controller层进行验证
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

    public AdminType getAdminType() {
        return adminType;
    }

    public void setAdminType(AdminType adminType) {
        this.adminType = adminType;
    }

    public Integer getManagedCinemaId() {
        return managedCinemaId;
    }

    public void setManagedCinemaId(Integer managedCinemaId) {
        this.managedCinemaId = managedCinemaId;
    }

    // 兼容性方法
    public Boolean getIsAdmin() {
        return adminType != AdminType.NONE;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.adminType = (isAdmin != null && isAdmin) ? AdminType.SYSTEM : AdminType.NONE;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", registerTime=" + registerTime +
                ", adminType=" + adminType +
                ", managedCinemaId=" + managedCinemaId +
                '}';
    }
}