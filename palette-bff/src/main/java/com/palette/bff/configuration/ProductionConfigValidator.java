package com.palette.bff.configuration;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class ProductionConfigValidator implements ApplicationListener<ApplicationReadyEvent> {

    private final PaletteProperties properties;
    private final Environment environment;

    public ProductionConfigValidator(PaletteProperties properties, Environment environment) {
        this.properties = properties;
        this.environment = environment;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (!properties.getSecurity().isFailFastOnMisconfiguration()) {
            return;
        }

        if ("mock".equalsIgnoreCase(properties.getAuth().getMode())) {
            throw new IllegalStateException("palette.auth.mode=mock is not allowed in prod profile");
        }

        if (properties.getCors().getAllowedOrigins().isEmpty()) {
            throw new IllegalStateException("palette.cors.allowed-origins must be configured in prod");
        }

        String clientSecret = environment.getProperty("spring.security.oauth2.client.registration.palette.client-secret");
        if (clientSecret == null || clientSecret.isBlank() || "change-me".equals(clientSecret)) {
            throw new IllegalStateException("OIDC client secret must be configured for prod");
        }

        if ("memory".equalsIgnoreCase(properties.getSession().getStore())) {
            throw new IllegalStateException("palette.session.store must be redis in prod");
        }
    }
}
