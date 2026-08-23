package com.palette.bff.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@Configuration
@ConditionalOnProperty(name = "palette.session.store", havingValue = "redis")
@EnableRedisHttpSession
public class RedisSessionConfig {
}
