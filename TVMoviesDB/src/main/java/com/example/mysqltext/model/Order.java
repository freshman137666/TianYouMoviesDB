package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Order {
    private Integer orderId;
    private Integer userId;
    private String purchaseType; // ENUM('regular','group')
    private Integer screeningId;
    private Integer purchasedTicketId;
    private String orderNumber;
    private LocalDateTime orderTime;
    private String status; // ENUM('待定','已付','已取消')
    private String paymentMethod; // ENUM('信用卡','微信','支付宝')
    private String bankCardNumber;
    private BigDecimal costNumber;
    private Double paymentAmount; // 支付金额
    private LocalDateTime paymentTime;
    private String ticketStatus; // ENUM('未使用','已使用','已退还')

    // 构造方法
    public Order() {
    }

    public Order(Integer userId, String purchaseType, String orderNumber,
            String paymentMethod, BigDecimal costNumber) {
        this.userId = userId;
        this.purchaseType = purchaseType;
        this.orderNumber = orderNumber;
        this.orderTime = LocalDateTime.now();
        this.status = "待定";
        this.paymentMethod = paymentMethod;
        this.costNumber = costNumber;
        this.paymentTime = LocalDateTime.now();
        this.ticketStatus = "未使用";
    }

    // Getter 和 Setter
    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPurchaseType() {
        return purchaseType;
    }

    public void setPurchaseType(String purchaseType) {
        this.purchaseType = purchaseType;
    }

    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    public Integer getPurchasedTicketId() {
        return purchasedTicketId;
    }

    public void setPurchasedTicketId(Integer purchasedTicketId) {
        this.purchasedTicketId = purchasedTicketId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(LocalDateTime orderTime) {
        this.orderTime = orderTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getBankCardNumber() {
        return bankCardNumber;
    }

    public void setBankCardNumber(String bankCardNumber) {
        this.bankCardNumber = bankCardNumber;
    }

    public BigDecimal getCostNumber() {
        return costNumber;
    }

    public void setCostNumber(BigDecimal costNumber) {
        if (costNumber != null && costNumber.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("订单金额必须大于0");
        }
        this.costNumber = costNumber;
    }

    // 费用验证方法
    public static boolean validateCostNumber(BigDecimal costNumber) {
        return costNumber == null || costNumber.compareTo(BigDecimal.ZERO) > 0;
    }

    public Double getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(Double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", userId=" + userId +
                ", purchaseType='" + purchaseType + '\'' +
                ", orderNumber='" + orderNumber + '\'' +
                ", orderTime=" + orderTime +
                ", status='" + status + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", costNumber=" + costNumber +
                ", paymentAmount=" + paymentAmount +
                ", ticketStatus='" + ticketStatus + '\'' +
                '}';
    }
}