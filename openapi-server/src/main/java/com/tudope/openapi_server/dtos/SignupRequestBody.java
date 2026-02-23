package com.tudope.openapi_server.dtos;

import jakarta.validation.constraints.NotBlank;

public class SignupRequestBody {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // Default constructor required by Jackson
    public SignupRequestBody() {
    }

    public SignupRequestBody(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // MARK: Getters and Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
