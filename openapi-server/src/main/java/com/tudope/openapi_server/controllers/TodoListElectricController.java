package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.constants.ElectricProtocol;
import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.services.SecurityService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/electric/todo/list")
public class TodoListElectricController {

    private final RestClient electricRestClient;
    private final String electricSecret;
    private final SecurityService securityService;

    public TodoListElectricController(
            RestClient electricRestClient,
            @Value("${electric.secret}") String electricSecret,
            SecurityService securityService
    ) {
        this.electricRestClient = electricRestClient;
        this.electricSecret = electricSecret;
        this.securityService = securityService;
    }

    /**
     * Handle Electric SQL API requests for todo list
     * <p>
     * <a href="https://electric-sql.com/docs/guides/auth#implementing-post-support-in-your-proxy">
     * Implementing POST support in your proxy
     * </a>
     */
    @RequestMapping(
            method = {RequestMethod.GET, RequestMethod.POST},
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<Map<String, Object>>> handleElectricTodoList(
            HttpServletRequest request,
            @RequestBody(required = false) Map<String, Object> body,
            @AuthenticationPrincipal AppUserDetails user
    ) {
        securityService.ensureUser(user);

        String method = request.getMethod();

        if (HttpMethod.POST.name().equalsIgnoreCase(method)) {
            return handlePost(request, body, user);
        } else {
            return handleGet(request, user);
        }
    }

    private ResponseEntity<List<Map<String, Object>>> handlePost(
            HttpServletRequest request,
            Map<String, Object> body,
            AppUserDetails user
    ) {
        Map<String, String[]> requestParams = request.getParameterMap();
        Map<String, Object> sanitizedBody = new HashMap<>();

        if (body != null) {
            body.forEach((key, value) -> {
                if (ElectricProtocol.ELECTRIC_SUBSET_BODY_PARAMS.contains(key)) {
                    sanitizedBody.put(key, value);
                }
            });
        }

        var responseEntity = electricRestClient.post()
                .uri(uriBuilder -> buildTodoListBaseUri(uriBuilder, requestParams, user.id()))
                .body(sanitizedBody)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                });

        return proxyResponse(responseEntity);
    }

    private ResponseEntity<List<Map<String, Object>>> handleGet(
            HttpServletRequest request,
            AppUserDetails user
    ) {
        Map<String, String[]> requestParams = request.getParameterMap();

        var responseEntity = electricRestClient.get()
                .uri(uriBuilder -> buildTodoListBaseUri(uriBuilder, requestParams, user.id()))
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                });

        return proxyResponse(responseEntity);
    }

    /**
     * Build base query params that are used for both POST and GET
     * <p>
     * Electric SQL will merge query params with body params when using POST
     * <p>
     * Usually, we want to establish security in base URI
     */
    private URI buildTodoListBaseUri(
            UriBuilder builder,
            Map<String, String[]> params,
            Long userId
    ) {
        var protocolParams = params.entrySet().stream()
                .filter(e -> ElectricProtocol.ELECTRIC_PROTOCOL_QUERY_PARAMS.contains(e.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, e -> List.of(e.getValue())));

        builder.queryParam(ElectricProtocol.SECRET_QUERY_PARAM, electricSecret)
                .queryParams(CollectionUtils.toMultiValueMap(protocolParams))
                .queryParam(ElectricProtocol.TABLE_QUERY_PARAM, "todo")
                .queryParam(ElectricProtocol.WHERE_QUERY_PARAM, "owner_id = $1")
                .queryParam("params[1]", userId);

        return builder.build();
    }

    private ResponseEntity<List<Map<String, Object>>> proxyResponse(
            ResponseEntity<List<Map<String, Object>>> upstream
    ) {
        var headers = new HttpHeaders();

        upstream.getHeaders().forEach((name, values) -> {
            if (
                    name.toLowerCase().startsWith("electric-") ||
                            name.equalsIgnoreCase("access-control-expose-headers")
            ) {
                headers.addAll(name, values);
            }
        });

        return new ResponseEntity<>(upstream.getBody(), headers, HttpStatus.OK);
    }

}
