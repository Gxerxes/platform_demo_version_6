package com.palette.bff.authentication.session;

import java.time.Instant;

public record SessionInfo(
        boolean authenticated,
        Instant expiresAt
) {
}
