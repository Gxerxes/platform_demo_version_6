package com.palette.bff.platform.resilience;

import com.palette.bff.configuration.PaletteProperties;
import com.palette.bff.exception.ErrorCode;
import com.palette.bff.exception.PaletteException;
import com.palette.bff.platform.context.RequestContext;
import com.palette.bff.platform.context.RequestContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.SocketTimeoutException;
import java.time.Duration;
import java.util.Map;

@Service
public class DownstreamProxyService {

    private final PaletteProperties properties;
    private final RestClient restClient;

    public DownstreamProxyService(PaletteProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder()
                .requestFactory(createRequestFactory())
                .build();
    }

    public ResponseEntity<String> forward(
            HttpMethod method,
            String targetUrl,
            HttpHeaders headers,
            String body) {

        PaletteProperties.Downstream.ServiceConfig serviceConfig = resolveServiceConfig(targetUrl);
        int maxAttempts = method == HttpMethod.GET && serviceConfig.getRetry().isEnabled()
                ? serviceConfig.getRetry().getMaxAttempts()
                : 1;

        RuntimeException lastFailure = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return execute(method, targetUrl, headers, body);
            } catch (ResourceAccessException ex) {
                lastFailure = ex;
                if (isTimeout(ex)) {
                    throw new PaletteException(ErrorCode.DOWNSTREAM_TIMEOUT, "Downstream service timed out", ex);
                }
                if (attempt == maxAttempts) {
                    throw new PaletteException(ErrorCode.DOWNSTREAM_UNAVAILABLE, "Downstream service unavailable", ex);
                }
            } catch (RestClientResponseException ex) {
                return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
            }
        }

        throw new PaletteException(
                ErrorCode.DOWNSTREAM_UNAVAILABLE,
                "Downstream service unavailable",
                lastFailure);
    }

    private ResponseEntity<String> execute(
            HttpMethod method,
            String targetUrl,
            HttpHeaders headers,
            String body) {

        propagateContextHeaders(headers);

        RestClient.RequestBodySpec spec = restClient.method(method)
                .uri(targetUrl)
                .headers(httpHeaders -> {
                    httpHeaders.clear();
                    httpHeaders.addAll(headers);
                });

        ResponseEntity<String> response = (body != null && !body.isBlank())
                ? spec.body(body).retrieve().toEntity(String.class)
                : spec.retrieve().toEntity(String.class);

        return ResponseEntity.status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }

    private void propagateContextHeaders(HttpHeaders headers) {
        RequestContext context = RequestContextHolder.get();
        if (context == null) {
            return;
        }
        headers.set(RequestContext.HEADER_REQUEST_ID, context.requestId());
        headers.set(RequestContext.HEADER_CORRELATION_ID, context.correlationId());
        headers.set(RequestContext.HEADER_TRACE_ID, context.traceId());
        context.consumerId().ifPresent(value -> headers.set(RequestContext.HEADER_CONSUMER_ID, value));
        context.applicationId().ifPresent(value -> headers.set(RequestContext.HEADER_APPLICATION_ID, value));
    }

    private PaletteProperties.Downstream.ServiceConfig resolveServiceConfig(String targetUrl) {
        Map<String, PaletteProperties.Downstream.ServiceConfig> services = properties.getDownstream().getServices();
        return services.values().stream()
                .filter(config -> targetUrl.startsWith(config.getBaseUrl()))
                .findFirst()
                .orElse(properties.getDownstream().getDefaultConfig());
    }

    private SimpleClientHttpRequestFactory createRequestFactory() {
        PaletteProperties.Downstream.ServiceConfig config = properties.getDownstream().getDefaultConfig();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(config.getConnectTimeout());
        factory.setReadTimeout(config.getReadTimeout());
        return factory;
    }

    private boolean isTimeout(ResourceAccessException ex) {
        Throwable cause = ex.getCause();
        return cause instanceof SocketTimeoutException;
    }
}
