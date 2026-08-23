package com.palette.bff.security;

import com.palette.bff.configuration.PaletteProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.stream.Collectors;

@Component
@ConditionalOnProperty(name = "palette.auth.mode", havingValue = "mock")
public class MockAuthenticationFilter extends OncePerRequestFilter {

    private final PaletteProperties paletteProperties;

    public MockAuthenticationFilter(PaletteProperties paletteProperties) {
        this.paletteProperties = paletteProperties;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            PaletteProperties.Auth.Mock mock = paletteProperties.getAuth().getMock();
            var authorities = mock.getPermissions().stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            var principal = new MockUserPrincipal(
                    mock.getUserId(),
                    mock.getUsername(),
                    mock.getDisplayName(),
                    mock.getEmail(),
                    mock.getPermissions()
            );

            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(principal, null, authorities)
            );
        }

        filterChain.doFilter(request, response);
    }
}
