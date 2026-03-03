package com.tudope.openapi_server.dtos.todo;

import jakarta.validation.constraints.NotBlank;

public record TodoAddRequestBody(
        @NotBlank(message = "Description is required")
        String description
) {
}
