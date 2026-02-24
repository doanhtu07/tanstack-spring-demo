package com.tudope.openapi_server.dtos.auth;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public record CurrentUserResponse(
        Long id,
        String email,
        Collection<? extends GrantedAuthority> authorities
) {
}
