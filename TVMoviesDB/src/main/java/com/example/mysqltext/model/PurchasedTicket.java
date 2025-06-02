package com.example.mysqltext.model;

public class PurchasedTicket {
    private Integer purchasedTicketId;
    private Integer typeId;
    private Integer userId;
    private String unitName;
    private Integer ticketCount;
    private Integer screeningId;

    // 构造方法
    public PurchasedTicket() {
    }

    public PurchasedTicket(Integer typeId, Integer userId, String unitName, Integer ticketCount) {
        this.typeId = typeId;
        this.userId = userId;
        this.unitName = unitName;
        this.ticketCount = ticketCount;
    }

    public PurchasedTicket(Integer typeId, Integer userId, String unitName,
            Integer ticketCount, Integer screeningId) {
        this.typeId = typeId;
        this.userId = userId;
        this.unitName = unitName;
        this.ticketCount = ticketCount;
        this.screeningId = screeningId;
    }

    // Getter 和 Setter
    public Integer getPurchasedTicketId() {
        return purchasedTicketId;
    }

    public void setPurchasedTicketId(Integer purchasedTicketId) {
        this.purchasedTicketId = purchasedTicketId;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public Integer getTicketCount() {
        return ticketCount;
    }

    public void setTicketCount(Integer ticketCount) {
        this.ticketCount = ticketCount;
    }

    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    @Override
    public String toString() {
        return "PurchasedTicket{" +
                "purchasedTicketId=" + purchasedTicketId +
                ", typeId=" + typeId +
                ", userId=" + userId +
                ", unitName='" + unitName + '\'' +
                ", ticketCount=" + ticketCount +
                ", screeningId=" + screeningId +
                '}';
    }
}