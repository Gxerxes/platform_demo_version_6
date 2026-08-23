package com.palette.bff.user;

import java.util.List;

public record UserInfo(
        String userId,
        String username,
        String displayName,
        String email,
        List<String> permissions
) {
}
