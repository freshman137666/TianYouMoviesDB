package com.example.mysqltext.mapper;

import com.example.mysqltext.model.Order;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrderMapper {

    List<Order> findAll();

    Order findById(@Param("orderId") Integer orderId);

    List<Order> findByUserId(@Param("userId") Integer userId);

    Order findByOrderNumber(@Param("orderNumber") String orderNumber);

    int save(Order order);

    int update(Order order);

    int updateStatus(@Param("orderId") Integer orderId, @Param("status") String status);

    int updateTicketStatus(@Param("orderId") Integer orderId, @Param("ticketStatus") String ticketStatus);

    int deleteById(@Param("orderId") Integer orderId);

    Double calculateOrderAmount(@Param("screeningId") Integer screeningId, @Param("seatCount") Integer seatCount);

    java.util.Map<String, Object> createOrderWithSeats(@Param("order") Order order,
            @Param("seats") List<java.util.Map<String, Object>> seats);

    java.util.Map<String, Object> processPayment(@Param("orderId") Integer orderId,
            @Param("paymentMethod") String paymentMethod);

    java.util.Map<String, Object> cancelOrder(@Param("orderId") Integer orderId);

    List<java.util.Map<String, Object>> findOrderTickets(@Param("orderId") Integer orderId);
}