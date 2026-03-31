package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.constants.MailTemplates;
import com.tudope.openapi_server.dtos.SimpleResponse;
import com.tudope.openapi_server.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class DemoController {

    private final EmailService emailService;

    public DemoController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping(value = "/public/hello")
    public SimpleResponse getHello() {
        return new SimpleResponse("Hello world!");
    }

    @PostMapping(value = "/upper-case")
    public SimpleResponse postUpperCase(@RequestParam String text) {
        return new SimpleResponse("Upper case: " + text.toUpperCase());
    }

    @PostMapping("/mail/hello")
    public SimpleResponse postMailHello(@RequestParam String to) {
        emailService.sendSimple(to, "Hello!", "Hello from Spring Boot!");
        return new SimpleResponse("Email sent to " + to);
    }

    @PostMapping("/mail/hello-html")
    public SimpleResponse postMailHelloHtml(
            @RequestParam String to,
            @RequestParam String name
    ) throws MessagingException {
        Map<String, Object> vars = Map.of(
                "name", name,
                "message", "Welcome to the app!"
        );
        emailService.sendHtml(to, "Hello!", MailTemplates.HELLO, vars);

        return new SimpleResponse("HTML email sent to " + to);
    }

}
