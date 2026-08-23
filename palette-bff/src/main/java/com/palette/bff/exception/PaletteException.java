package com.palette.bff.exception;

public class PaletteException extends RuntimeException {

    private final ErrorCode errorCode;

    public PaletteException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public PaletteException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public PaletteException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
