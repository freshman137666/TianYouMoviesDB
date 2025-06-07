package com.example.mysqltext.mapper;

import com.example.mysqltext.model.Hall;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HallMapper {

    List<Hall> findByCinemaId(@Param("cinemaId") Integer cinemaId);

    Hall findById(@Param("hallId") Integer hallId);

    int insert(Hall hall);

    int update(Hall hall);

    int deleteById(@Param("hallId") Integer hallId);

    List<Hall> findAll();
}