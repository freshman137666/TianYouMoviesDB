package com.example.mysqltext;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.mysqltext.mapper")
public class MysqlTextApplication {
    public static void main(String[] args) {
        SpringApplication.run(MysqlTextApplication.class, args);
    }
}
