package com.tudope.openapi_server.dtos;

import jakarta.validation.constraints.NotNull;

public record SimpleResponse(
        @NotNull String message
) {
}
