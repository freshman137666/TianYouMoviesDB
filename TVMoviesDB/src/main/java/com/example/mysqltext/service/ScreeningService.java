package com.example.mysqltext.service;

import com.example.mysqltext.mapper.ScreeningMapper;
import com.example.mysqltext.model.Screening;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreeningService {

    private static final Logger logger = LoggerFactory.getLogger(ScreeningService.class);

    @Autowired
    private ScreeningMapper screeningMapper;

    // 获取所有场次
    public List<Screening> getAllScreenings() {
        try {
            return screeningMapper.findAll();
        } catch (Exception e) {
            logger.error("获取场次列表时发生错误", e);
            throw new RuntimeException("获取场次列表失败: " + e.getMessage());
        }
    }

    // 根据ID获取场次
    public Screening getScreeningById(Integer screeningId) {
        try {
            return screeningMapper.findById(screeningId);
        } catch (Exception e) {
            logger.error("根据ID查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 根据电影ID获取场次
    public List<Screening> getScreeningsByMovieId(Integer movieId) {
        try {
            return screeningMapper.findByMovieId(movieId);
        } catch (Exception e) {
            logger.error("根据电影ID查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 根据影厅ID获取场次
    public List<Screening> getScreeningsByHallId(Integer hallId) {
        try {
            return screeningMapper.findByHallId(hallId);
        } catch (Exception e) {
            logger.error("根据影厅ID查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 根据时间范围获取场次
    public List<Screening> getScreeningsByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return screeningMapper.findByTimeRange(startTime, endTime);
        } catch (Exception e) {
            logger.error("根据时间范围查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 添加场次
    public int addScreening(Screening screening) {
        try {
            return screeningMapper.save(screening);
        } catch (Exception e) {
            logger.error("添加场次时发生错误", e);
            throw new RuntimeException("添加场次失败: " + e.getMessage());
        }
    }

    // 更新场次
    public int updateScreening(Screening screening) {
        try {
            return screeningMapper.update(screening);
        } catch (Exception e) {
            logger.error("更新场次时发生错误", e);
            throw new RuntimeException("更新场次失败: " + e.getMessage());
        }
    }

    // 增加剩余座位数
    public int increaseSeatRemain(Integer screeningId, Integer count) {
        try {
            return screeningMapper.increaseSeatRemain(screeningId, count);
        } catch (Exception e) {
            logger.error("增加剩余座位数时发生错误", e);
            throw new RuntimeException("增加剩余座位数失败: " + e.getMessage());
        }
    }

    // 根据电影ID和影院ID获取场次
    public List<Screening> getScreeningsByMovieAndCinema(Integer movieId, Integer cinemaId) {
        try {
            return screeningMapper.findByMovieAndCinema(movieId, cinemaId);
        } catch (Exception e) {
            logger.error("根据电影和影院查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 根据电影ID、影院ID和时间范围获取场次
    public List<Screening> getScreeningsByMovieCinemaAndDateRange(Integer movieId, Integer cinemaId,
            LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return screeningMapper.findByMovieCinemaAndDateRange(movieId, cinemaId, startTime, endTime);
        } catch (Exception e) {
            logger.error("根据电影、影院和时间范围查询场次时发生错误", e);
            throw new RuntimeException("查询场次失败: " + e.getMessage());
        }
    }

    // 获取场次的座位信息
    public List<java.util.Map<String, Object>> getScreeningSeats(Integer screeningId) {
        try {
            return screeningMapper.findScreeningSeats(screeningId);
        } catch (Exception e) {
            logger.error("获取场次座位信息时发生错误", e);
            throw new RuntimeException("获取座位信息失败: " + e.getMessage());
        }
    }



    // 删除场次
    public int deleteScreening(Integer screeningId) {
        try {
            return screeningMapper.deleteById(screeningId);
        } catch (Exception e) {
            logger.error("删除场次时发生错误", e);
            throw new RuntimeException("删除场次失败: " + e.getMessage());
        }
    }
}