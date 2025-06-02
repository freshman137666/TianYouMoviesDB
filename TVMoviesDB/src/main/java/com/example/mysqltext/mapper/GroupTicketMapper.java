package com.example.mysqltext.mapper;

import com.example.mysqltext.model.GroupTicketType;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GroupTicketMapper {

    List<GroupTicketType> findAll();

    GroupTicketType findById(@Param("groupTicketTypeId") Integer groupTicketTypeId);

    List<GroupTicketType> findByMovieAndCinema(@Param("movieId") Integer movieId,
            @Param("cinemaId") Integer cinemaId);

    List<GroupTicketType> findByMovieId(@Param("movieId") Integer movieId);

    List<GroupTicketType> findByCinemaId(@Param("cinemaId") Integer cinemaId);

    List<GroupTicketType> findActiveTickets();

    int save(GroupTicketType groupTicketType);

    int update(GroupTicketType groupTicketType);

    int updateStock(@Param("groupTicketTypeId") Integer groupTicketTypeId,
            @Param("stock") Integer stock);

    int updateActiveStatus(@Param("groupTicketTypeId") Integer groupTicketTypeId,
            @Param("isActive") Boolean isActive);

    int deleteById(@Param("groupTicketTypeId") Integer groupTicketTypeId);
}