package com.palette.bff.platform.context;

import com.palette.bff.platform.observability.MdcSupport;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Establishes request/correlation IDs for tracing. Client headers are accepted for
 * correlation only — they are never treated as authentication proof.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class PaletteRequestContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestId = firstNonBlank(
                request.getHeader(RequestContext.HEADER_REQUEST_ID),
                UUID.randomUUID().toString());
        String correlationId = firstNonBlank(
                request.getHeader(RequestContext.HEADER_CORRELATION_ID),
                requestId);
        String traceId = firstNonBlank(
                request.getHeader(RequestContext.HEADER_TRACE_ID),
                correlationId);

        RequestContext context = new RequestContext(
                requestId,
                correlationId,
                traceId,
                blankToNull(request.getHeader(RequestContext.HEADER_CONSUMER_ID)),
                blankToNull(request.getHeader(RequestContext.HEADER_APPLICATION_ID)));

        RequestContextHolder.set(context);
        MdcSupport.apply(context);

        response.setHeader(RequestContext.HEADER_REQUEST_ID, requestId);
        response.setHeader(RequestContext.HEADER_CORRELATION_ID, correlationId);
        response.setHeader(RequestContext.HEADER_TRACE_ID, traceId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MdcSupport.clear();
            RequestContextHolder.clear();
        }
    }

    private static String firstNonBlank(String primary, String fallback) {
        String value = blankToNull(primary);
        return value != null ? value : fallback;
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
