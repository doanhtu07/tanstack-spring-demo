package com.tudope.admin_monitor.dtos;

import jakarta.validation.constraints.NotNull;

public record SimpleResponse(
        @NotNull String message
) {
}
