package com.palette.bff.proxy;

import com.palette.bff.api.ApiPaths;
import com.palette.bff.authentication.token.TokenService;
import com.palette.bff.configuration.PaletteProperties;
import com.palette.bff.exception.ErrorCode;
import com.palette.bff.exception.PaletteException;
import com.palette.bff.platform.resilience.DownstreamProxyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@RestController
@ConditionalOnProperty(name = "palette.proxy.enabled", havingValue = "true")
public class ProxyController {

    private static final List<String> EXCLUDED_HEADERS = List.of(
            "host", "connection", "content-length", "transfer-encoding", "cookie", "authorization"
    );

    private final PaletteProperties paletteProperties;
    private final DownstreamProxyService downstreamProxyService;
    private final ObjectProvider<TokenService> tokenServiceProvider;

    public ProxyController(
            PaletteProperties paletteProperties,
            DownstreamProxyService downstreamProxyService,
            ObjectProvider<TokenService> tokenServiceProvider) {
        this.paletteProperties = paletteProperties;
        this.downstreamProxyService = downstreamProxyService;
        this.tokenServiceProvider = tokenServiceProvider;
    }

    @RequestMapping({"/api/**", ApiPaths.V1_API + "/**"})
    public ResponseEntity<String> proxy(
            HttpServletRequest request,
            @RequestBody(required = false) String body) {

        if (!paletteProperties.getProxy().isEnabled()) {
            throw new PaletteException(ErrorCode.NOT_FOUND, "API proxy is disabled");
        }

        String path = extractDownstreamPath(request.getRequestURI());
        if (path.startsWith("/auth")) {
            throw new PaletteException(ErrorCode.NOT_FOUND, "Auth endpoints are handled by BFF");
        }

        String targetUrl = paletteProperties.getProxy().getBaseUrl() + path;
        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        HttpHeaders headers = copyHeaders(request);

        TokenService tokenService = tokenServiceProvider.getIfAvailable();
        if (tokenService != null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                headers.setBearerAuth(tokenService.getAccessToken(authentication));
            }
        }

        ResponseEntity<String> response = downstreamProxyService.forward(method, targetUrl, headers, body);
        return ResponseEntity.status(response.getStatusCode())
                .headers(filterResponseHeaders(response.getHeaders()))
                .body(response.getBody());
    }

    private String extractDownstreamPath(String requestUri) {
        if (requestUri.startsWith(ApiPaths.V1_API)) {
            return requestUri.substring(ApiPaths.V1_API.length());
        }
        if (requestUri.startsWith(ApiPaths.LEGACY_API)) {
            return requestUri.substring(ApiPaths.LEGACY_API.length());
        }
        throw new PaletteException(ErrorCode.NOT_FOUND, "Unsupported API path");
    }

    private HttpHeaders copyHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            if (EXCLUDED_HEADERS.contains(name.toLowerCase())) {
                continue;
            }
            headers.put(name, Collections.list(request.getHeaders(name)));
        }
        headers.set(HttpHeaders.ACCEPT, "application/json");
        if (request.getContentType() != null) {
            headers.set(HttpHeaders.CONTENT_TYPE, request.getContentType());
        }
        return headers;
    }

    private HttpHeaders filterResponseHeaders(HttpHeaders source) {
        HttpHeaders headers = new HttpHeaders();
        source.forEach((key, values) -> {
            if (!EXCLUDED_HEADERS.contains(key.toLowerCase())) {
                headers.put(key, values);
            }
        });
        return headers;
    }
}
