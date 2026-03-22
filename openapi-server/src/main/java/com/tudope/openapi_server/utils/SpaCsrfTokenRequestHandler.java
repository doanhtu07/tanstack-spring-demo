package com.tudope.openapi_server.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;

import java.util.function.Supplier;

/**
 * Based on implementation of CsrfConfigurer.SpaCsrfTokenRequestHandler
 * - But for cross site setup, client cannot read XSRF cookie even if it's set to HttpOnly false
 * - So we have an endpoint to return the CSRF token value in response body (NOTE: the token here is masked for BREACH attack protection)
 * - With default CsrfConfigurer::spa, it needs raw token in header X-XSRF-TOKEN
 * - So we rewrite the handler and always use XorCsrfTokenRequestAttributeHandler to resolve the token, which decodes the masked token
 */
public class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {

    private final CsrfTokenRequestAttributeHandler xor = new XorCsrfTokenRequestAttributeHandler();

    public SpaCsrfTokenRequestHandler() {
        this.xor.setCsrfRequestAttributeName(null);
    }

    @Override
    public void handle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Supplier<CsrfToken> csrfToken) {
        this.xor.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(@NonNull HttpServletRequest request, @NonNull CsrfToken csrfToken) {
        return this.xor.resolveCsrfTokenValue(request, csrfToken);
    }

}
