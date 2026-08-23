package com.palette.bff.security.authorization;

import com.palette.bff.security.MockUserPrincipal;
import com.palette.bff.user.UserInfoMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthorizationServiceTest {

    private final AuthorizationService authorizationService = new AuthorizationService(new UserInfoMapper());

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void grantsPermissionWhenPresent() {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new MockUserPrincipal("u1", "demo", "Demo", "demo@palette.local", List.of("trades:view")),
                null,
                List.of()));

        assertTrue(authorizationService.hasPermission("trades:view"));
        assertFalse(authorizationService.hasPermission("admin:view"));
    }
}
