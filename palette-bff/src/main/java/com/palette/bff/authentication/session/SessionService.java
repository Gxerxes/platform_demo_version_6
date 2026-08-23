package com.palette.bff.authentication.session;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class SessionService {

    public SessionInfo getSessionInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return new SessionInfo(false, null);
        }
        long maxInactiveInterval = session.getMaxInactiveInterval();
        Instant expiresAt = Instant.ofEpochSecond(session.getLastAccessedTime() / 1000L + maxInactiveInterval);
        return new SessionInfo(true, expiresAt);
    }
}
