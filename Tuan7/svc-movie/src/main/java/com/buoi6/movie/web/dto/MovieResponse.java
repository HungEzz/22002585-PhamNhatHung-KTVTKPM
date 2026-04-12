package com.buoi6.movie.web.dto;

public record MovieResponse(
    String id, String title, String description, Integer durationMinutes) {

  public static MovieResponse from(com.buoi6.movie.domain.Movie m) {
    return new MovieResponse(
        m.getId(), m.getTitle(), m.getDescription(), m.getDurationMinutes());
  }
}
