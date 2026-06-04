package com.digitalLibrary.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisTestController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping("/redis")
    public String redisTest() {

        redisTemplate.opsForValue().set("course", "Spring Boot");

        return redisTemplate.opsForValue().get("course");
    }
}
