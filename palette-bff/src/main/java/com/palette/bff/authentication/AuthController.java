package com.palette.bff.authentication;

import com.palette.bff.authentication.session.SessionInfo;
import com.palette.bff.authentication.session.SessionService;
import com.palette.bff.authentication.token.TokenService;
import com.palette.bff.configuration.PaletteProperties;
import com.palette.bff.user.UserInfo;
import com.palette.bff.user.UserInfoMapper;
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
@RequestMapping("/api/auth")
public class AuthController {

    private final PaletteProperties paletteProperties;
    private final UserInfoMapper userInfoMapper;
    private final SessionService sessionService;
    private final ObjectProvider<TokenService> tokenServiceProvider;

    public AuthController(
            PaletteProperties paletteProperties,
            UserInfoMapper userInfoMapper,
            SessionService sessionService,
            ObjectProvider<TokenService> tokenServiceProvider) {
        this.paletteProperties = paletteProperties;
        this.userInfoMapper = userInfoMapper;
        this.sessionService = sessionService;
        this.tokenServiceProvider = tokenServiceProvider;
    }

    @GetMapping("/login")
    public ResponseEntity<?> login(HttpServletResponse response) throws IOException {
        if ("mock".equalsIgnoreCase(paletteProperties.getAuth().getMode())) {
            return ResponseEntity.ok(Map.of(
                    "message", "Mock authentication is active",
                    "redirectUrl", paletteProperties.getAuth().getLoginSuccessUrl()
            ));
        }
        response.sendRedirect("/oauth2/authorization/palette");
        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfo> user() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserInfo userInfo = userInfoMapper.fromAuthentication(authentication);
        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/session")
    public ResponseEntity<SessionInfo> session(HttpServletRequest request) {
        return ResponseEntity.ok(sessionService.getSessionInfo(request));
    }

    @GetMapping("/status")
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
