package com.example.mysqltext.service;

import com.example.mysqltext.mapper.MovieMapper;
import com.example.mysqltext.model.Movie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

    @Autowired
    private MovieMapper movieMapper;

    // 获取所有电影
    public List<Movie> getAllMovies() {
        try {
            return movieMapper.findAll();
        } catch (Exception e) {
            logger.error("获取电影列表时发生错误", e);
            throw new RuntimeException("获取电影列表失败: " + e.getMessage());
        }
    }

    // 根据ID获取电影
    public Movie getMovieById(Integer movieId) {
        try {
            return movieMapper.findById(movieId);
        } catch (Exception e) {
            logger.error("根据ID查询电影时发生错误", e);
            throw new RuntimeException("查询电影失败: " + e.getMessage());
        }
    }

    // 根据标题搜索电影
    public List<Movie> searchMoviesByTitle(String title) {
        try {
            return movieMapper.findByTitle(title);
        } catch (Exception e) {
            logger.error("根据标题搜索电影时发生错误", e);
            throw new RuntimeException("搜索电影失败: " + e.getMessage());
        }
    }

    // 根据类别搜索电影
    public List<Movie> searchMoviesByCategory(String category) {
        try {
            return movieMapper.findByCategory(category);
        } catch (Exception e) {
            logger.error("根据类别搜索电影时发生错误", e);
            throw new RuntimeException("搜索电影失败: " + e.getMessage());
        }
    }

    // 获取当前上映的电影
    public List<Movie> getCurrentMovies() {
        try {
            return movieMapper.findCurrentMovies();
        } catch (Exception e) {
            logger.error("获取当前上映电影时发生错误", e);
            throw new RuntimeException("获取当前上映电影失败: " + e.getMessage());
        }
    }

    // 添加电影
    public int addMovie(Movie movie) {
        try {
            return movieMapper.save(movie);
        } catch (Exception e) {
            logger.error("添加电影时发生错误", e);
            throw new RuntimeException("添加电影失败: " + e.getMessage());
        }
    }

    // 更新电影
    public int updateMovie(Movie movie) {
        try {
            return movieMapper.update(movie);
        } catch (Exception e) {
            logger.error("更新电影时发生错误", e);
            throw new RuntimeException("更新电影失败: " + e.getMessage());
        }
    }

    // 删除电影
    public int deleteMovie(Integer movieId) {
        try {
            return movieMapper.deleteById(movieId);
        } catch (Exception e) {
            logger.error("删除电影时发生错误", e);
            throw new RuntimeException("删除电影失败: " + e.getMessage());
        }
    }
}