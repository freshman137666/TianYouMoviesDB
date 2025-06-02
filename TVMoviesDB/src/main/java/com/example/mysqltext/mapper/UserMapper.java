package com.example.mysqltext.mapper;

import com.example.mysqltext.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    List<User> findAll();

    User findById(@Param("userId") Integer userId);

    User findByPhone(@Param("phone") String phone);

    User findByEmail(@Param("email") String email);

    int save(User user);

    int update(User user);

    int deleteById(@Param("userId") Integer userId);
}