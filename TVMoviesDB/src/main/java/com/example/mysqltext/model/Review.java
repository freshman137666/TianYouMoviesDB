package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Review {
    private Integer reviewId;
    private Integer userId;
    private Integer movieId;
    private Integer screeningId;
    private LocalDateTime reviewTime;
    private BigDecimal rating;
    private String comment;
    private String status; // ENUM('待定','批准','拒绝')

    // 构造方法
    public Review() {
    }

    public Review(Integer userId, Integer movieId, Integer screeningId,
            BigDecimal rating, String comment) {
        this.userId = userId;
        this.movieId = movieId;
        this.screeningId = screeningId;
        this.reviewTime = LocalDateTime.now();
        this.rating = rating;
        this.comment = comment;
        this.status = "批准";
    }

    // Getter 和 Setter
    public Integer getReviewId() {
        return reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    public LocalDateTime getReviewTime() {
        return reviewTime;
    }

    public void setReviewTime(LocalDateTime reviewTime) {
        this.reviewTime = reviewTime;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Review{" +
                "reviewId=" + reviewId +
                ", userId=" + userId +
                ", movieId=" + movieId +
                ", screeningId=" + screeningId +
                ", reviewTime=" + reviewTime +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}