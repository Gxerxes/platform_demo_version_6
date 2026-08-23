package com.palette.bff.platform.audit;

import com.palette.bff.platform.context.RequestContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

/**
 * Structured audit logging separated from application logs.
 * Future integration: enterprise SIEM / audit store.
 */
@Service
public class AuditService {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");

    public void record(
            AuditEventType eventType,
            String actor,
            String action,
            String resource,
            String result,
            Map<String, Object> metadata) {

        String requestId = null;
        String correlationId = null;
        String consumerId = null;
        var context = RequestContextHolder.get();
        if (context != null) {
            requestId = context.requestId();
            correlationId = context.correlationId();
            consumerId = context.consumerId().orElse(null);
        }

        AuditEvent event = new AuditEvent(
                Instant.now(),
                eventType,
                actor,
                consumerId,
                action,
                resource,
                result,
                requestId,
                correlationId,
                metadata == null ? Map.of() : Map.copyOf(metadata));

        auditLog.info(
                "eventType={} actor={} consumerId={} action={} resource={} result={} requestId={} correlationId={}",
                event.eventType(),
                event.actor(),
                event.consumerId(),
                event.action(),
                event.resource(),
                event.result(),
                event.requestId(),
                event.correlationId());
    }
}
