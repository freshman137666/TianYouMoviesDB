package com.example.mysqltext.controller;

import com.example.mysqltext.model.Movie;
import com.example.mysqltext.service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private static final Logger logger = LoggerFactory.getLogger(MovieController.class);

    @Autowired
    private MovieService movieService;

    /**
     * 获取所有电影（首页展示）
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMovies() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Movie> movies = movieService.getAllMovies();
            response.put("success", true);
            response.put("data", movies);
            response.put("message", "获取电影列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取电影列表失败", e);
            response.put("success", false);
            response.put("message", "获取电影列表失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取当前上映的电影
     */
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentMovies() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Movie> movies = movieService.getCurrentMovies();
            response.put("success", true);
            response.put("data", movies);
            response.put("message", "获取当前上映电影成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取当前上映电影失败", e);
            response.put("success", false);
            response.put("message", "获取当前上映电影失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据ID获取电影详情
     */
    @GetMapping("/{movieId}")
    public ResponseEntity<Map<String, Object>> getMovieById(@PathVariable Integer movieId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Movie movie = movieService.getMovieById(movieId);
            if (movie != null) {
                response.put("success", true);
                response.put("data", movie);
                response.put("message", "获取电影详情成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "电影不存在");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            logger.error("获取电影详情失败", e);
            response.put("success", false);
            response.put("message", "获取电影详情失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 根据标题搜索电影
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Movie> movies;
            if (title != null && !title.trim().isEmpty()) {
                movies = movieService.searchMoviesByTitle(title);
            } else if (category != null && !category.trim().isEmpty()) {
                movies = movieService.searchMoviesByCategory(category);
            } else {
                movies = movieService.getAllMovies();
            }

            response.put("success", true);
            response.put("data", movies);
            response.put("message", "搜索电影成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("搜索电影失败", e);
            response.put("success", false);
            response.put("message", "搜索电影失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}