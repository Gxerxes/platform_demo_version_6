package com.palette.bff.exception;

import com.palette.bff.platform.audit.AuditEventType;
import com.palette.bff.platform.audit.AuditService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final AuditService auditService;

    public GlobalExceptionHandler(AuditService auditService) {
        this.auditService = auditService;
    }

    @ExceptionHandler(PaletteException.class)
    public ResponseEntity<ErrorResponse> handlePaletteException(PaletteException ex, HttpServletRequest request) {
        HttpStatus status = mapStatus(ex.getErrorCode());
        return ResponseEntity.status(status).body(
                ErrorResponse.of(ex.getErrorCode(), ex.getMessage(), request.getRequestURI())
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        auditService.record(
                AuditEventType.AUTHENTICATION_FAILURE,
                "anonymous",
                "AUTHENTICATE",
                request.getRequestURI(),
                "FAILURE",
                null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ErrorResponse.of(ErrorCode.AUTH_REQUIRED, "Authentication required", request.getRequestURI())
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        auditService.record(
                AuditEventType.AUTHORIZATION_DENIED,
                "authenticated-user",
                "ACCESS",
                request.getRequestURI(),
                "DENIED",
                null);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ErrorResponse.of(ErrorCode.FORBIDDEN, "Access denied", request.getRequestURI())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse.of(ErrorCode.VALIDATION_ERROR, "Validation failed", request.getRequestURI())
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoResourceFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse.of(ErrorCode.NOT_FOUND, "Resource not found", request.getRequestURI())
        );
    }

    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<ErrorResponse> handleRestClientException(
            RestClientResponseException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(
                ErrorResponse.of(ErrorCode.PROXY_ERROR, "Downstream service error", request.getRequestURI())
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ErrorResponse.of(ErrorCode.INTERNAL_ERROR, "Internal server error", request.getRequestURI())
        );
    }

    private HttpStatus mapStatus(ErrorCode errorCode) {
        return switch (errorCode) {
            case AUTH_REQUIRED, AUTH_TOKEN_EXPIRED, AUTH_TOKEN_UNAVAILABLE -> HttpStatus.UNAUTHORIZED;
            case FORBIDDEN -> HttpStatus.FORBIDDEN;
            case NOT_FOUND -> HttpStatus.NOT_FOUND;
            case CONFLICT -> HttpStatus.CONFLICT;
            case VALIDATION_ERROR -> HttpStatus.BAD_REQUEST;
            case RATE_LIMITED -> HttpStatus.TOO_MANY_REQUESTS;
            case DOWNSTREAM_TIMEOUT -> HttpStatus.GATEWAY_TIMEOUT;
            case DOWNSTREAM_UNAVAILABLE, PROXY_ERROR -> HttpStatus.BAD_GATEWAY;
            case INTERNAL_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}
