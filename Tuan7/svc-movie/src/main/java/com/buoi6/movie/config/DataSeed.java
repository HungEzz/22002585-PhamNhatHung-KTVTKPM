package com.buoi6.movie.config;

import com.buoi6.movie.domain.Movie;
import com.buoi6.movie.domain.MovieRepository;
import java.util.UUID;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeed {

  @Bean
  CommandLineRunner seedMovies(MovieRepository movies) {
    return args -> {
      if (movies.count() > 0) return;
      var a = new Movie();
      a.setId(UUID.randomUUID().toString());
      a.setTitle("Dune: Part Two");
      a.setDescription("Tiếp nối hành trình Paul Atreides.");
      a.setDurationMinutes(166);
      var b = new Movie();
      b.setId(UUID.randomUUID().toString());
      b.setTitle("Oppenheimer");
      b.setDescription("Tiểu sử Robert Oppenheimer.");
      b.setDurationMinutes(180);
      var c = new Movie();
      c.setId(UUID.randomUUID().toString());
      c.setTitle("Spider-Verse");
      c.setDescription("Hoạt hình đa vũ trụ.");
      c.setDurationMinutes(140);
      movies.save(a);
      movies.save(b);
      movies.save(c);
    };
  }
}
