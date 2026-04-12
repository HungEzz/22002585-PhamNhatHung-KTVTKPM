package com.buoi6.user.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
  Optional<AppUser> findByUsername(String username);

  boolean existsByUsername(String username);
}
