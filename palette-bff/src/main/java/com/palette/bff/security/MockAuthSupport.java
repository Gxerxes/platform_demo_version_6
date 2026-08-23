package com.palette.bff.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Tracks explicit logout in mock mode so the auto-authentication filter does not
 * immediately re-authenticate the user on the next request.
 */
public final class MockAuthSupport {

    public static final String LOGGED_OUT_COOKIE = "PALETTE_MOCK_LOGGED_OUT";

    private MockAuthSupport() {
    }

    public static boolean isLoggedOut(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return false;
        }
        for (Cookie cookie : cookies) {
            if (LOGGED_OUT_COOKIE.equals(cookie.getName()) && "true".equals(cookie.getValue())) {
                return true;
            }
        }
        return false;
    }

    public static void markLoggedOut(HttpServletResponse response) {
        Cookie cookie = new Cookie(LOGGED_OUT_COOKIE, "true");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(-1);
        response.addCookie(cookie);
    }

    public static void clearLoggedOut(HttpServletResponse response) {
        Cookie cookie = new Cookie(LOGGED_OUT_COOKIE, "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
