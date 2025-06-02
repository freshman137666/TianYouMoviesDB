package com.example.mysqltext.service;

import com.example.mysqltext.mapper.OrderMapper;
import com.example.mysqltext.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderMapper orderMapper;

    // 获取所有订单
    public List<Order> getAllOrders() {
        try {
            return orderMapper.findAll();
        } catch (Exception e) {
            logger.error("获取订单列表时发生错误", e);
            throw new RuntimeException("获取订单列表失败: " + e.getMessage());
        }
    }

    // 根据ID获取订单
    public Order getOrderById(Integer orderId) {
        try {
            return orderMapper.findById(orderId);
        } catch (Exception e) {
            logger.error("根据ID查询订单时发生错误", e);
            throw new RuntimeException("查询订单失败: " + e.getMessage());
        }
    }

    // 根据用户ID获取订单
    public List<Order> getOrdersByUserId(Integer userId) {
        try {
            return orderMapper.findByUserId(userId);
        } catch (Exception e) {
            logger.error("根据用户ID查询订单时发生错误", e);
            throw new RuntimeException("查询订单失败: " + e.getMessage());
        }
    }

    // 根据订单号获取订单
    public Order getOrderByOrderNumber(String orderNumber) {
        try {
            return orderMapper.findByOrderNumber(orderNumber);
        } catch (Exception e) {
            logger.error("根据订单号查询订单时发生错误", e);
            throw new RuntimeException("查询订单失败: " + e.getMessage());
        }
    }

    // 创建订单
    public int createOrder(Order order) {
        try {
            // 生成唯一订单号
            if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
                order.setOrderNumber(generateOrderNumber());
            }
            return orderMapper.save(order);
        } catch (Exception e) {
            logger.error("创建订单时发生错误", e);
            throw new RuntimeException("创建订单失败: " + e.getMessage());
        }
    }

    // 更新订单
    public int updateOrder(Order order) {
        try {
            return orderMapper.update(order);
        } catch (Exception e) {
            logger.error("更新订单时发生错误", e);
            throw new RuntimeException("更新订单失败: " + e.getMessage());
        }
    }

    // 更新订单状态
    public int updateOrderStatus(Integer orderId, String status) {
        try {
            return orderMapper.updateStatus(orderId, status);
        } catch (Exception e) {
            logger.error("更新订单状态时发生错误", e);
            throw new RuntimeException("更新订单状态失败: " + e.getMessage());
        }
    }

    // 更新票务状态
    public int updateTicketStatus(Integer orderId, String ticketStatus) {
        try {
            return orderMapper.updateTicketStatus(orderId, ticketStatus);
        } catch (Exception e) {
            logger.error("更新票务状态时发生错误", e);
            throw new RuntimeException("更新票务状态失败: " + e.getMessage());
        }
    }

    // 删除订单
    public int deleteOrder(Integer orderId) {
        try {
            return orderMapper.deleteById(orderId);
        } catch (Exception e) {
            logger.error("删除订单时发生错误", e);
            throw new RuntimeException("删除订单失败: " + e.getMessage());
        }
    }

    // 生成唯一订单号
    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // 计算订单金额
    public Double calculateOrderAmount(Integer screeningId, Integer seatCount) {
        try {
            return orderMapper.calculateOrderAmount(screeningId, seatCount);
        } catch (Exception e) {
            logger.error("计算订单金额时发生错误", e);
            throw new RuntimeException("计算订单金额失败: " + e.getMessage());
        }
    }

    // 创建订单并锁定座位
    public java.util.Map<String, Object> createOrderWithSeats(Order order, List<java.util.Map<String, Object>> seats) {
        try {
            return orderMapper.createOrderWithSeats(order, seats);
        } catch (Exception e) {
            logger.error("创建订单并锁定座位时发生错误", e);
            throw new RuntimeException("创建订单失败: " + e.getMessage());
        }
    }

    // 处理支付
    public java.util.Map<String, Object> processPayment(Integer orderId, String paymentMethod) {
        try {
            return orderMapper.processPayment(orderId, paymentMethod);
        } catch (Exception e) {
            logger.error("处理支付时发生错误", e);
            throw new RuntimeException("支付处理失败: " + e.getMessage());
        }
    }

    // 取消订单
    public java.util.Map<String, Object> cancelOrder(Integer orderId) {
        try {
            return orderMapper.cancelOrder(orderId);
        } catch (Exception e) {
            logger.error("取消订单时发生错误", e);
            throw new RuntimeException("取消订单失败: " + e.getMessage());
        }
    }

    /**
     * 获取订单票券信息
     */
    public List<java.util.Map<String, Object>> getOrderTickets(Integer orderId) {
        try {
            return orderMapper.findOrderTickets(orderId);
        } catch (Exception e) {
            logger.error("获取订单票券信息失败: orderId={}", orderId, e);
            throw new RuntimeException("获取订单票券信息失败", e);
        }
    }

    /**
     * 获取用户的待核验票券
     */
    public List<java.util.Map<String, Object>> getUserPendingTickets(Integer userId) {
        try {
            List<Order> userOrders = orderMapper.findByUserId(userId);
            List<java.util.Map<String, Object>> allTickets = new java.util.ArrayList<>();

            for (Order order : userOrders) {
                if ("待核验".equals(order.getTicketStatus())) {
                    List<java.util.Map<String, Object>> tickets = orderMapper.findOrderTickets(order.getOrderId());
                    allTickets.addAll(tickets);
                }
            }

            return allTickets;
        } catch (Exception e) {
            logger.error("获取用户待核验票券失败: userId={}", userId, e);
            throw new RuntimeException("获取用户待核验票券失败", e);
        }
    }

    // 支付订单
    public int payOrder(Integer orderId, String paymentMethod, String bankCardNumber) {
        try {
            Order order = orderMapper.findById(orderId);
            if (order == null) {
                throw new RuntimeException("订单不存在");
            }
            if (!"待定".equals(order.getStatus())) {
                throw new RuntimeException("订单状态不允许支付");
            }

            // 更新订单支付信息
            order.setStatus("已付");
            order.setPaymentMethod(paymentMethod);
            order.setBankCardNumber(bankCardNumber);
            order.setPaymentTime(java.time.LocalDateTime.now());

            return orderMapper.update(order);
        } catch (Exception e) {
            logger.error("支付订单时发生错误", e);
            throw new RuntimeException("支付订单失败: " + e.getMessage());
        }
    }

   
    
}