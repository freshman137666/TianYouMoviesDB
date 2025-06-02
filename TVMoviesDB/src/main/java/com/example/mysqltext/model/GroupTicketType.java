package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GroupTicketType {
    private Integer typeId;
    private String ticketType; // ENUM('学生票','亲子票','团体票')
    private Integer cinemaId;
    private Integer movieId;
    private Integer minClientCount;
    private Integer maxClientCount;
    private BigDecimal unitPrice;
    private LocalDate validUntil;
    private Integer stock;
    private Boolean isActive;

    // 构造方法
    public GroupTicketType() {
    }

    public GroupTicketType(String ticketType, Integer cinemaId, Integer movieId,
            Integer minClientCount, Integer maxClientCount,
            BigDecimal unitPrice, LocalDate validUntil, Integer stock) {
        this.ticketType = ticketType;
        this.cinemaId = cinemaId;
        this.movieId = movieId;
        this.minClientCount = minClientCount;
        this.maxClientCount = maxClientCount;
        this.unitPrice = unitPrice;
        this.validUntil = validUntil;
        this.stock = stock;
        this.isActive = true;
    }

    // Getter 和 Setter
    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public String getTicketType() {
        return ticketType;
    }

    public void setTicketType(String ticketType) {
        this.ticketType = ticketType;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getMinClientCount() {
        return minClientCount;
    }

    public void setMinClientCount(Integer minClientCount) {
        this.minClientCount = minClientCount;
    }

    public Integer getMaxClientCount() {
        return maxClientCount;
    }

    public void setMaxClientCount(Integer maxClientCount) {
        this.maxClientCount = maxClientCount;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "GroupTicketType{" +
                "typeId=" + typeId +
                ", ticketType='" + ticketType + '\'' +
                ", cinemaId=" + cinemaId +
                ", movieId=" + movieId +
                ", unitPrice=" + unitPrice +
                ", validUntil=" + validUntil +
                ", stock=" + stock +
                ", isActive=" + isActive +
                '}';
    }
}