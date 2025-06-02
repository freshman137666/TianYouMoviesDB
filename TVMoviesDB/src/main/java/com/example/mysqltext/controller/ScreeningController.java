package com.example.mysqltext.controller;

import com.example.mysqltext.model.Screening;
import com.example.mysqltext.service.ScreeningService;
import com.example.mysqltext.service.CinemaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin(origins = "http://localhost:3000")
public class ScreeningController {

    private static final Logger logger = LoggerFactory.getLogger(ScreeningController.class);

    @Autowired
    private ScreeningService screeningService;

    @Autowired
    private CinemaService cinemaService;

    /**
     * 根据电影ID获取所有场次
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Map<String, Object>> getScreeningsByMovie(@PathVariable Integer movieId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Screening> screenings = screeningService.getScreeningsByMovieId(movieId);
            response.put("success", true);
            response.put("data", screenings);
            response.put("message", "获取场次列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取场次列表失败", e);
            response.put("success", false);
            response.put("message", "获取场次列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据电影ID和影院ID获取场次
     */
    @GetMapping("/movie/{movieId}/cinema/{cinemaId}")
    public ResponseEntity<Map<String, Object>> getScreeningsByMovieAndCinema(
            @PathVariable Integer movieId,
            @PathVariable Integer cinemaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里需要在ScreeningService中添加相应的方法
            List<Screening> screenings = screeningService.getScreeningsByMovieAndCinema(movieId, cinemaId);
            response.put("success", true);
            response.put("data", screenings);
            response.put("message", "获取场次列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取场次列表失败", e);
            response.put("success", false);
            response.put("message", "获取场次列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据电影ID、影院ID和日期获取场次
     */
    @GetMapping("/movie/{movieId}/cinema/{cinemaId}/date/{date}")
    public ResponseEntity<Map<String, Object>> getScreeningsByMovieCinemaAndDate(
            @PathVariable Integer movieId,
            @PathVariable Integer cinemaId,
            @PathVariable String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            LocalDate screeningDate = LocalDate.parse(date);
            LocalDateTime startTime = screeningDate.atStartOfDay();
            LocalDateTime endTime = screeningDate.atTime(LocalTime.MAX);

            List<Screening> screenings = screeningService.getScreeningsByMovieCinemaAndDateRange(
                    movieId, cinemaId, startTime, endTime);

            response.put("success", true);
            response.put("data", screenings);
            response.put("message", "获取场次列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取场次列表失败", e);
            response.put("success", false);
            response.put("message", "获取场次列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据场次ID获取场次详情
     */
    @GetMapping("/{screeningId}")
    public ResponseEntity<Map<String, Object>> getScreeningById(@PathVariable Integer screeningId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Screening screening = screeningService.getScreeningById(screeningId);
            if (screening != null) {
                response.put("success", true);
                response.put("data", screening);
                response.put("message", "获取场次详情成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "场次不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取场次详情失败", e);
            response.put("success", false);
            response.put("message", "获取场次详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取场次的座位信息
     */
    @GetMapping("/{screeningId}/seats")
    public ResponseEntity<Map<String, Object>> getScreeningSeats(@PathVariable Integer screeningId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里需要在ScreeningService中添加获取座位信息的方法
            List<Map<String, Object>> seats = screeningService.getScreeningSeats(screeningId);
            response.put("success", true);
            response.put("data", seats);
            response.put("message", "获取座位信息成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取座位信息失败", e);
            response.put("success", false);
            response.put("message", "获取座位信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}