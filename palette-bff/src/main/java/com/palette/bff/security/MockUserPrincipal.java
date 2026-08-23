package com.palette.bff.security;

import java.util.List;

public record MockUserPrincipal(
        String userId,
        String username,
        String displayName,
        String email,
        List<String> permissions
) {
}
