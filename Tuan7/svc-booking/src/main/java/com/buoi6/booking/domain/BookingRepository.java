package com.buoi6.booking.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, String> {
  List<Booking> findByUserIdOrderByIdDesc(String userId);
}
