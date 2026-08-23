package com.palette.bff.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI paletteOpenAPI() {
        final String sessionCookieScheme = "sessionCookie";

        return new OpenAPI()
                .info(new Info()
                        .title("Palette BFF API")
                        .description("""
                                Palette Enterprise BFF REST API documentation.

                                Authentication uses the `PALETTE_SESSION` session cookie set by the BFF after OIDC login.
                                In mock mode (`palette.auth.mode=mock`), requests are auto-authenticated for local development.
                                """)
                        .version("0.7.0")
                        .contact(new Contact().name("Palette Platform Team")))
                .addSecurityItem(new SecurityRequirement().addList(sessionCookieScheme))
                .components(new Components()
                        .addSecuritySchemes(sessionCookieScheme, new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name("PALETTE_SESSION")
                                .description("BFF session cookie")));
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("auth")
                .displayName("Authentication")
                .pathsToMatch("/api/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi demoApi() {
        return GroupedOpenApi.builder()
                .group("demo")
                .displayName("Demo Business API")
                .pathsToMatch(
                        "/api/dashboard/**",
                        "/api/trades",
                        "/api/trades/**",
                        "/api/settlements",
                        "/api/settlements/**",
                        "/api/reports/**")
                .build();
    }
}
