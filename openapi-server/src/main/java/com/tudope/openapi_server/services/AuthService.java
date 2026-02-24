package com.tudope.openapi_server.services;

import com.tudope.openapi_server.domains.authorities.Permission;
import com.tudope.openapi_server.dtos.auth.SignupRequestBody;
import com.tudope.openapi_server.entities.AppUser;
import com.tudope.openapi_server.entities.Authority;
import com.tudope.openapi_server.repositories.AppUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signin(HttpServletRequest request, String email, String password) throws ServletException {
        request.login(email, password);
    }

    @Transactional
    public void registerUser(SignupRequestBody requestBody) {
        // Hash the password
        String encodedPassword = passwordEncoder.encode(requestBody.password());

        // Build the User entity
        AppUser user = new AppUser(requestBody.email(), encodedPassword, true);

        // Add default role (using your Authority entity logic)
        Authority userAuthority = new Authority();
        userAuthority.setPermission(Permission.ROLE_USER);
        user.addAuthority(userAuthority);

        // Save (CascadeType.ALL handles the Authority table)
        userRepository.save(user);
    }

}
