package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.dtos.auth.CurrentUserResponse;
import com.tudope.openapi_server.dtos.auth.SigninRequestBody;
import com.tudope.openapi_server.dtos.auth.SignupRequestBody;
import com.tudope.openapi_server.services.AuthService;
import com.tudope.openapi_server.utils.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Tutorial link: <a href="https://www.baeldung.com/spring-security-auto-login-user-after-registration#:~:text=Next%2C%20we%20can%20also%20directly,created%20account%20is%20still%20disabled">
 * Spring Security auto login user after registration
 * </a>.
 */
@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/signin")
    public ResponseEntity<Void> postSignin(
            HttpServletRequest request,
            HttpServletResponse response,
            @Valid @RequestBody SigninRequestBody requestBody
    ) {
        authService.signin(request, response, requestBody.email(), requestBody.password());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> postSignup(
            HttpServletRequest request,
            HttpServletResponse response,
            @Valid @RequestBody SignupRequestBody requestBody
    ) {
        authService.registerUser(requestBody.email(), requestBody.password());
        authService.signin(request, response, requestBody.email(), requestBody.password());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signout")
    public void postSignout() {
        // This method body is never reached.
        // It exists only to satisfy the OpenAPI generator.
        throw new IllegalStateException("This request should be intercepted by Spring Security");
    }

    @GetMapping("/current-user")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
            // NOTE: Type "AppUserDetails" is really sensitive. It will be null if UserDetailsService returns a different type
            // By default, UserDetailsService returns built-in org.springframework.security.core.userdetails.User class
            @AuthenticationPrincipal AppUserDetails user
    ) {
        SecurityUtils.ensureUser(user);

        return ResponseEntity.ok(new CurrentUserResponse(
                user.id(),
                user.getUsername(),
                user.getAuthorities()
        ));
    }

}
