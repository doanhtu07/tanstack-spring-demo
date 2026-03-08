package com.tudope.openapi_server.dtos.todo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TodoUpdateRequestBody(
        @NotNull String id,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull Boolean completed
) {
}
