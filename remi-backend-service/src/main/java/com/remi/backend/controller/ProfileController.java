package com.remi.backend.controller;

import com.remi.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

  @Autowired
  JwtUtils jwtUtils;

  @GetMapping("/username")
  public ResponseEntity getUserName(HttpServletRequest request){
    try {
      String token = jwtUtils.getJwtFromCookies(request);
      String userName = jwtUtils.getUserNameFromJwtToken(token);

      return ResponseEntity.ok(userName);
    } catch (Exception e) {
      return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

  }

}
