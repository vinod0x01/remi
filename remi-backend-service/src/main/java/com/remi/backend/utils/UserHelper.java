package com.remi.backend.utils;

import com.remi.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@Component
public class UserHelper {

  @Autowired
  JwtUtils jwtUtils;

  public String getUserName(HttpServletRequest request){
    String token = jwtUtils.getJwtFromCookies(request);
    String userName = jwtUtils.getUserNameFromJwtToken(token);

    return userName;
  }

}
