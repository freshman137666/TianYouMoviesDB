package com.example.mysqltext.model;

public class Member {
    private Integer userId;
    private Integer cinemaId;
    private Integer points;

    // 构造方法
    public Member() {
    }

    public Member(Integer userId, Integer cinemaId) {
        this.userId = userId;
        this.cinemaId = cinemaId;
        this.points = 0;
    }

    public Member(Integer userId, Integer cinemaId, Integer points) {
        this.userId = userId;
        this.cinemaId = cinemaId;
        this.points = points;
    }

    // Getter 和 Setter
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        if (points != null && points < 0) {
            throw new IllegalArgumentException("积分不能为负数");
        }
        this.points = points;
    }

    // 积分验证方法
    public static boolean validatePoints(Integer points) {
        return points == null || points >= 0;
    }

    @Override
    public String toString() {
        return "Member{" +
                "userId=" + userId +
                ", cinemaId=" + cinemaId +
                ", points=" + points +
                '}';
    }
}