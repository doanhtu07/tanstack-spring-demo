package com.tudope.admin_monitor.configs;

import java.util.UUID;
import java.util.logging.Logger;

import com.tudope.admin_monitor.domains.authorities.Permission;
import com.tudope.admin_monitor.filters.CustomCsrfFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import de.codecentric.boot.admin.server.config.AdminServerProperties;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.POST;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    private static final Logger logger = Logger.getLogger(SecurityConfig.class.getName());

    private final AdminServerProperties adminServer;

    public SecurityConfig(AdminServerProperties adminServer) {
        this.adminServer = adminServer;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        // Redirect to login after successful authentication
        SavedRequestAwareAuthenticationSuccessHandler successHandler =
                new SavedRequestAwareAuthenticationSuccessHandler();

        successHandler.setTargetUrlParameter("redirectTo");
        successHandler.setDefaultTargetUrl(adminServer.path("/"));

        http
                .authorizeHttpRequests(auth -> auth
                        // Permit access to static resources
                        .requestMatchers(
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/assets/**"))
                        )
                        .permitAll()

                        // Permit access to login page
                        .requestMatchers(
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/login"))
                        )
                        .permitAll()

                        // Permit access to error page
                        .requestMatchers(
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/error"))
                        )
                        .permitAll()

                        // Permit Admin Server's own actuator endpoints
                        .requestMatchers(
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/actuator/info"))
                        )
                        .permitAll()
                        .requestMatchers(
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/actuator/health"))
                        )
                        .permitAll()

                        // Require authentication for all other requests
                        .anyRequest().authenticated()
                )
                // Form login for UI
                .formLogin(formLogin -> formLogin
                        .loginPage(adminServer.path("/login"))
                        .successHandler(successHandler)
                )
                // Logout configuration
                .logout(logout -> logout
                        .logoutUrl(adminServer.path("/logout"))
                )
                // HTTP Basic for API clients
                .httpBasic(Customizer.withDefaults());

        // CSRF configuration (see CSRF Protection section)
        http.addFilterAfter(new CustomCsrfFilter(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        .ignoringRequestMatchers(
                                // Exempt client registration endpoints
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(POST, adminServer.path("/instances")),
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(DELETE, adminServer.path("/instances/*")),
                                // Exempt Admin Server's own actuator
                                PathPatternRequestMatcher.withDefaults()
                                        .matcher(adminServer.path("/actuator/**"))
                        )
                );

        // Remember-me functionality
        http.rememberMe(rememberMe -> rememberMe
                .key(UUID.randomUUID().toString())
                .tokenValiditySeconds(1209600) // 2 weeks
        );

        return http.build();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USERNAME:NOT_SET}") String adminUsername,
            @Value("${ADMIN_PASSWORD:NOT_SET}") String adminPassword
    ) {
        if ("NOT_SET".equals(adminUsername) || "NOT_SET".equals(adminPassword)) {
            // You'll know immediately if the .env wasn't parsed
            logger.warning("Using default 'NOT_SET' username or password. Check your .env.example file!");
        }

        UserDetails user = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .authorities(Permission.ROLE_ADMIN.name())
                .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
