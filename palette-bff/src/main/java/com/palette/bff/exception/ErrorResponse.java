package com.palette.bff.exception;

import com.palette.bff.platform.context.RequestContextHolder;

import java.time.Instant;

public record ErrorResponse(
        String code,
        String message,
        String requestId,
        Instant timestamp,
        String path,
        Object details
) {
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return of(errorCode, message, path, null);
    }

    public static ErrorResponse of(ErrorCode errorCode, String message, String path, Object details) {
        String requestId = null;
        var context = RequestContextHolder.get();
        if (context != null) {
            requestId = context.requestId();
        }
        return new ErrorResponse(
                errorCode.getCode(),
                message,
                requestId,
                Instant.now(),
                path,
                details);
    }
}
