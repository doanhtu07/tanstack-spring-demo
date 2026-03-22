package com.tudope.openapi_server.dtos.auth;

import jakarta.validation.constraints.NotNull;

public record CsrfTokenResponse(
        @NotNull String token
) {
}
