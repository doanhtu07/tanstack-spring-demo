package com.tudope.openapi_server.utils;

import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SecurityUtils {

    private SecurityUtils() {
        /* This utility class should not be instantiated */
    }

    public static void ensureUser(AppUserDetails user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Cannot find active user session");
        }
    }

}
