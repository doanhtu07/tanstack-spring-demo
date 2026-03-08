package com.tudope.openapi_server.dtos.todo;

import jakarta.validation.constraints.NotNull;

public record TodoDeleteRequestBody(
        @NotNull String id
) {
}
