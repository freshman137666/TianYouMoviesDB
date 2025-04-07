package com.example.mysqltext.mapper;

import com.example.mysqltext.model.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM users")
    List<User> findAll();
    
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(@Param("id") int id);
    
    @Insert("INSERT INTO users (id, name) VALUES (#{id}, #{name})")
    int save(User user);
    
    @Update("UPDATE users SET name = #{name} WHERE id = #{id}")
    int update(User user);
    
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(@Param("id") int id);
}