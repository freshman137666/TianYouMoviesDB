package com.example.mysqltext.model;

import java.time.LocalDateTime;

public class VerificationTicket {
    private Integer verificationId;
    private Integer purchasedTicketId;
    private Integer orderId;
    private String verificationCode;
    private Integer userId;
    private Boolean isUsed;
    private LocalDateTime useTime;
    private Integer screeningSeatId;

    // 构造方法
    public VerificationTicket() {
    }

    public VerificationTicket(String verificationCode, Integer userId) {
        this.verificationCode = verificationCode;
        this.userId = userId;
        this.isUsed = false;
    }

    public VerificationTicket(Integer purchasedTicketId, String verificationCode, Integer userId) {
        this.purchasedTicketId = purchasedTicketId;
        this.verificationCode = verificationCode;
        this.userId = userId;
        this.isUsed = false;
    }

    public VerificationTicket(Integer orderId, String verificationCode, Integer userId, boolean isOrder) {
        this.orderId = orderId;
        this.verificationCode = verificationCode;
        this.userId = userId;
        this.isUsed = false;
    }

    // Getter 和 Setter
    public Integer getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(Integer verificationId) {
        this.verificationId = verificationId;
    }

    public Integer getPurchasedTicketId() {
        return purchasedTicketId;
    }

    public void setPurchasedTicketId(Integer purchasedTicketId) {
        this.purchasedTicketId = purchasedTicketId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Boolean getIsUsed() {
        return isUsed;
    }

    public void setIsUsed(Boolean isUsed) {
        this.isUsed = isUsed;
    }

    public LocalDateTime getUseTime() {
        return useTime;
    }

    public void setUseTime(LocalDateTime useTime) {
        this.useTime = useTime;
    }

    public Integer getScreeningSeatId() {
        return screeningSeatId;
    }

    public void setScreeningSeatId(Integer screeningSeatId) {
        this.screeningSeatId = screeningSeatId;
    }

    @Override
    public String toString() {
        return "VerificationTicket{" +
                "verificationId=" + verificationId +
                ", purchasedTicketId=" + purchasedTicketId +
                ", orderId=" + orderId +
                ", verificationCode='" + verificationCode + '\'' +
                ", userId=" + userId +
                ", isUsed=" + isUsed +
                ", useTime=" + useTime +
                ", screeningSeatId=" + screeningSeatId +
                '}';
    }
}