package com.tudope.openapi_server.configs;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.Instant;
import java.util.Optional;

@TestConfiguration(proxyBeanMethods = false)
@EnableJpaAuditing
public class TestFixedTimeConfig {

    public static Instant fixedInstant = Instant.parse("2025-01-01T10:00:00.00Z");

    @Bean
    public DateTimeProvider dateTimeProvider() {
        return () -> Optional.of(fixedInstant);
    }

}
