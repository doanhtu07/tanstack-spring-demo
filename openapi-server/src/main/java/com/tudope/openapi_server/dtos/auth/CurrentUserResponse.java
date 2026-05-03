package com.tudope.openapi_server.dtos.auth;

import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public record CurrentUserResponse(Long id, String email, Collection<? extends GrantedAuthority> authorities) {}
