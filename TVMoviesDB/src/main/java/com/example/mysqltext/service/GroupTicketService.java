package com.example.mysqltext.service;

import com.example.mysqltext.mapper.GroupTicketMapper;
import com.example.mysqltext.mapper.OrderMapper;
import com.example.mysqltext.mapper.PurchasedTicketMapper;
import com.example.mysqltext.model.GroupTicketType;
import com.example.mysqltext.model.Order;
import com.example.mysqltext.model.PurchasedTicket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroupTicketService {

    private static final Logger logger = LoggerFactory.getLogger(GroupTicketService.class);

    @Autowired
    private GroupTicketMapper groupTicketMapper;

    @Autowired
    private PurchasedTicketMapper purchasedTicketMapper;

    @Autowired
    private OrderMapper orderMapper;

    /**
     * 根据电影和影院获取团购票类型
     */
    public List<GroupTicketType> getGroupTicketsByMovieAndCinema(Integer movieId, Integer cinemaId) {
        try {
            return groupTicketMapper.findByMovieAndCinema(movieId, cinemaId);
        } catch (Exception e) {
            logger.error("获取团购票列表失败: movieId={}, cinemaId={}", movieId, cinemaId, e);
            throw new RuntimeException("获取团购票列表失败", e);
        }
    }

    /**
     * 根据ID获取团购票类型
     */
    public GroupTicketType getGroupTicketById(Integer groupTicketId) {
        try {
            return groupTicketMapper.findById(groupTicketId);
        } catch (Exception e) {
            logger.error("获取团购票详情失败: groupTicketId={}", groupTicketId, e);
            throw new RuntimeException("获取团购票详情失败", e);
        }
    }

    /**
     * 购买团购票
     */
    @Transactional
    public Map<String, Object> purchaseGroupTicket(Integer userId, Integer groupTicketTypeId,
            Integer quantity, String paymentMethod) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查团购票是否存在且有效
            GroupTicketType groupTicketType = groupTicketMapper.findById(groupTicketTypeId);
            if (groupTicketType == null) {
                result.put("success", false);
                result.put("message", "团购票类型不存在");
                return result;
            }

            if (!groupTicketType.getIsActive()) {
                result.put("success", false);
                result.put("message", "团购票已失效");
                return result;
            }

            if (groupTicketType.getValidUntil().isBefore(LocalDateTime.now().toLocalDate())) {
                result.put("success", false);
                result.put("message", "团购票已过期");
                return result;
            }

            if (groupTicketType.getStock() < quantity) {
                result.put("success", false);
                result.put("message", "团购票库存不足");
                return result;
            }

            // 检查购买数量是否符合要求
            if (quantity < groupTicketType.getMinClientCount() || quantity > groupTicketType.getMaxClientCount()) {
                result.put("success", false);
                result.put("message", String.format("购买数量必须在%d-%d之间",
                        groupTicketType.getMinClientCount(), groupTicketType.getMaxClientCount()));
                return result;
            }

            // 创建购买记录
            PurchasedTicket purchasedTicket = new PurchasedTicket();
            purchasedTicket.setUserId(userId);
            purchasedTicket.setTypeId(groupTicketTypeId);
            purchasedTicket.setTicketCount(quantity);
            // Note: PurchasedTicket模型中没有totalPrice, purchaseTime, isUsed等字段
            // 这些字段需要在模型中添加或使用其他方式处理

            int insertResult = purchasedTicketMapper.save(purchasedTicket);
            if (insertResult > 0) {
                // 更新库存
                groupTicketMapper.updateStock(groupTicketTypeId, groupTicketType.getStock() - quantity);

                result.put("success", true);
                result.put("purchasedTicket", purchasedTicket);
                result.put("message", "团购票购买成功");
            } else {
                result.put("success", false);
                result.put("message", "团购票购买失败");
            }

            return result;
        } catch (Exception e) {
            logger.error("购买团购票失败: userId={}, groupTicketTypeId={}, quantity={}",
                    userId, groupTicketTypeId, quantity, e);
            result.put("success", false);
            result.put("message", "购买团购票失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 获取用户购买的团购票
     */
    public List<PurchasedTicket> getUserPurchasedTickets(Integer userId) {
        try {
            return purchasedTicketMapper.findByUserId(userId);
        } catch (Exception e) {
            logger.error("获取用户团购票失败: userId={}", userId, e);
            throw new RuntimeException("获取用户团购票失败", e);
        }
    }

    /**
     * 使用团购票（选择场次和座位）
     */
    @Transactional
    public Map<String, Object> useGroupTicket(Integer purchasedTicketId, Integer screeningId,
            List<Map<String, Object>> seats) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查团购票是否存在且未使用
            PurchasedTicket purchasedTicket = purchasedTicketMapper.findById(purchasedTicketId);
            if (purchasedTicket == null) {
                result.put("success", false);
                result.put("message", "团购票不存在");
                return result;
            }

            // Note: PurchasedTicket模型中没有isUsed字段，需要其他方式判断是否已使用
            // if (purchasedTicket.getIsUsed()) {
            // result.put("success", false);
            // result.put("message", "团购票已使用");
            // return result;
            // }

            // 检查座位数量是否匹配
            if (seats.size() != purchasedTicket.getTicketCount()) {
                result.put("success", false);
                result.put("message", String.format("选择的座位数量(%d)与团购票数量(%d)不匹配",
                        seats.size(), purchasedTicket.getTicketCount()));
                return result;
            }

            // 创建订单
            Order order = new Order();
            order.setUserId(purchasedTicket.getUserId());
            order.setScreeningId(screeningId);
            order.setPurchasedTicketId(purchasedTicketId);
            order.setPurchaseType("group");
            order.setStatus("已付"); // 团购票已付款
            order.setTicketStatus("未使用");
            order.setOrderTime(LocalDateTime.now());
            order.setPaymentMethod("团购票");

            // 使用OrderMapper创建订单和座位
            Map<String, Object> orderResult = orderMapper.createOrderWithSeats(order, seats);

            if ((Boolean) orderResult.get("success")) {
                // Note: PurchasedTicket模型中没有isUsed和usedTime字段
                // 标记团购票为已使用需要其他方式实现
                // purchasedTicket.setIsUsed(true);
                // purchasedTicket.setUsedTime(LocalDateTime.now());
                // purchasedTicketMapper.update(purchasedTicket);

                result.put("success", true);
                result.put("order", orderResult.get("order"));
                result.put("message", "团购票使用成功");
            } else {
                result.put("success", false);
                result.put("message", orderResult.get("message"));
            }

            return result;
        } catch (Exception e) {
            logger.error("使用团购票失败: purchasedTicketId={}, screeningId={}",
                    purchasedTicketId, screeningId, e);
            result.put("success", false);
            result.put("message", "使用团购票失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 获取所有团购票类型
     */
    public List<GroupTicketType> getAllGroupTicketTypes() {
        try {
            return groupTicketMapper.findAll();
        } catch (Exception e) {
            logger.error("获取所有团购票类型失败", e);
            throw new RuntimeException("获取所有团购票类型失败", e);
        }
    }

    /**
     * 添加团购票类型
     */
    public GroupTicketType addGroupTicketType(GroupTicketType groupTicketType) {
        try {
            int result = groupTicketMapper.save(groupTicketType);
            if (result > 0) {
                return groupTicketType;
            } else {
                throw new RuntimeException("添加团购票类型失败");
            }
        } catch (Exception e) {
            logger.error("添加团购票类型失败", e);
            throw new RuntimeException("添加团购票类型失败", e);
        }
    }

    /**
     * 更新团购票类型
     */
    public GroupTicketType updateGroupTicketType(GroupTicketType groupTicketType) {
        try {
            int result = groupTicketMapper.update(groupTicketType);
            if (result > 0) {
                return groupTicketMapper.findById(groupTicketType.getTypeId());
            } else {
                throw new RuntimeException("更新团购票类型失败");
            }
        } catch (Exception e) {
            logger.error("更新团购票类型失败", e);
            throw new RuntimeException("更新团购票类型失败", e);
        }
    }

    /**
     * 删除团购票类型
     */
    public void deleteGroupTicketType(Integer groupTicketTypeId) {
        try {
            int result = groupTicketMapper.deleteById(groupTicketTypeId);
            if (result == 0) {
                throw new RuntimeException("删除团购票类型失败，可能不存在");
            }
        } catch (Exception e) {
            logger.error("删除团购票类型失败: groupTicketTypeId={}", groupTicketTypeId, e);
            throw new RuntimeException("删除团购票类型失败", e);
        }
    }
}