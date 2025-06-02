package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RefundRecord {
    private Integer refundId;
    private Integer orderId;
    private BigDecimal refundAmount;
    private LocalDateTime refundTime;
    private String refundMethod; // ENUM('信用卡','微信','支付宝')
    private String bankCardNumber;
    private String status; // ENUM('已完成','处理中','失败')

    // 构造方法
    public RefundRecord() {
    }

    public RefundRecord(Integer orderId, BigDecimal refundAmount, String refundMethod) {
        this.orderId = orderId;
        this.refundAmount = refundAmount;
        this.refundTime = LocalDateTime.now();
        this.refundMethod = refundMethod;
        this.status = "已完成";
    }

    public RefundRecord(Integer orderId, BigDecimal refundAmount, String refundMethod, String bankCardNumber) {
        this.orderId = orderId;
        this.refundAmount = refundAmount;
        this.refundTime = LocalDateTime.now();
        this.refundMethod = refundMethod;
        this.bankCardNumber = bankCardNumber;
        this.status = "已完成";
    }

    // Getter 和 Setter
    public Integer getRefundId() {
        return refundId;
    }

    public void setRefundId(Integer refundId) {
        this.refundId = refundId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        if (refundAmount != null && refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("退款金额必须大于0");
        }
        this.refundAmount = refundAmount;
    }

    // 退款金额验证方法
    public static boolean validateRefundAmount(BigDecimal refundAmount) {
        return refundAmount == null || refundAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    public LocalDateTime getRefundTime() {
        return refundTime;
    }

    public void setRefundTime(LocalDateTime refundTime) {
        this.refundTime = refundTime;
    }

    public String getRefundMethod() {
        return refundMethod;
    }

    public void setRefundMethod(String refundMethod) {
        this.refundMethod = refundMethod;
    }

    public String getBankCardNumber() {
        return bankCardNumber;
    }

    public void setBankCardNumber(String bankCardNumber) {
        this.bankCardNumber = bankCardNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "RefundRecord{" +
                "refundId=" + refundId +
                ", orderId=" + orderId +
                ", refundAmount=" + refundAmount +
                ", refundTime=" + refundTime +
                ", refundMethod='" + refundMethod + '\'' +
                ", bankCardNumber='" + bankCardNumber + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}