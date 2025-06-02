package com.example.mysqltext.controller;

import com.example.mysqltext.model.GroupTicketType;
import com.example.mysqltext.model.PurchasedTicket;
import com.example.mysqltext.service.GroupTicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/group-tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupTicketController {

    private static final Logger logger = LoggerFactory.getLogger(GroupTicketController.class);

    @Autowired
    private GroupTicketService groupTicketService;

    /**
     * 根据电影ID和影院ID获取团购票类型
     */
    @GetMapping("/movie/{movieId}/cinema/{cinemaId}")
    public ResponseEntity<Map<String, Object>> getGroupTicketTypes(
            @PathVariable Integer movieId,
            @PathVariable Integer cinemaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<GroupTicketType> groupTickets = groupTicketService.getGroupTicketsByMovieAndCinema(movieId, cinemaId);
            response.put("success", true);
            response.put("data", groupTickets);
            response.put("message", "获取团购票列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取团购票列表失败", e);
            response.put("success", false);
            response.put("message", "获取团购票列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据团购票类型ID获取详情
     */
    @GetMapping("/{groupTicketId}")
    public ResponseEntity<Map<String, Object>> getGroupTicketById(@PathVariable Integer groupTicketId) {
        Map<String, Object> response = new HashMap<>();
        try {
            GroupTicketType groupTicket = groupTicketService.getGroupTicketById(groupTicketId);
            if (groupTicket != null) {
                response.put("success", true);
                response.put("data", groupTicket);
                response.put("message", "获取团购票详情成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "团购票不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取团购票详情失败", e);
            response.put("success", false);
            response.put("message", "获取团购票详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 购买团购票
     */
    @PostMapping("/purchase")
    public ResponseEntity<Map<String, Object>> purchaseGroupTicket(@RequestBody Map<String, Object> purchaseData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer userId = (Integer) purchaseData.get("userId");
            Integer groupTicketTypeId = (Integer) purchaseData.get("groupTicketTypeId");
            Integer quantity = (Integer) purchaseData.get("quantity");
            String paymentMethod = (String) purchaseData.get("paymentMethod");

            if (userId == null || groupTicketTypeId == null || quantity == null) {
                response.put("success", false);
                response.put("message", "缺少必要参数");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> result = groupTicketService.purchaseGroupTicket(
                    userId, groupTicketTypeId, quantity, paymentMethod);

            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("data", result.get("purchasedTicket"));
                response.put("message", "团购票购买成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("购买团购票失败", e);
            response.put("success", false);
            response.put("message", "购买团购票失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取用户的团购票
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserGroupTickets(@PathVariable Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<PurchasedTicket> purchasedTickets = groupTicketService.getUserPurchasedTickets(userId);
            response.put("success", true);
            response.put("data", purchasedTickets);
            response.put("message", "获取用户团购票成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户团购票失败", e);
            response.put("success", false);
            response.put("message", "获取用户团购票失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 使用团购票（选择场次和座位）
     */
    @PostMapping("/use")
    public ResponseEntity<Map<String, Object>> useGroupTicket(@RequestBody Map<String, Object> useData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer purchasedTicketId = (Integer) useData.get("purchasedTicketId");
            Integer screeningId = (Integer) useData.get("screeningId");
            List<Map<String, Object>> seats = (List<Map<String, Object>>) useData.get("seats");

            if (purchasedTicketId == null || screeningId == null || seats == null || seats.isEmpty()) {
                response.put("success", false);
                response.put("message", "缺少必要参数");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> result = groupTicketService.useGroupTicket(
                    purchasedTicketId, screeningId, seats);

            if ((Boolean) result.get("success")) {
                response.put("success", true);
                response.put("data", result.get("order"));
                response.put("message", "团购票使用成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", result.get("message"));
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("使用团购票失败", e);
            response.put("success", false);
            response.put("message", "使用团购票失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}