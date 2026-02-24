package com.tudope.openapi_server.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public record SignupRequestBody(
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
