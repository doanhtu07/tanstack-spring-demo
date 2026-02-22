package com.tudope.openapi_server;

import com.tudope.openapi_server.configs.TestcontainersConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfig.class)
class OpenapiServerApplicationTest {

    @Test
    void contextLoads() {
    }

}
