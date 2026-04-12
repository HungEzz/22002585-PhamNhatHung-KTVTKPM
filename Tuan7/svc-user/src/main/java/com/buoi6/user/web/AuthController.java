package com.buoi6.user.web;

import com.buoi6.user.domain.AppUser;
import com.buoi6.user.domain.AppUserRepository;
import com.buoi6.user.event.UserEventPublisher;
import com.buoi6.user.security.JwtService;
import com.buoi6.user.web.dto.LoginRequest;
import com.buoi6.user.web.dto.LoginResponse;
import com.buoi6.user.web.dto.RegisterRequest;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

  private final AppUserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;
  private final UserEventPublisher events;

  public AuthController(
      AppUserRepository users,
      PasswordEncoder encoder,
      JwtService jwt,
      UserEventPublisher events) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
    this.events = events;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    if (req.username() == null || req.username().isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("message", "username required"));
    }
    if (req.password() == null || req.password().length() < 4) {
      return ResponseEntity.badRequest().body(Map.of("message", "password too short"));
    }
    if (users.existsByUsername(req.username().trim())) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(Map.of("message", "username already exists"));
    }
    var u = new AppUser();
    u.setUsername(req.username().trim());
    u.setPasswordHash(encoder.encode(req.password()));
    u.setEmail(req.email() != null ? req.email().trim() : null);
    users.save(u);
    events.publishUserRegistered(u.getId(), u.getUsername(), u.getEmail());
    return ResponseEntity.ok(Map.of("message", "registered"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    var u =
        users
            .findByUsername(req.username().trim())
            .filter(x -> encoder.matches(req.password(), x.getPasswordHash()))
            .orElse(null);
    if (u == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("message", "invalid credentials"));
    }
    var token = jwt.createToken(u.getId(), u.getUsername());
    return ResponseEntity.ok(
        new LoginResponse(token, new LoginResponse.UserDto(u.getId(), u.getUsername())));
  }
}
