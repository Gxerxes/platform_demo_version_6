package com.palette.bff.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ConfigurationProperties(prefix = "palette")
public class PaletteProperties {

    private final Auth auth = new Auth();
    private final Cors cors = new Cors();
    private final Proxy proxy = new Proxy();
    private final Session session = new Session();
    private final RateLimit rateLimit = new RateLimit();
    private final Downstream downstream = new Downstream();
    private final Security security = new Security();

    public Auth getAuth() {
        return auth;
    }

    public Cors getCors() {
        return cors;
    }

    public Proxy getProxy() {
        return proxy;
    }

    public Session getSession() {
        return session;
    }

    public RateLimit getRateLimit() {
        return rateLimit;
    }

    public Downstream getDownstream() {
        return downstream;
    }

    public Security getSecurity() {
        return security;
    }

    public static class Auth {
        /** oidc | mock */
        private String mode = "oidc";
        private String loginSuccessUrl = "http://localhost:3000";
        private String logoutSuccessUrl = "http://localhost:3000";
        private final Mock mock = new Mock();
        private final Machine machine = new Machine();

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public String getLoginSuccessUrl() {
            return loginSuccessUrl;
        }

        public void setLoginSuccessUrl(String loginSuccessUrl) {
            this.loginSuccessUrl = loginSuccessUrl;
        }

        public String getLogoutSuccessUrl() {
            return logoutSuccessUrl;
        }

        public void setLogoutSuccessUrl(String logoutSuccessUrl) {
            this.logoutSuccessUrl = logoutSuccessUrl;
        }

        public Mock getMock() {
            return mock;
        }

        public Machine getMachine() {
            return machine;
        }

        public static class Mock {
            private String userId = "demo-user";
            private String username = "demo";
            private String displayName = "Demo User";
            private String email = "demo@palette.local";
            private List<String> permissions = new ArrayList<>(List.of(
                    "dashboard:view",
                    "trades:view",
                    "trades:create",
                    "reports:view",
                    "settlements:view",
                    "admin:view",
                    "components:view",
                    "table:view",
                    "settings:view"
            ));

            public String getUserId() {
                return userId;
            }

            public void setUserId(String userId) {
                this.userId = userId;
            }

            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }

            public String getDisplayName() {
                return displayName;
            }

            public void setDisplayName(String displayName) {
                this.displayName = displayName;
            }

            public String getEmail() {
                return email;
            }

            public void setEmail(String email) {
                this.email = email;
            }

            public List<String> getPermissions() {
                return permissions;
            }

            public void setPermissions(List<String> permissions) {
                this.permissions = permissions;
            }
        }

        public static class Machine {
            /** Enable JWT bearer authentication for machine/third-party consumers */
            private boolean enabled = false;
            private String issuerUri;
            private String audience = "palette-bff";

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }

            public String getIssuerUri() {
                return issuerUri;
            }

            public void setIssuerUri(String issuerUri) {
                this.issuerUri = issuerUri;
            }

            public String getAudience() {
                return audience;
            }

            public void setAudience(String audience) {
                this.audience = audience;
            }
        }
    }

    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>(List.of("http://localhost:3000"));

        public List<String> getAllowedOrigins() {
            return allowedOrigins;
        }

        public void setAllowedOrigins(List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }

    public static class Proxy {
        private boolean enabled = true;
        private String baseUrl = "http://localhost:9090";

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    public static class Session {
        /** memory | redis */
        private String store = "memory";
        private boolean cookieSecure = false;

        public String getStore() {
            return store;
        }

        public void setStore(String store) {
            this.store = store;
        }

        public boolean isCookieSecure() {
            return cookieSecure;
        }

        public void setCookieSecure(boolean cookieSecure) {
            this.cookieSecure = cookieSecure;
        }
    }

    public static class RateLimit {
        private boolean enabled = false;
        private final Policy defaultPolicy = new Policy();
        private Map<String, Policy> policies = new HashMap<>();

        public RateLimit() {
            defaultPolicy.setRequestsPerMinute(100);
            policies.put("reporting", new Policy());
            policies.get("reporting").setRequestsPerMinute(20);
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public Policy getDefaultPolicy() {
            return defaultPolicy;
        }

        public Map<String, Policy> getPolicies() {
            return policies;
        }

        public void setPolicies(Map<String, Policy> policies) {
            this.policies = policies;
        }

        public static class Policy {
            private int requestsPerMinute = 100;

            public int getRequestsPerMinute() {
                return requestsPerMinute;
            }

            public void setRequestsPerMinute(int requestsPerMinute) {
                this.requestsPerMinute = requestsPerMinute;
            }
        }
    }

    public static class Downstream {
        private final ServiceConfig defaultConfig = new ServiceConfig();
        private Map<String, ServiceConfig> services = new HashMap<>();

        public ServiceConfig getDefaultConfig() {
            return defaultConfig;
        }

        public Map<String, ServiceConfig> getServices() {
            return services;
        }

        public void setServices(Map<String, ServiceConfig> services) {
            this.services = services;
        }

        public static class ServiceConfig {
            private String baseUrl = "http://localhost:9090";
            private Duration connectTimeout = Duration.ofSeconds(3);
            private Duration readTimeout = Duration.ofSeconds(5);
            private final Retry retry = new Retry();

            public String getBaseUrl() {
                return baseUrl;
            }

            public void setBaseUrl(String baseUrl) {
                this.baseUrl = baseUrl;
            }

            public Duration getConnectTimeout() {
                return connectTimeout;
            }

            public void setConnectTimeout(Duration connectTimeout) {
                this.connectTimeout = connectTimeout;
            }

            public Duration getReadTimeout() {
                return readTimeout;
            }

            public void setReadTimeout(Duration readTimeout) {
                this.readTimeout = readTimeout;
            }

            public Retry getRetry() {
                return retry;
            }

            public static class Retry {
                private boolean enabled = true;
                private int maxAttempts = 2;

                public boolean isEnabled() {
                    return enabled;
                }

                public void setEnabled(boolean enabled) {
                    this.enabled = enabled;
                }

                public int getMaxAttempts() {
                    return maxAttempts;
                }

                public void setMaxAttempts(int maxAttempts) {
                    this.maxAttempts = maxAttempts;
                }
            }
        }
    }

    public static class Security {
        private boolean failFastOnMisconfiguration = true;

        public boolean isFailFastOnMisconfiguration() {
            return failFastOnMisconfiguration;
        }

        public void setFailFastOnMisconfiguration(boolean failFastOnMisconfiguration) {
            this.failFastOnMisconfiguration = failFastOnMisconfiguration;
        }
    }
}
