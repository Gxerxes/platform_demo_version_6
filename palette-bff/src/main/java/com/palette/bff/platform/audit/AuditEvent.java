package com.palette.bff.platform.audit;

import java.time.Instant;
import java.util.Map;

public record AuditEvent(
        Instant timestamp,
        AuditEventType eventType,
        String actor,
        String consumerId,
        String action,
        String resource,
        String result,
        String requestId,
        String correlationId,
        Map<String, Object> metadata
) {
}
