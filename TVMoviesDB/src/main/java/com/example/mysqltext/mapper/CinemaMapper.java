package com.example.mysqltext.mapper;

import com.example.mysqltext.model.Cinema;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CinemaMapper {

    List<Cinema> findAll();

    Cinema findById(@Param("cinemaId") Integer cinemaId);

    List<Cinema> findByName(@Param("name") String name);

    int save(Cinema cinema);

    int update(Cinema cinema);

    int deleteById(@Param("cinemaId") Integer cinemaId);

    List<Cinema> findCinemasByMovieId(@Param("movieId") Integer movieId);

    List<java.util.Map<String, Object>> findCinemaHalls(@Param("cinemaId") Integer cinemaId);
}