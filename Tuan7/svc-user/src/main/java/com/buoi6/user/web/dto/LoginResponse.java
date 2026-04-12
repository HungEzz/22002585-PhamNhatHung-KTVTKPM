package com.buoi6.user.web.dto;

public record LoginResponse(String token, UserDto user) {
  public record UserDto(String id, String username) {}
}
