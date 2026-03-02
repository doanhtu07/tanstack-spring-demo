package com.tudope.openapi_server.dtos.auth;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public record AppUserDetails(
        Long id,
        String email,
        String password,
        Collection<? extends GrantedAuthority> authorities
) implements UserDetails {

    @Override
    @NonNull
    public String getUsername() {
        return email;
    }

    @Override
    @NonNull
    public String getPassword() {
        return password;
    }

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

}
