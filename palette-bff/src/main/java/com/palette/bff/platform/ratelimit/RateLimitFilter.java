package com.palette.bff.platform.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.palette.bff.exception.ErrorCode;
import com.palette.bff.exception.ErrorResponse;
import com.palette.bff.exception.PaletteException;
import com.palette.bff.platform.audit.AuditEventType;
import com.palette.bff.platform.audit.AuditService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public RateLimitFilter(
            RateLimitService rateLimitService,
            AuditService auditService,
            ObjectMapper objectMapper) {
        this.rateLimitService = rateLimitService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/actuator")
                || request.getRequestURI().startsWith("/swagger-ui")
                || request.getRequestURI().startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            rateLimitService.check(resolvePolicyKey(request));
            filterChain.doFilter(request, response);
        } catch (PaletteException ex) {
            auditService.record(
                    AuditEventType.RATE_LIMIT_EXCEEDED,
                    "anonymous",
                    request.getMethod(),
                    request.getRequestURI(),
                    "DENIED",
                    null);
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(
                    response.getOutputStream(),
                    ErrorResponse.of(ErrorCode.RATE_LIMITED, ex.getMessage(), request.getRequestURI()));
        }
    }

    private String resolvePolicyKey(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.contains("/reports")) {
            return "reporting";
        }
        return "default";
    }
}
