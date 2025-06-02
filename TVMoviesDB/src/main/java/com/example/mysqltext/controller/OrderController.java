package com.example.mysqltext.controller;

import com.example.mysqltext.model.Order;
import com.example.mysqltext.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单（常规购票）
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 验证必填字段
            Integer userId = (Integer) orderData.get("userId");
            Integer screeningId = (Integer) orderData.get("screeningId");
            List<Map<String, Object>> seats = (List<Map<String, Object>>) orderData.get("seats");
            String paymentMethod = (String) orderData.get("paymentMethod");

            if (userId == null || screeningId == null || seats == null || seats.isEmpty()) {
                response.put("success", false);
                response.put("message", "缺少必要参数");
                return ResponseEntity.badRequest().body(response);
            }

            // 创建订单
            Order order = new Order();
            order.setUserId(userId);
            order.setScreeningId(screeningId);
            order.setPurchaseType("常规");
            order.setPaymentMethod(paymentMethod != null ? paymentMethod : "微信支付");
            order.setOrderTime(LocalDateTime.now());
            order.setStatus("待付");
            order.setTicketStatus("未出票");

            // 计算总金额（这里需要根据座位数量和票价计算）
            Double totalAmount = orderService.calculateOrderAmount(screeningId, seats.size());
            order.setPaymentAmount(totalAmount);

            // 锁定座位并创建订单
            Map<String, Object> result = orderService.createOrderWithSeats(order, seats);

            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("data", result.get("order"));
                response.put("message", "订单创建成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("创建订单失败", e);
            response.put("success", false);
            response.put("message", "创建订单失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 支付订单
     */
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<Map<String, Object>> payOrder(
            @PathVariable Integer orderId,
            @RequestBody Map<String, Object> paymentData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String paymentMethod = (String) paymentData.get("paymentMethod");

            Map<String, Object> result = orderService.processPayment(orderId, paymentMethod);

            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("data", result.get("order"));
                response.put("message", "支付成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("支付订单失败", e);
            response.put("success", false);
            response.put("message", "支付失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 取消订单
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Integer orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = orderService.cancelOrder(orderId);

            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("message", "订单取消成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("取消订单失败", e);
            response.put("success", false);
            response.put("message", "取消订单失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            response.put("success", true);
            response.put("data", orders);
            response.put("message", "获取订单列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户订单失败", e);
            response.put("success", false);
            response.put("message", "获取订单列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据订单ID获取订单详情
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Integer orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Order order = orderService.getOrderById(orderId);
            if (order != null) {
                response.put("success", true);
                response.put("data", order);
                response.put("message", "获取订单详情成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "订单不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取订单详情失败", e);
            response.put("success", false);
            response.put("message", "获取订单详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取订单的核验券信息
     */
    @GetMapping("/{orderId}/tickets")
    public ResponseEntity<Map<String, Object>> getOrderTickets(@PathVariable Integer orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> tickets = orderService.getOrderTickets(orderId);
            response.put("success", true);
            response.put("data", tickets);
            response.put("message", "获取核验券信息成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取核验券信息失败", e);
            response.put("success", false);
            response.put("message", "获取核验券信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}