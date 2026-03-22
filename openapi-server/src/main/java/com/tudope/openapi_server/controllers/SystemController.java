package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.dtos.SimpleResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class SystemController {
    
    @GetMapping(value = "/public/heartbeat")
    public SimpleResponse getHeartbeat() {
        return new SimpleResponse("Heartbeat OK!");
    }

}
