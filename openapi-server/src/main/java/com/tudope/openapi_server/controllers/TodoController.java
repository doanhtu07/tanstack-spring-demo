package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.dtos.todo.TodoAddRequestBody;
import com.tudope.openapi_server.dtos.todo.TodoDeleteRequestBody;
import com.tudope.openapi_server.dtos.todo.TodoResponse;
import com.tudope.openapi_server.dtos.todo.TodoUpdateRequestBody;
import com.tudope.openapi_server.entities.AppUser;
import com.tudope.openapi_server.entities.Todo;
import com.tudope.openapi_server.repositories.AppUserRepository;
import com.tudope.openapi_server.repositories.TodoRepository;
import com.tudope.openapi_server.services.SecurityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/todo", produces = MediaType.APPLICATION_JSON_VALUE)
public class TodoController {

    private final TodoRepository todoRepository;
    private final AppUserRepository appUserRepository;
    private final SecurityService securityService;

    public TodoController(TodoRepository todoRepository, AppUserRepository appUserRepository, SecurityService securityService) {
        this.todoRepository = todoRepository;
        this.appUserRepository = appUserRepository;
        this.securityService = securityService;
    }

    @GetMapping(value = "/list")
    public ResponseEntity<List<TodoResponse>> getTodoList(@AuthenticationPrincipal AppUserDetails user) {
        securityService.ensureUser(user);

        List<Todo> todos = todoRepository.findAllByOwnerId(user.id());

        List<TodoResponse> todoResponses = todos.stream()
                .map(TodoResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(todoResponses);
    }

    @PostMapping(value = "/add")
    public ResponseEntity<TodoResponse> postTodoAdd(
            @AuthenticationPrincipal AppUserDetails user,
            @Valid @RequestBody TodoAddRequestBody requestBody
    ) {
        securityService.ensureUser(user);

        String description = requestBody.description();

        // This is the magic line. It returns a "Proxy" (no SQL SELECT is fired)
        AppUser appUser = appUserRepository.getReferenceById(user.id());

        Todo todo = new Todo(description, false);
        todo.setOwner(appUser);
        todo = todoRepository.save(todo);

        return ResponseEntity.ok(TodoResponse.fromEntity(todo));
    }

    @DeleteMapping(value = "/remove")
    public ResponseEntity<Void> deleteTodoRemove(
            @AuthenticationPrincipal AppUserDetails user,
            @Valid @RequestBody TodoDeleteRequestBody requestBody
    ) {
        securityService.ensureUser(user);

        Long id = Long.valueOf(requestBody.id());

        if (!todoRepository.existsByIdAndOwnerId(id, user.id())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        todoRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/update")
    public ResponseEntity<TodoResponse> putTodoUpdate(
            @AuthenticationPrincipal AppUserDetails user,
            @Valid @RequestBody TodoUpdateRequestBody requestBody
    ) {
        securityService.ensureUser(user);

        Long id = Long.valueOf(requestBody.id());
        String description = requestBody.description();
        Boolean completed = requestBody.completed();

        Todo todo = todoRepository.findById(id).orElse(null);
        if (todo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!todo.getOwner().getId().equals(user.id())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        todo.setDescription(description);
        todo.setCompleted(completed);
        todo = todoRepository.save(todo);

        return ResponseEntity.ok(TodoResponse.fromEntity(todo));
    }

}
