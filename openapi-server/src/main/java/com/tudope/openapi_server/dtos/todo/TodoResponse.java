package com.tudope.openapi_server.dtos.todo;

import com.tudope.openapi_server.entities.Todo;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record TodoResponse(
        @NotNull Long id,
        @NotNull String description,
        @NotNull boolean completed,
        @NotNull Long ownerId,
        @NotNull Instant createdAt,
        @NotNull Instant updatedAt
) {

    public static TodoResponse fromEntity(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getOwner().getId(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }

}
