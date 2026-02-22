package com.tudope.openapi_server.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    private static final Logger logger = Logger.getLogger(SecurityConfig.class.getName());

    private final Environment env;

    public SecurityConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            DataSource dataSource,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USERNAME:NOT_SET}") String adminUsername,
            @Value("${ADMIN_PASSWORD:NOT_SET}") String adminPassword
    ) {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);

        // 1. Check the Database
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .passwordEncoder(passwordEncoder)
                // Map the numeric ID to text so it can safely compare against "admin"
                .usersByUsernameQuery("SELECT id::text, password, enabled FROM app_user WHERE id::text = ?")
                .authoritiesByUsernameQuery("SELECT user_id::text, role FROM authority WHERE user_id::text = ?");

        if ("NOT_SET".equals(adminUsername) || "NOT_SET".equals(adminPassword)) {
            // You'll know immediately if the .env.example wasn't parsed
            logger.warning("Using default 'NOT_SET' user or password. Check your .env.example file!");
        }

        // 2. Check the In-Memory Admin (from your .env.example)
        auth.inMemoryAuthentication()
                .withUser(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .roles("ADMIN");

        return auth.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // apply to all endpoints
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        boolean isDev = Arrays.asList(env.getActiveProfiles()).contains("dev");

        http.httpBasic(Customizer.withDefaults());

        // https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript-spa
        http.csrf(csrf -> csrf
                .spa()
                .ignoringRequestMatchers("/actuator/**") // Since actuator endpoints don't rely on cookies, we can ignore CSRF for them
        );

        http.authorizeHttpRequests(configurer -> {
            if (isDev) {
                // Permit Swagger freely only in dev
                configurer
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll();
            }

            configurer
                    // 1. Public Actuators (No login required)
                    .requestMatchers("/actuator/health/**").permitAll()
                    .requestMatchers("/actuator/info/**").permitAll()

                    // 2. Sensitive Actuators (Required In-Memory Admin)
                    .requestMatchers("/actuator/**").hasRole("ADMIN")

                    // 3. Your App's Public APIs
                    .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()

                    // 4. All other App APIs (Required JDBC User)
                    .anyRequest().authenticated();
        });

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
