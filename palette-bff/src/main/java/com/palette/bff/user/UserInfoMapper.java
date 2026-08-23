package com.palette.bff.user;

import com.palette.bff.security.MockUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserInfoMapper {

    public UserInfo fromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof MockUserPrincipal mockUser) {
            return new UserInfo(
                    mockUser.userId(),
                    mockUser.username(),
                    mockUser.displayName(),
                    mockUser.email(),
                    mockUser.permissions()
            );
        }

        if (principal instanceof OidcUser oidcUser) {
            return new UserInfo(
                    oidcUser.getSubject(),
                    oidcUser.getPreferredUsername(),
                    oidcUser.getFullName(),
                    oidcUser.getEmail(),
                    extractPermissions(authentication)
            );
        }

        return new UserInfo(
                authentication.getName(),
                authentication.getName(),
                authentication.getName(),
                null,
                extractPermissions(authentication)
        );
    }

    private List<String> extractPermissions(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> !authority.startsWith("ROLE_"))
                .filter(authority -> !authority.startsWith("SCOPE_"))
                .toList();
    }
}
