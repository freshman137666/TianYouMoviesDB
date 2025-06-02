package com.example.mysqltext.model;

public class Hall {
    private Integer hallId;
    private String name;
    private Integer cinemaId;
    private Integer capacity;
    private String type; // ENUM('2D','3D','IMAX','杜比','4D','动感','巨幕')

    // 构造方法
    public Hall() {
    }

    public Hall(String name, Integer cinemaId, Integer capacity, String type) {
        this.name = name;
        this.cinemaId = cinemaId;
        this.capacity = capacity;
        this.type = type;
    }

    // Getter 和 Setter
    public Integer getHallId() {
        return hallId;
    }

    public void setHallId(Integer hallId) {
        this.hallId = hallId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Hall{" +
                "hallId=" + hallId +
                ", name='" + name + '\'' +
                ", cinemaId=" + cinemaId +
                ", capacity=" + capacity +
                ", type='" + type + '\'' +
                '}';
    }
}