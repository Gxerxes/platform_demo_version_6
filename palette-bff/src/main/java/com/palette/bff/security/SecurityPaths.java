package com.palette.bff.security;

public final class SecurityPaths {

    public static final String[] PUBLIC_ENDPOINTS = {
            "/actuator/health",
            "/actuator/info",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
    };

    private SecurityPaths() {
    }
}
