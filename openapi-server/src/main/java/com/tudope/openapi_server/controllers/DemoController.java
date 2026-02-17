package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.SimpleResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class DemoController {

    @GetMapping(value = "/public/init-csrf")
    public SimpleResponse getInitCsrf() {
        return new SimpleResponse("Welcome to API!");
    }

    @GetMapping(value = "/public/hello")
    public SimpleResponse getHello() {
        return new SimpleResponse("Hello world!");
    }

    @PostMapping(value = "/translate")
    public SimpleResponse postTranslate(@RequestParam String text) {
        return new SimpleResponse("Translated: " + text.toUpperCase());
    }

}
