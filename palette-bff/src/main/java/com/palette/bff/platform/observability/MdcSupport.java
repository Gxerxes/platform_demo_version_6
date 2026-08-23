package com.palette.bff.platform.observability;

import com.palette.bff.platform.context.RequestContext;
import org.slf4j.MDC;

public final class MdcSupport {

    public static final String REQUEST_ID = "requestId";
    public static final String CORRELATION_ID = "correlationId";
    public static final String TRACE_ID = "traceId";
    public static final String CONSUMER_ID = "consumerId";
    public static final String APPLICATION_ID = "applicationId";

    private MdcSupport() {
    }

    public static void apply(RequestContext context) {
        MDC.put(REQUEST_ID, context.requestId());
        MDC.put(CORRELATION_ID, context.correlationId());
        MDC.put(TRACE_ID, context.traceId());
        context.consumerId().ifPresent(value -> MDC.put(CONSUMER_ID, value));
        context.applicationId().ifPresent(value -> MDC.put(APPLICATION_ID, value));
    }

    public static void clear() {
        MDC.remove(REQUEST_ID);
        MDC.remove(CORRELATION_ID);
        MDC.remove(TRACE_ID);
        MDC.remove(CONSUMER_ID);
        MDC.remove(APPLICATION_ID);
    }
}
