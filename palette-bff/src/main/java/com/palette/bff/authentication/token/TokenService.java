package com.palette.bff.authentication.token;

import com.palette.bff.exception.PaletteException;
import com.palette.bff.exception.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "palette.auth.mode", havingValue = "oidc", matchIfMissing = true)
public class TokenService {

    private static final String CLIENT_REGISTRATION_ID = "palette";

    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public TokenService(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public TokenInfo getTokenInfo(Authentication authentication) {
        OAuth2AuthorizedClient client = authorizeClient(authentication);
        OAuth2AccessToken accessToken = client.getAccessToken();
        OAuth2RefreshToken refreshToken = client.getRefreshToken();

        return new TokenInfo(
                accessToken.getTokenValue(),
                accessToken.getTokenType().getValue(),
                accessToken.getExpiresAt(),
                refreshToken != null,
                refreshToken != null ? refreshToken.getExpiresAt() : null
        );
    }

    public String getAccessToken(Authentication authentication) {
        return authorizeClient(authentication).getAccessToken().getTokenValue();
    }

    private OAuth2AuthorizedClient authorizeClient(Authentication authentication) {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId(CLIENT_REGISTRATION_ID)
                .principal(authentication)
                .build();

        OAuth2AuthorizedClient client = authorizedClientManager.authorize(authorizeRequest);
        if (client == null || client.getAccessToken() == null) {
            throw new PaletteException(ErrorCode.AUTH_TOKEN_UNAVAILABLE, "Access token is not available");
        }

        OAuth2AccessToken accessToken = client.getAccessToken();
        if (accessToken.getExpiresAt() != null && accessToken.getExpiresAt().isBefore(Instant.now())) {
            throw new PaletteException(ErrorCode.AUTH_TOKEN_EXPIRED, "Access token has expired");
        }

        return client;
    }

    public record TokenInfo(
            String accessToken,
            String tokenType,
            Instant expiresAt,
            boolean hasRefreshToken,
            Optional<Instant> refreshTokenExpiresAt
    ) {
        public TokenInfo(
                String accessToken,
                String tokenType,
                Instant expiresAt,
                boolean hasRefreshToken,
                Instant refreshTokenExpiresAt) {
            this(accessToken, tokenType, expiresAt, hasRefreshToken, Optional.ofNullable(refreshTokenExpiresAt));
        }
    }
}
