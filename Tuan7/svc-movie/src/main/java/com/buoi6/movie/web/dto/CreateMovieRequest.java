package com.buoi6.movie.web.dto;

public record CreateMovieRequest(
    String title, String description, Integer durationMinutes) {}
