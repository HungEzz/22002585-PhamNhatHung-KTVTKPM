package com.buoi6.booking.web.dto;

import com.buoi6.booking.domain.Booking;
import com.buoi6.booking.domain.BookingStatus;

public record BookingResponse(
    String id,
    String movieId,
    String userId,
    int seatCount,
    String status,
    String message) {

  public static BookingResponse from(Booking b) {
    return new BookingResponse(
        b.getId(),
        b.getMovieId(),
        b.getUserId(),
        b.getSeatCount(),
        mapStatus(b.getStatus()),
        b.getMessage());
  }

  private static String mapStatus(BookingStatus s) {
    if (s == BookingStatus.PAID) return "PAID";
    if (s == BookingStatus.FAILED) return "FAILED";
    return "PENDING";
  }
}
