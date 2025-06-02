package com.example.mysqltext.model;

public class Cinema {
    private Integer cinemaId;
    private String name;
    private String address;
    private String contactPhone;

    // 构造方法
    public Cinema() {
    }

    public Cinema(String name, String address, String contactPhone) {
        this.name = name;
        this.address = address;
        this.contactPhone = contactPhone;
    }

    // Getter 和 Setter
    public Integer getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Integer cinemaId) {
        this.cinemaId = cinemaId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    @Override
    public String toString() {
        return "Cinema{" +
                "cinemaId=" + cinemaId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                '}';
    }
}