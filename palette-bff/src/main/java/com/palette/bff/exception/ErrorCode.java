package com.palette.bff.exception;

public enum ErrorCode {
    AUTH_REQUIRED("UNAUTHENTICATED", "Authentication required"),
    AUTH_TOKEN_EXPIRED("UNAUTHENTICATED", "Access token has expired"),
    AUTH_TOKEN_UNAVAILABLE("UNAUTHENTICATED", "Access token is not available"),
    FORBIDDEN("FORBIDDEN", "Access denied"),
    NOT_FOUND("NOT_FOUND", "Resource not found"),
    CONFLICT("CONFLICT", "Resource conflict"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
    RATE_LIMITED("RATE_LIMITED", "Rate limit exceeded"),
    DOWNSTREAM_TIMEOUT("DOWNSTREAM_TIMEOUT", "Downstream service timed out"),
    DOWNSTREAM_UNAVAILABLE("DOWNSTREAM_UNAVAILABLE", "Downstream service unavailable"),
    PROXY_ERROR("DOWNSTREAM_UNAVAILABLE", "Failed to proxy request to downstream service"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
