package com.tudope.openapi_server.configs;

import com.tudope.openapi_server.domains.authorities.Permission;
import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.entities.AppUser;
import com.tudope.openapi_server.repositories.AppUserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final AppUserRepository userRepository;

    public SecurityConfig(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${ACTUATOR_USERNAME:NOT_SET}") String actuatorUsername,
            @Value("${ACTUATOR_PASSWORD:NOT_SET}") String actuatorPassword
    ) {
        if (Objects.equals(actuatorUsername, "NOT_SET") || Objects.equals(actuatorPassword, "NOT_SET")) {
            logger.warn("Cannot find ACTUATOR_USERNAME or ACTUATOR_PASSWORD from environment variables");
        }

        return username -> {
            // Check In-Memory (Actuator) first
            if (username.equals(actuatorUsername)) {
                return User.builder()
                        .username(actuatorUsername)
                        .password(passwordEncoder.encode(actuatorPassword))
                        .authorities("ROLE_ACTUATOR")
                        .build();
            }

            // Fallback to database
            AppUser appUser = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            List<GrantedAuthority> grantedAuthorities = appUser.getAuthorities().stream()
                    .map(a -> new SimpleGrantedAuthority(a.getPermission().name()))
                    .collect(Collectors.toList());

            return new AppUserDetails(
                    appUser.getId(),
                    appUser.getEmail(),
                    appUser.getPassword(),
                    grantedAuthorities
            );
        };
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
    @Order(1)
    @Profile("dev")
    public SecurityFilterChain springdocFilterChain(HttpSecurity http) {
        http
                .securityMatcher(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                )
                .authorizeHttpRequests(configurer -> configurer.anyRequest().permitAll());

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) {
        http
                .securityMatcher("/actuator/**")
                .csrf(CsrfConfigurer::disable)
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(configurer -> configurer
                        .requestMatchers("/actuator/health/**").permitAll()
                        .requestMatchers("/actuator/info/**").permitAll()
                        .requestMatchers("/actuator/**").hasAuthority(Permission.ROLE_ACTUATOR.name()));

        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) {
        http
                .securityMatcher("/api/**")
                .csrf(CsrfConfigurer::spa)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(logout -> logout
                        .logoutUrl("/api/auth/signout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies(
                                "JSESSIONID", // In-memory session
                                "SESSION" // JDBC session
                        )
                        .logoutSuccessHandler((_, res, _) -> res.setStatus(HttpServletResponse.SC_OK))
                )
                .exceptionHandling(ex -> ex
                        // Return 401 instead of triggering a browser Basic Auth popup
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .authorizeHttpRequests(configurer -> configurer
                        // Your App's Public APIs
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // All other App APIs (Required JDBC User)
                        .anyRequest().authenticated());

        return http.build();
    }

}
