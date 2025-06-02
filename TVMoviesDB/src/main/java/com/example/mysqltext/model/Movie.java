package com.example.mysqltext.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Movie {
    private Integer movieId;
    private String title;
    private String description;
    private String actors;
    private String director;
    private Integer duration;
    private LocalDate releaseDate;
    private LocalDate offShelfDate;
    private String category;
    private BigDecimal rating;
    private String releaseRegion;
    private BigDecimal basePrice;

    // 构造方法
    public Movie() {
    }

    public Movie(String title, String description, String actors, String director,
            Integer duration, LocalDate releaseDate, LocalDate offShelfDate,
            String category, String releaseRegion, BigDecimal basePrice) {
        this.title = title;
        this.description = description;
        this.actors = actors;
        this.director = director;
        this.duration = duration;
        this.releaseDate = releaseDate;
        this.offShelfDate = offShelfDate;
        this.category = category;
        this.rating = new BigDecimal("5.0");
        this.releaseRegion = releaseRegion;
        this.basePrice = basePrice;
    }

    // Getter 和 Setter
    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActors() {
        return actors;
    }

    public void setActors(String actors) {
        this.actors = actors;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public LocalDate getOffShelfDate() {
        return offShelfDate;
    }

    public void setOffShelfDate(LocalDate offShelfDate) {
        this.offShelfDate = offShelfDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getReleaseRegion() {
        return releaseRegion;
    }

    public void setReleaseRegion(String releaseRegion) {
        this.releaseRegion = releaseRegion;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "movieId=" + movieId +
                ", title='" + title + '\'' +
                ", director='" + director + '\'' +
                ", duration=" + duration +
                ", releaseDate=" + releaseDate +
                ", rating=" + rating +
                ", basePrice=" + basePrice +
                '}';
    }
}