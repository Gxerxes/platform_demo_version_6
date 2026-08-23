package com.palette.bff.platform.audit;

public enum AuditEventType {
    LOGIN,
    LOGOUT,
    AUTHENTICATION_FAILURE,
    AUTHORIZATION_DENIED,
    SENSITIVE_API_ACCESS,
    RATE_LIMIT_EXCEEDED,
    CONFIGURATION_CHANGE
}
