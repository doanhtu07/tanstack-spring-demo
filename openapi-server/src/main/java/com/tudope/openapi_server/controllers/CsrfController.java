package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.SimpleResponse;
import com.tudope.openapi_server.dtos.auth.CsrfTokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class CsrfController {

    /**
     * Used for simple same-site setup
     */
    @GetMapping(value = "/public/init-csrf")
    public SimpleResponse getInitCsrf() {
        return new SimpleResponse("Welcome to API!");
    }

    /**
     * Used for cross-site setup (Not recommended)
     */
    @GetMapping("/public/csrf-token")
    public CsrfTokenResponse getCsrfToken(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        return new CsrfTokenResponse(token.getToken());
    }

}
