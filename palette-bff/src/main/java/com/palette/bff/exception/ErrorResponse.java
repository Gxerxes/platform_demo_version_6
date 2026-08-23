package com.palette.bff.exception;

import java.time.Instant;

public record ErrorResponse(
        String code,
        String message,
        Instant timestamp,
        String path,
        Object details
) {
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return new ErrorResponse(errorCode.getCode(), message, Instant.now(), path, null);
    }

    public static ErrorResponse of(ErrorCode errorCode, String message, String path, Object details) {
        return new ErrorResponse(errorCode.getCode(), message, Instant.now(), path, details);
    }
}
