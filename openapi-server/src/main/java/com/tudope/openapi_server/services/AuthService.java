package com.tudope.openapi_server.services;

import com.tudope.openapi_server.domains.authorities.Permission;
import com.tudope.openapi_server.entities.AppUser;
import com.tudope.openapi_server.entities.Authority;
import com.tudope.openapi_server.repositories.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;
    private final AuthenticationManager authenticationManager;

    private final AppUserRepository userRepository;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    public void signin(HttpServletRequest request, HttpServletResponse response, String email, String password) {
        // Create authentication token
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(email, password);

        Authentication auth = authenticationManager.authenticate(authToken);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);

        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

    @Transactional
    public void registerUser(String email, String password) {
        // Hash the password
        String encodedPassword = passwordEncoder.encode(password);

        // Build the User entity
        AppUser user = new AppUser(email, encodedPassword, true);

        // Add default role (using your Authority entity logic)
        Authority userAuthority = new Authority();
        userAuthority.setPermission(Permission.ROLE_USER);
        user.addAuthority(userAuthority);

        // Save (CascadeType.ALL handles the Authority table)
        userRepository.save(user);
    }

}
