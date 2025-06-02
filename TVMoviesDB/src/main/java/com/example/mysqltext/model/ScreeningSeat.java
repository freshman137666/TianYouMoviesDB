package com.example.mysqltext.model;

import java.time.LocalDateTime;

public class ScreeningSeat {
    private Integer screeningSeatId;
    private Integer screeningId;
    private Integer seatRow;
    private Integer seatCol;
    private String status; // ENUM('可用','已锁定','已售出')
    private LocalDateTime lockTime;

    // 构造方法
    public ScreeningSeat() {
    }

    public ScreeningSeat(Integer screeningId, Integer seatRow, Integer seatCol) {
        this.screeningId = screeningId;
        this.seatRow = seatRow;
        this.seatCol = seatCol;
        this.status = "可用";
    }

    public ScreeningSeat(Integer screeningId, Integer seatRow, Integer seatCol, String status) {
        this.screeningId = screeningId;
        this.seatRow = seatRow;
        this.seatCol = seatCol;
        this.status = status;
    }

    // Getter 和 Setter
    public Integer getScreeningSeatId() {
        return screeningSeatId;
    }

    public void setScreeningSeatId(Integer screeningSeatId) {
        this.screeningSeatId = screeningSeatId;
    }

    public Integer getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Integer screeningId) {
        this.screeningId = screeningId;
    }

    public Integer getSeatRow() {
        return seatRow;
    }

    public void setSeatRow(Integer seatRow) {
        this.seatRow = seatRow;
    }

    public Integer getSeatCol() {
        return seatCol;
    }

    public void setSeatCol(Integer seatCol) {
        this.seatCol = seatCol;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getLockTime() {
        return lockTime;
    }

    public void setLockTime(LocalDateTime lockTime) {
        this.lockTime = lockTime;
    }

    @Override
    public String toString() {
        return "ScreeningSeat{" +
                "screeningSeatId=" + screeningSeatId +
                ", screeningId=" + screeningId +
                ", seatRow=" + seatRow +
                ", seatCol=" + seatCol +
                ", status='" + status + '\'' +
                ", lockTime=" + lockTime +
                '}';
    }
}