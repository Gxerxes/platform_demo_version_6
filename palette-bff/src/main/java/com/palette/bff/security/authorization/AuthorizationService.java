package com.palette.bff.security.authorization;

import com.palette.bff.user.UserInfo;
import com.palette.bff.user.UserInfoMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service("authorizationService")
public class AuthorizationService {

    private final UserInfoMapper userInfoMapper;

    public AuthorizationService(UserInfoMapper userInfoMapper) {
        this.userInfoMapper = userInfoMapper;
    }

    public boolean hasPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserInfo user = userInfoMapper.fromAuthentication(authentication);
        if (user == null) {
            return false;
        }
        return Set.copyOf(user.permissions()).contains(permission);
    }

    public boolean hasAnyPermission(String... permissions) {
        for (String permission : permissions) {
            if (hasPermission(permission)) {
                return true;
            }
        }
        return false;
    }
}
