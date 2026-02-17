package com.tudope.openapi_server.dtos;

import jakarta.validation.constraints.NotNull;

public class SimpleResponse {

    @NotNull
    private String message;

    // Default constructor required by Jackson
    public SimpleResponse() {
    }

    public SimpleResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
