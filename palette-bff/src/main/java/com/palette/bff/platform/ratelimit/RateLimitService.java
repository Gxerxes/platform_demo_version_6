package com.palette.bff.platform.ratelimit;

import com.palette.bff.configuration.PaletteProperties;
import com.palette.bff.exception.ErrorCode;
import com.palette.bff.exception.PaletteException;
import com.palette.bff.platform.context.RequestContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory rate limiter for single-instance / local development.
 * Replace with Redis-backed implementation for horizontally scaled production.
 */
@Service
public class RateLimitService {

    private final PaletteProperties properties;
    private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

    public RateLimitService(PaletteProperties properties) {
        this.properties = properties;
    }

    public void check(String endpointKey) {
        if (!properties.getRateLimit().isEnabled()) {
            return;
        }

        String identity = resolveIdentity();
        String bucketKey = identity + ":" + endpointKey;
        int limit = resolveLimit(endpointKey);
        long windowSeconds = 60;

        WindowCounter counter = counters.computeIfAbsent(bucketKey, key -> new WindowCounter());
        if (!counter.tryConsume(limit, windowSeconds)) {
            throw new PaletteException(ErrorCode.RATE_LIMITED, "Rate limit exceeded");
        }
    }

    private String resolveIdentity() {
        var context = RequestContextHolder.get();
        if (context != null) {
            return context.consumerId()
                    .or(() -> context.applicationId())
                    .orElse("anonymous");
        }
        return "anonymous";
    }

    private int resolveLimit(String endpointKey) {
        Map<String, PaletteProperties.RateLimit.Policy> policies = properties.getRateLimit().getPolicies();
        if (policies.containsKey(endpointKey)) {
            return policies.get(endpointKey).getRequestsPerMinute();
        }
        return properties.getRateLimit().getDefaultPolicy().getRequestsPerMinute();
    }

    private static final class WindowCounter {
        private volatile long windowStartEpochSecond = Instant.now().getEpochSecond();
        private final AtomicInteger count = new AtomicInteger();

        synchronized boolean tryConsume(int limit, long windowSeconds) {
            long now = Instant.now().getEpochSecond();
            if (now - windowStartEpochSecond >= windowSeconds) {
                windowStartEpochSecond = now;
                count.set(0);
            }
            return count.incrementAndGet() <= limit;
        }
    }
}
