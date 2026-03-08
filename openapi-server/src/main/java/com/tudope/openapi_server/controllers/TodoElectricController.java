package com.tudope.openapi_server.controllers;

import com.tudope.openapi_server.constants.ElectricProtocol;
import com.tudope.openapi_server.dtos.auth.AppUserDetails;
import com.tudope.openapi_server.utils.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/electric/todo")
public class TodoElectricController {

    private final RestClient electricRestClient;

    public TodoElectricController(RestClient electricRestClient) {
        this.electricRestClient = electricRestClient;
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Map<String, Object>>> getElectricTodoList(
            HttpServletRequest request,
            @AuthenticationPrincipal AppUserDetails user
    ) {
        SecurityUtils.ensureUser(user);

        Map<String, String[]> params = request.getParameterMap();

        var responseEntity = electricRestClient.get()
                .uri(uriBuilder -> buildTodoListUri(uriBuilder, params, user.id()))
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                });

        List<Map<String, Object>> rawList = responseEntity.getBody();

        if (rawList == null) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }

        var responseHeaders = new HttpHeaders();
        var upstreamHeaders = responseEntity.getHeaders();

        upstreamHeaders.forEach((headerName, headerValues) -> {
            String lower = headerName.toLowerCase();

            if (lower.equals("access-control-expose-headers") || lower.startsWith("electric-")) {
                responseHeaders.addAll(headerName, headerValues);
            }
        });

        return new ResponseEntity<>(rawList, responseHeaders, HttpStatus.OK);
    }

    private URI buildTodoListUri(UriBuilder builder, Map<String, String[]> params, Long userId) {
        builder.path("/")
                .queryParam(ElectricProtocol.TABLE_QUERY_PARAM, "todo")
                .queryParam(ElectricProtocol.WHERE_QUERY_PARAM, "owner_id = $1")
                .queryParam("params[1]", userId);

        var protocolParams = params.entrySet().stream()
                .filter(e -> ElectricProtocol.ELECTRIC_PROTOCOL_QUERY_PARAMS.contains(e.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, e -> List.of(e.getValue())));

        builder.queryParams(CollectionUtils.toMultiValueMap(protocolParams));

        return builder.build();
    }

}
