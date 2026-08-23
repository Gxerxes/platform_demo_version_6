package com.palette.bff.platform.context;

import java.util.Optional;

/**
 * Per-request context propagated through filters and downstream calls.
 * Security identity comes from Spring Security; this object carries tracing metadata only.
 */
public final class RequestContext {

    public static final String HEADER_REQUEST_ID = "X-Request-Id";
    public static final String HEADER_CORRELATION_ID = "X-Correlation-Id";
    public static final String HEADER_TRACE_ID = "X-Trace-Id";
    public static final String HEADER_CONSUMER_ID = "X-Consumer-Id";
    public static final String HEADER_APPLICATION_ID = "X-Application-Id";

    private final String requestId;
    private final String correlationId;
    private final String traceId;
    private final String consumerId;
    private final String applicationId;

    public RequestContext(
            String requestId,
            String correlationId,
            String traceId,
            String consumerId,
            String applicationId) {
        this.requestId = requestId;
        this.correlationId = correlationId;
        this.traceId = traceId;
        this.consumerId = consumerId;
        this.applicationId = applicationId;
    }

    public String requestId() {
        return requestId;
    }

    public String correlationId() {
        return correlationId;
    }

    public String traceId() {
        return traceId;
    }

    public Optional<String> consumerId() {
        return Optional.ofNullable(consumerId);
    }

    public Optional<String> applicationId() {
        return Optional.ofNullable(applicationId);
    }
}
