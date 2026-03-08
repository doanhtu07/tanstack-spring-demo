package com.tudope.openapi_server.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration(proxyBeanMethods = false)
public class WebConfig {

    @Bean
    public RestClient electricRestClient(@Value("${electric.url}") String electricUrl) {
        /*
            How Electric's Long Polling Works
            - The Request: Your client (via your Java proxy) sends a GET request to Electric.
            - The "Hold": If there are no new changes in the database, Electric does not respond. It holds your request open and keeps the connection "hanging."
            - The Trigger: The moment a change happens in your PostgreSQL database, Electric wakes up, finishes the response with the new data, and sends it back instantly.
            - The Loop: As soon as your client receives that data, it immediately opens a new request to wait for the next change.
        */

        /*
            Set live=true to switch Electric into live mode.
            Make sure your request timeout is higher than the server timeout (which defaults to 20s)
            => We want our server to allow 30s timeout
        */
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory();
        factory.setReadTimeout(Duration.ofSeconds(30));

        return RestClient.builder()
                .baseUrl(electricUrl + "/v1/shape")
                .requestFactory(factory)
                .build();
    }

}
