package com.example.mysqltext.controller;

import com.example.mysqltext.model.Cinema;
import com.example.mysqltext.service.CinemaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "http://localhost:3000")
public class CinemaController {

    private static final Logger logger = LoggerFactory.getLogger(CinemaController.class);

    @Autowired
    private CinemaService cinemaService;

    /**
     * 获取所有影院
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCinemas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Cinema> cinemas = cinemaService.getAllCinemas();
            response.put("success", true);
            response.put("data", cinemas);
            response.put("message", "获取影院列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取影院列表失败", e);
            response.put("success", false);
            response.put("message", "获取影院列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据ID获取影院详情
     */
    @GetMapping("/{cinemaId}")
    public ResponseEntity<Map<String, Object>> getCinemaById(@PathVariable Integer cinemaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Cinema cinema = cinemaService.getCinemaById(cinemaId);
            if (cinema != null) {
                response.put("success", true);
                response.put("data", cinema);
                response.put("message", "获取影院详情成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "影院不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取影院详情失败", e);
            response.put("success", false);
            response.put("message", "获取影院详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据电影ID获取有该电影场次的影院
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Map<String, Object>> getCinemasByMovie(@PathVariable Integer movieId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Cinema> cinemas = cinemaService.getCinemasByMovieId(movieId);
            response.put("success", true);
            response.put("data", cinemas);
            response.put("message", "获取影院列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取影院列表失败", e);
            response.put("success", false);
            response.put("message", "获取影院列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取影院的影厅信息
     */
    @GetMapping("/{cinemaId}/halls")
    public ResponseEntity<Map<String, Object>> getCinemaHalls(@PathVariable Integer cinemaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> halls = cinemaService.getCinemaHalls(cinemaId);
            response.put("success", true);
            response.put("data", halls);
            response.put("message", "获取影厅信息成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取影厅信息失败", e);
            response.put("success", false);
            response.put("message", "获取影厅信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}