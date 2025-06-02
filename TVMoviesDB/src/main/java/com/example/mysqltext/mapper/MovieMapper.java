package com.example.mysqltext.mapper;

import com.example.mysqltext.model.Movie;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MovieMapper {

        List<Movie> findAll();

        Movie findById(@Param("movieId") Integer movieId);

        List<Movie> findByTitle(@Param("title") String title);

        List<Movie> findByCategory(@Param("category") String category);

        List<Movie> findCurrentMovies();

        int save(Movie movie);

        int update(Movie movie);

        int deleteById(@Param("movieId") Integer movieId);
}