package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.dtos.auth.CurrentUserResponse;
import com.tudope.openapi_server.dtos.auth.SignupRequestBody;
import com.tudope.openapi_server.services.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    // Tutorial: https://www.baeldung.com/spring-security-auto-login-user-after-registration#:~:text=Next%2C%20we%20can%20also%20directly,created%20account%20is%20still%20disabled.

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/signin")
    public ResponseEntity<Void> postSignin(HttpServletRequest request, @RequestParam String email, @RequestParam String password) {
        try {
            authService.signin(request, email, password);
        } catch (ServletException _) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> postSignup(HttpServletRequest request, @Valid @RequestBody SignupRequestBody requestBody) {
        authService.registerUser(requestBody);

        try {
            authService.signin(request, requestBody.email(), requestBody.password());
        } catch (ServletException _) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signout")
    public void postSignout() {
        // This method body is never reached.
        // It exists only to satisfy the OpenAPI generator.
        throw new IllegalStateException("This request should be intercepted by Spring Security.");
    }

    @GetMapping("/current-user")
    public CurrentUserResponse getCurrentUser(
            @AuthenticationPrincipal AppUserDetails user
    ) {
        return new CurrentUserResponse(
                user.id(),
                user.getUsername(),
                user.getAuthorities()
        );
    }

}
