package com.tudope.openapi_server.entities;

import com.tudope.openapi_server.config.TestcontainersConfig;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.liquibase.autoconfigure.LiquibaseAutoConfiguration;
import org.springframework.context.annotation.Import;

import java.time.Instant;
import java.util.TimeZone;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@Import(TestcontainersConfig.class)
@ImportAutoConfiguration(LiquibaseAutoConfiguration.class)
class UserUtcIT {

    @Autowired
    private EntityManager em;

    @Test
    void createdAt_isStoredAsAbsoluteUtcInstant() {
        // Set timezone to verify UTC persistence logic
        TimeZone.setDefault(TimeZone.getTimeZone("America/Chicago"));

        User user = new User("pw", true);
        em.persist(user);

        // Force Hibernate to flush changes to database
        em.flush();
        em.clear();

        Long id = user.getId();

        // Read value via Hibernate
        Instant hibernateInstant = em.find(User.class, id).getCreatedAt();

        // Read raw value from PostgreSQL
        Object raw = em.createNativeQuery("""
                            SELECT created_at
                            FROM app_user
                            WHERE id = :id
                        """)
                .setParameter("id", id)
                .getSingleResult();

        Instant postgresInstant = (Instant) raw;

        System.out.println("Hibernate Instant : " + hibernateInstant);
        System.out.println("Postgres Instant  : " + postgresInstant);

        assertThat(hibernateInstant).isEqualTo(postgresInstant);
    }
}
