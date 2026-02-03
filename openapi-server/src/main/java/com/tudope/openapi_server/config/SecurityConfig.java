package com.tudope.openapi_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final Environment env;

    public SecurityConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsManager() {
        UserDetails tudope = User.builder()
                .username("tudope")
                .password("{noop}test123")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(tudope);
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
        http.csrf(CsrfConfigurer::spa);

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
                    // Public APIs
                    .requestMatchers(HttpMethod.GET, "/api/public/*").permitAll()

                    // Protected APIs
                    .anyRequest().authenticated();
        });

        return http.build();
    }

}
