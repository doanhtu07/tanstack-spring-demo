package com.tudope.openapi_server.configs;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.json.JsonMapper;

@Configuration(proxyBeanMethods = false)
public class JacksonConfig {

    @Bean
    public JsonMapper jsonMapper(JsonMapper.Builder builder) {
        // The 'builder' here is already pre-configured with Spring Boot defaults
        return builder
                .changeDefaultPropertyInclusion(include ->
                        include.withValueInclusion(JsonInclude.Include.NON_NULL) // Don't send nulls
                )
                .build();
    }

}
