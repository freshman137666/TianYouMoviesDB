package com.example.mysqltext.service;

import com.example.mysqltext.mapper.CinemaMapper;
import com.example.mysqltext.model.Cinema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaService {

    private static final Logger logger = LoggerFactory.getLogger(CinemaService.class);

    @Autowired
    private CinemaMapper cinemaMapper;

    // 获取所有影院
    public List<Cinema> getAllCinemas() {
        try {
            return cinemaMapper.findAll();
        } catch (Exception e) {
            logger.error("获取影院列表时发生错误", e);
            throw new RuntimeException("获取影院列表失败: " + e.getMessage());
        }
    }

    // 根据ID获取影院
    public Cinema getCinemaById(Integer cinemaId) {
        try {
            return cinemaMapper.findById(cinemaId);
        } catch (Exception e) {
            logger.error("根据ID查询影院时发生错误", e);
            throw new RuntimeException("查询影院失败: " + e.getMessage());
        }
    }

    // 根据名称搜索影院
    public List<Cinema> searchCinemasByName(String name) {
        try {
            return cinemaMapper.findByName(name);
        } catch (Exception e) {
            logger.error("根据名称搜索影院时发生错误", e);
            throw new RuntimeException("搜索影院失败: " + e.getMessage());
        }
    }

    // 添加影院
    public int addCinema(Cinema cinema) {
        try {
            return cinemaMapper.save(cinema);
        } catch (Exception e) {
            logger.error("添加影院时发生错误", e);
            throw new RuntimeException("添加影院失败: " + e.getMessage());
        }
    }

    // 更新影院
    public int updateCinema(Cinema cinema) {
        try {
            return cinemaMapper.update(cinema);
        } catch (Exception e) {
            logger.error("更新影院时发生错误", e);
            throw new RuntimeException("更新影院失败: " + e.getMessage());
        }
    }

    // 删除影院
    public int deleteCinema(Integer cinemaId) {
        try {
            return cinemaMapper.deleteById(cinemaId);
        } catch (Exception e) {
            logger.error("删除影院时发生错误", e);
            throw new RuntimeException("删除影院失败: " + e.getMessage());
        }
    }

    // 根据电影ID获取有该电影场次的影院
    public List<Cinema> getCinemasByMovieId(Integer movieId) {
        try {
            return cinemaMapper.findCinemasByMovieId(movieId);
        } catch (Exception e) {
            logger.error("根据电影ID查询影院时发生错误", e);
            throw new RuntimeException("查询影院失败: " + e.getMessage());
        }
    }

    // 获取影院的影厅信息
    public List<java.util.Map<String, Object>> getCinemaHalls(Integer cinemaId) {
        try {
            return cinemaMapper.findCinemaHalls(cinemaId);
        } catch (Exception e) {
            logger.error("获取影院影厅信息时发生错误", e);
            throw new RuntimeException("获取影厅信息失败: " + e.getMessage());
        }
    }
}