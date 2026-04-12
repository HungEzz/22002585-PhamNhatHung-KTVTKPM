package com.buoi6.booking.web;

import com.buoi6.booking.domain.Booking;
import com.buoi6.booking.domain.BookingRepository;
import com.buoi6.booking.domain.BookingStatus;
import com.buoi6.booking.event.BookingEventPublisher;
import com.buoi6.booking.security.BookingPrincipal;
import com.buoi6.booking.web.dto.BookingResponse;
import com.buoi6.booking.web.dto.CreateBookingRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/bookings")
public class BookingController {

  private final BookingRepository bookings;
  private final BookingEventPublisher publisher;

  public BookingController(BookingRepository bookings, BookingEventPublisher publisher) {
    this.bookings = bookings;
    this.publisher = publisher;
  }

  @PostMapping
  public ResponseEntity<?> create(Authentication auth, @RequestBody CreateBookingRequest req) {
    var p = (BookingPrincipal) auth.getPrincipal();
    if (req.movieId() == null || req.movieId().isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("message", "movieId required"));
    }
    int seats = Math.max(1, Math.min(20, req.seatCount()));
    var b = new Booking();
    b.setId(UUID.randomUUID().toString());
    b.setUserId(p.userId());
    b.setMovieId(req.movieId().trim());
    b.setSeatCount(seats);
    b.setStatus(BookingStatus.PENDING);
    b.setMessage("Đang chờ thanh toán");
    bookings.save(b);
    publisher.publishBookingCreated(
        b.getId(), b.getMovieId(), p.userId(), p.username(), b.getSeatCount());
    return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.from(b));
  }

  @GetMapping
  public List<BookingResponse> list(Authentication auth) {
    var p = (BookingPrincipal) auth.getPrincipal();
    return bookings.findByUserIdOrderByIdDesc(p.userId()).stream()
        .map(BookingResponse::from)
        .toList();
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOne(Authentication auth, @PathVariable String id) {
    var p = (BookingPrincipal) auth.getPrincipal();
    var found =
        bookings.findById(id).filter(b -> b.getUserId().equals(p.userId())).orElse(null);
    if (found == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "not found"));
    }
    return ResponseEntity.ok(BookingResponse.from(found));
  }
}
