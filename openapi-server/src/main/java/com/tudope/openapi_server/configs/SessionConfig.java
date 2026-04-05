package com.tudope.openapi_server.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.config.SessionRepositoryCustomizer;
import org.springframework.session.jdbc.JdbcIndexedSessionRepository;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration(proxyBeanMethods = false)
@EnableJdbcHttpSession
public class SessionConfig {

    private final String cookieDomain;
    private final String cookieSameSite;
    private final boolean cookieSecure;
    private final boolean cookieHttpOnly;

    public SessionConfig(
            @Value("${server.servlet.session.cookie.domain}") String cookieDomain,
            @Value("${server.servlet.session.cookie.same-site}") String cookieSameSite,
            @Value("${server.servlet.session.cookie.secure}") boolean cookieSecure,
            @Value("${server.servlet.session.cookie.http-only}") boolean cookieHttpOnly
    ) {
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
        this.cookieSecure = cookieSecure;
        this.cookieHttpOnly = cookieHttpOnly;
    }

    @Bean
    public SessionRepositoryCustomizer<JdbcIndexedSessionRepository> sessionRepositoryCustomizer(
            @Value("${spring.session.jdbc.cleanup-cron}") String cleanupCron
    ) {
        return repository -> {
            if (!cleanupCron.isBlank()) repository.setCleanupCron(cleanupCron);
        };
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("SESSION");
        if (!cookieDomain.isBlank()) serializer.setDomainName(cookieDomain);
        serializer.setSameSite(cookieSameSite);
        serializer.setUseSecureCookie(cookieSecure);
        serializer.setUseHttpOnlyCookie(cookieHttpOnly);
        return serializer;
    }

}
