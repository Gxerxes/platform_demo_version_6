package com.palette.bff.authentication;

import com.palette.bff.api.ApiPaths;
import com.palette.bff.authentication.session.SessionInfo;
import com.palette.bff.authentication.session.SessionService;
import com.palette.bff.authentication.token.TokenService;
import com.palette.bff.configuration.PaletteProperties;
import com.palette.bff.platform.audit.AuditEventType;
import com.palette.bff.platform.audit.AuditService;
import com.palette.bff.user.UserInfo;
import com.palette.bff.user.UserInfoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping({ApiPaths.LEGACY_AUTH, ApiPaths.V1_AUTH})
@Tag(name = "Authentication", description = "BFF login, logout, user and session APIs")
public class AuthController {

    private final PaletteProperties paletteProperties;
    private final UserInfoMapper userInfoMapper;
    private final SessionService sessionService;
    private final ObjectProvider<TokenService> tokenServiceProvider;
    private final AuditService auditService;

    public AuthController(
            PaletteProperties paletteProperties,
            UserInfoMapper userInfoMapper,
            SessionService sessionService,
            ObjectProvider<TokenService> tokenServiceProvider,
            AuditService auditService) {
        this.paletteProperties = paletteProperties;
        this.userInfoMapper = userInfoMapper;
        this.sessionService = sessionService;
        this.tokenServiceProvider = tokenServiceProvider;
        this.auditService = auditService;
    }

    @GetMapping("/login")
    @Operation(summary = "Initiate login", description = "Redirects to OIDC provider, or returns mock login info in local mode")
    @ApiResponse(responseCode = "200", description = "Mock mode response")
    @ApiResponse(responseCode = "302", description = "OIDC redirect")
    public ResponseEntity<?> login(HttpServletResponse response) throws IOException {
        if ("mock".equalsIgnoreCase(paletteProperties.getAuth().getMode())) {
            auditService.record(AuditEventType.LOGIN, "mock-user", "LOGIN", "/auth/login", "SUCCESS", null);
            return ResponseEntity.ok(Map.of(
                    "message", "Mock authentication is active",
                    "redirectUrl", paletteProperties.getAuth().getLoginSuccessUrl()
            ));
        }
        response.sendRedirect("/oauth2/authorization/palette");
        return null;
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidates the current BFF session")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String actor = authentication != null ? authentication.getName() : "anonymous";
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
        auditService.record(AuditEventType.LOGOUT, actor, "LOGOUT", "/auth/logout", "SUCCESS", null);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/user")
    @Operation(summary = "Get current user", description = "Returns authenticated user profile and permissions")
    public ResponseEntity<UserInfo> user() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserInfo userInfo = userInfoMapper.fromAuthentication(authentication);
        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/session")
    @Operation(summary = "Get session info", description = "Returns session authentication state and expiry")
    public ResponseEntity<SessionInfo> session(HttpServletRequest request) {
        return ResponseEntity.ok(sessionService.getSessionInfo(request));
    }

    @GetMapping("/status")
    @Operation(summary = "Get auth status", description = "Returns user, session and token metadata in a single payload")
    public ResponseEntity<Map<String, Object>> status(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserInfo userInfo = userInfoMapper.fromAuthentication(authentication);
        SessionInfo sessionInfo = sessionService.getSessionInfo(request);

        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("authenticated", userInfo != null);
        body.put("user", userInfo);
        body.put("session", sessionInfo);

        TokenService tokenService = tokenServiceProvider.getIfAvailable();
        if (tokenService != null && authentication != null && authentication.isAuthenticated()) {
            try {
                TokenService.TokenInfo tokenInfo = tokenService.getTokenInfo(authentication);
                body.put("token", Map.of(
                        "tokenType", tokenInfo.tokenType(),
                        "expiresAt", tokenInfo.expiresAt(),
                        "hasRefreshToken", tokenInfo.hasRefreshToken()
                ));
            } catch (RuntimeException ignored) {
                body.put("token", null);
            }
        }

        return ResponseEntity.ok(body);
    }
}
