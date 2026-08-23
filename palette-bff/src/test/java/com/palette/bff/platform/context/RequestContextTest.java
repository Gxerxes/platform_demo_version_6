package com.palette.bff.platform.context;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class RequestContextTest {

    @Test
    void exposesTracingMetadata() {
        RequestContext context = new RequestContext(
                "req-1",
                "corr-1",
                "trace-1",
                "consumer-1",
                "app-1");

        assertEquals("req-1", context.requestId());
        assertEquals("corr-1", context.correlationId());
        assertEquals("consumer-1", context.consumerId().orElseThrow());
    }

    @Test
    void holderStoresContextPerThread() {
        RequestContext context = new RequestContext("req", "corr", "trace", null, null);
        RequestContextHolder.set(context);
        assertNotNull(RequestContextHolder.get());
        RequestContextHolder.clear();
    }
}
