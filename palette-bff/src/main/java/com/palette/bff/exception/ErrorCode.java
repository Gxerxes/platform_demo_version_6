package com.palette.bff.exception;

public enum ErrorCode {
    AUTH_REQUIRED("AUTH_REQUIRED", "Authentication required"),
    AUTH_TOKEN_EXPIRED("AUTH_TOKEN_EXPIRED", "Access token has expired"),
    AUTH_TOKEN_UNAVAILABLE("AUTH_TOKEN_UNAVAILABLE", "Access token is not available"),
    FORBIDDEN("FORBIDDEN", "Access denied"),
    NOT_FOUND("NOT_FOUND", "Resource not found"),
    PROXY_ERROR("PROXY_ERROR", "Failed to proxy request to downstream service"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
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
