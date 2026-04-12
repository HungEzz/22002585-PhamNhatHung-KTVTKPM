package com.buoi6.booking.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class BookingEventPublisher {

  private static final Logger log = LoggerFactory.getLogger(BookingEventPublisher.class);

  private final RabbitTemplate rabbit;
  private final ObjectMapper mapper;

  public BookingEventPublisher(RabbitTemplate rabbit, ObjectMapper mapper) {
    this.rabbit = rabbit;
    this.mapper = mapper;
  }

  public void publishBookingCreated(
      String bookingId, String movieId, String userId, String username, int seatCount) {
    var payload = mapper.createObjectNode();
    payload.put("bookingId", bookingId);
    payload.put("movieId", movieId);
    payload.put("userId", userId);
    payload.put("username", username != null ? username : "");
    payload.put("seatCount", seatCount);
    payload.put("occurredAt", Instant.now().toString());
    var env = mapper.createObjectNode();
    env.put("eventType", EventRouting.BOOKING_CREATED);
    env.set("payload", payload);
    try {
      rabbit.convertAndSend(
          EventRouting.EXCHANGE, EventRouting.BOOKING_CREATED, mapper.writeValueAsBytes(env));
      log.info("Published {} bookingId={}", EventRouting.BOOKING_CREATED, bookingId);
    } catch (Exception e) {
      log.error("publish BOOKING_CREATED failed", e);
    }
  }
}
