package com.tudope.openapi_server.services;

import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SecurityService {

    private final String cookieDomain;
    private final String cookieSameSite;
    private final boolean cookieSecure;

    public SecurityService(
            @Value("${server.servlet.session.cookie.domain}") String cookieDomain,
            @Value("${server.servlet.session.cookie.same-site}") String cookieSameSite,
            @Value("${server.servlet.session.cookie.secure}") boolean cookieSecure
    ) {
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
        this.cookieSecure = cookieSecure;
    }

    public void ensureUser(AppUserDetails user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Cannot find active user session");
        }
    }

    public CookieCsrfTokenRepository cookieCsrfTokenRepository() {
        // 'withHttpOnlyFalse' is required so your SPA (React/Vue/etc) can read the cookie
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();

        repository.setCookieCustomizer(cookie -> {
            cookie.domain(cookieDomain);
            cookie.sameSite(cookieSameSite);
            cookie.secure(cookieSecure);
        });

        return repository;
    }

}
