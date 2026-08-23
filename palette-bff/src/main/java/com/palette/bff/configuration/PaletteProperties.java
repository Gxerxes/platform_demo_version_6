package com.palette.bff.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "palette")
public class PaletteProperties {

    private final Auth auth = new Auth();
    private final Cors cors = new Cors();
    private final Proxy proxy = new Proxy();

    public Auth getAuth() {
        return auth;
    }

    public Cors getCors() {
        return cors;
    }

    public Proxy getProxy() {
        return proxy;
    }

    public static class Auth {
        /** oidc | mock */
        private String mode = "oidc";
        private String loginSuccessUrl = "http://localhost:3000";
        private String logoutSuccessUrl = "http://localhost:3000";
        private final Mock mock = new Mock();

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

        public static class Mock {
            private String userId = "demo-user";
            private String username = "demo";
            private String displayName = "Demo User";
            private String email = "demo@palette.local";
            private List<String> permissions = new ArrayList<>(List.of(
                    "dashboard:view", "components:view", "table:view", "settings:view", "admin:view"
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
}
