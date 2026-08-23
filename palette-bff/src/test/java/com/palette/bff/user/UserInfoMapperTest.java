package com.palette.bff.user;

import com.palette.bff.security.MockUserPrincipal;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class UserInfoMapperTest {

    private final UserInfoMapper mapper = new UserInfoMapper();

    @Test
    void mapsMockUserPrincipal() {
        MockUserPrincipal principal = new MockUserPrincipal(
                "user-1", "john", "John Doe", "john@example.com", List.of("dashboard:view")
        );
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, List.of());

        UserInfo userInfo = mapper.fromAuthentication(authentication);

        assertThat(userInfo.userId()).isEqualTo("user-1");
        assertThat(userInfo.username()).isEqualTo("john");
        assertThat(userInfo.permissions()).containsExactly("dashboard:view");
    }

    @Test
    void mapsOidcUser() {
        OidcIdToken idToken = new OidcIdToken(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("sub", "oidc-1")
        );
        OidcUserInfo oidcUserInfo = new OidcUserInfo(Map.of(
                "sub", "oidc-1",
                "preferred_username", "preferred_username",
                "name", "name",
                "email", "email"
        ));
        DefaultOidcUser oidcUser = new DefaultOidcUser(List.of(), idToken, oidcUserInfo);
        var authentication = new UsernamePasswordAuthenticationToken(oidcUser, null, List.of());

        UserInfo mapped = mapper.fromAuthentication(authentication);

        assertThat(mapped.userId()).isEqualTo("oidc-1");
        assertThat(mapped.username()).isEqualTo("preferred_username");
    }
}
