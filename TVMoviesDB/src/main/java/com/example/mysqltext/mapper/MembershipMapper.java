package com.example.mysqltext.mapper;

import org.apache.ibatis.annotations.*;

import java.util.Map;

@Mapper
public interface MembershipMapper {

    Map<String, Object> findByUserId(@Param("userId") Integer userId);

    Map<String, Object> findByUserIdAndCinemaId(@Param("userId") Integer userId,
            @Param("cinemaId") Integer cinemaId);

    int save(Map<String, Object> membershipData);

    int update(Map<String, Object> membershipData);

    int updatePoints(@Param("userId") Integer userId,
            @Param("cinemaId") Integer cinemaId,
            @Param("points") Integer points);

    int updateLevel(@Param("userId") Integer userId,
            @Param("cinemaId") Integer cinemaId,
            @Param("level") String level);

    int deleteByUserIdAndCinemaId(@Param("userId") Integer userId,
            @Param("cinemaId") Integer cinemaId);
}