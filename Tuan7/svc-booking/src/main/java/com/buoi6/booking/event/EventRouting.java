package com.buoi6.booking.event;

public final class EventRouting {
  public static final String EXCHANGE = "movie.topic";
  public static final String BOOKING_CREATED = "BOOKING_CREATED";
  public static final String PAYMENT_COMPLETED = "PAYMENT_COMPLETED";
  public static final String BOOKING_FAILED = "BOOKING_FAILED";

  private EventRouting() {}
}
