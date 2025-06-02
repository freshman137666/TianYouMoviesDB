package com.example.mysqltext.mapper;

import com.example.mysqltext.model.Screening;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ScreeningMapper {

    List<Screening> findAll();

    Screening findById(@Param("screeningId") Integer screeningId);

    List<Screening> findByMovieId(@Param("movieId") Integer movieId);

    List<Screening> findByHallId(@Param("hallId") Integer hallId);

    List<Screening> findByTimeRange(@Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    int save(Screening screening);

    int update(Screening screening);

    int updateSeatRemain(@Param("screeningId") Integer screeningId, @Param("count") Integer count);

    int decreaseSeatRemain(@Param("screeningId") Integer screeningId, @Param("count") Integer count);

    int increaseSeatRemain(@Param("screeningId") Integer screeningId, @Param("count") Integer count);

    List<Screening> findByMovieAndCinema(@Param("movieId") Integer movieId, @Param("cinemaId") Integer cinemaId);

    List<Screening> findByMovieCinemaAndDateRange(@Param("movieId") Integer movieId,
            @Param("cinemaId") Integer cinemaId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    List<java.util.Map<String, Object>> findScreeningSeats(@Param("screeningId") Integer screeningId);

    int deleteById(@Param("screeningId") Integer screeningId);
}