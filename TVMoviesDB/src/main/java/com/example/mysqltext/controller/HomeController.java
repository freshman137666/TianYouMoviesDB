package com.example.mysqltext.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "天佑电影票务系统API服务正在运行");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}