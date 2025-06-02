package com.example.mysqltext.mapper;

import com.example.mysqltext.model.PurchasedTicket;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchasedTicketMapper {

    List<PurchasedTicket> findAll();

    PurchasedTicket findById(@Param("purchasedTicketId") Integer purchasedTicketId);

    List<PurchasedTicket> findByUserId(@Param("userId") Integer userId);

    List<PurchasedTicket> findByGroupTicketTypeId(@Param("groupTicketTypeId") Integer groupTicketTypeId);

    List<PurchasedTicket> findUnusedByUserId(@Param("userId") Integer userId);

    List<PurchasedTicket> findUsedByUserId(@Param("userId") Integer userId);

    int save(PurchasedTicket purchasedTicket);

    int update(PurchasedTicket purchasedTicket);

    int updateUsedStatus(@Param("purchasedTicketId") Integer purchasedTicketId,
            @Param("isUsed") Boolean isUsed);

    int deleteById(@Param("purchasedTicketId") Integer purchasedTicketId);
}