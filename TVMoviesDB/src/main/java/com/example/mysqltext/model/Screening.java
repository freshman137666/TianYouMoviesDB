package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Screening {
    private Integer screeningId;
    private Integer movieId;
    private Integer hallId;
    private LocalDateTime screeningTime;
    private BigDecimal ticketPrice;
    private Integer seatRemain;

    // 构造方法
    public Screening() {
    }

    public Screening(Integer movieId, Integer hallId, LocalDateTime screeningTime,
            BigDecimal ticketPrice, Integer seatRemain) {
        this.movieId = movieId;
        this.hallId = hallId;
        this.screeningTime = screeningTime;
        this.ticketPrice = ticketPrice;
        this.seatRemain = seatRemain;
    }

    // Getter 和 Setter
    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getHallId() {
        return hallId;
    }

    public void setHallId(Integer hallId) {
        this.hallId = hallId;
    }

    public LocalDateTime getScreeningTime() {
        return screeningTime;
    }

    public void setScreeningTime(LocalDateTime screeningTime) {
        this.screeningTime = screeningTime;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public Integer getSeatRemain() {
        return seatRemain;
    }

    public void setSeatRemain(Integer seatRemain) {
        if (seatRemain != null && seatRemain < 0) {
            throw new IllegalArgumentException("剩余座位数不能为负数");
        }
        this.seatRemain = seatRemain;
    }

    // 剩余座位数验证方法
    public static boolean validateSeatRemain(Integer seatRemain) {
        return seatRemain == null || seatRemain >= 0;
    }

    @Override
    public String toString() {
        return "Screening{" +
                "screeningId=" + screeningId +
                ", movieId=" + movieId +
                ", hallId=" + hallId +
                ", screeningTime=" + screeningTime +
                ", ticketPrice=" + ticketPrice +
                ", seatRemain=" + seatRemain +
                '}';
    }
}