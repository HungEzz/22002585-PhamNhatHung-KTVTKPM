package com.buoi6.movie.web;

import com.buoi6.movie.domain.Movie;
import com.buoi6.movie.domain.MovieRepository;
import com.buoi6.movie.web.dto.CreateMovieRequest;
import com.buoi6.movie.web.dto.MovieResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/movies")
public class MovieController {

  private final MovieRepository movies;

  public MovieController(MovieRepository movies) {
    this.movies = movies;
  }

  @GetMapping
  public List<MovieResponse> list() {
    return movies.findAll().stream().map(MovieResponse::from).toList();
  }

  @PostMapping
  public ResponseEntity<MovieResponse> create(@RequestBody CreateMovieRequest req) {
    if (req.title() == null || req.title().isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    var m = new Movie();
    m.setId(UUID.randomUUID().toString());
    m.setTitle(req.title().trim());
    m.setDescription(req.description());
    m.setDurationMinutes(req.durationMinutes());
    movies.save(m);
    return ResponseEntity.ok(MovieResponse.from(m));
  }
}
