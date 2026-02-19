package com.tudope.openapi_server.entities;

import com.tudope.openapi_server.config.TestFixedTimeConfig;
import com.tudope.openapi_server.config.TestcontainersConfig;
import com.tudope.openapi_server.repositories.AppUserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.liquibase.autoconfigure.LiquibaseAutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@ImportAutoConfiguration(LiquibaseAutoConfiguration.class)
@Import({TestFixedTimeConfig.class, TestcontainersConfig.class})
class AppUserUtcIT {

    @Autowired
    private EntityManager em;

    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    void createdAt_isStoredAsAbsoluteUtcInstant() {
        // 1. Create an AppUser. Note that createdAt is fixed to 2025-01-01T10:00:00.00Z due to TestFixedTimeConfig
        AppUser appUser = new AppUser("pw", true);

        // 2. Act
        appUserRepository.saveAndFlush(appUser);
        em.clear();

        // 3. Assert
        Instant dbInstant = (Instant) em.createNativeQuery("""
                            SELECT created_at
                            FROM app_user
                            WHERE id = :id
                        """, Instant.class)
                .setParameter("id", appUser.getId())
                .getSingleResult();

        assertThat(dbInstant).isEqualTo(TestFixedTimeConfig.fixedInstant);
    }
}
