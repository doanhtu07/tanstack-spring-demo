package com.tudope.openapi_server.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.PathContainer;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.io.IOException;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExcludeSessionRepositoryFilter extends OncePerRequestFilter {

    private static final PathPatternParser pathPatternParser = new PathPatternParser();

    private static final List<PathPattern> excludePatterns = List.of(
            pathPatternParser.parse("/v3/api-docs/**"),
            pathPatternParser.parse("/swagger-ui/**"),
            pathPatternParser.parse("/swagger-ui.html"),
            pathPatternParser.parse("/actuator/**"),
            pathPatternParser.parse("/api/public/**")
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest httpRequest,
            @NonNull HttpServletResponse httpResponse,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        PathContainer pathContainer = PathContainer.parsePath(httpRequest.getRequestURI());
        boolean excluded = excludePatterns.stream().anyMatch(p -> p.matches(pathContainer));

        // Exclude certain paths from Spring Session's SessionRepositoryFilter.
        // Without this, every request triggers a SELECT on the spring_session table,
        // even for public endpoints that don't need session state.
        // See: https://github.com/spring-projects/spring-session/issues/244
        if (excluded) {
            httpRequest.setAttribute(
                    "org.springframework.session.web.http.SessionRepositoryFilter.FILTERED",
                    Boolean.TRUE
            );
        }

        filterChain.doFilter(httpRequest, httpResponse);
    }

}
