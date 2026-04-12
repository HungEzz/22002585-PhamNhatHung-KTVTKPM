package com.buoi6.booking.event;

import com.buoi6.booking.config.RabbitConfig;
import com.buoi6.booking.domain.Booking;
import com.buoi6.booking.domain.BookingRepository;
import com.buoi6.booking.domain.BookingStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PaymentOutcomeListener {

  private static final Logger log = LoggerFactory.getLogger(PaymentOutcomeListener.class);

  private final BookingRepository bookings;
  private final ObjectMapper mapper;

  public PaymentOutcomeListener(BookingRepository bookings, ObjectMapper mapper) {
    this.bookings = bookings;
    this.mapper = mapper;
  }

  @RabbitListener(queues = RabbitConfig.QUEUE_PAYMENT_OUTCOME)
  @Transactional
  public void onMessage(byte[] body) {
    try {
      JsonNode root = mapper.readTree(body);
      String type = root.path("eventType").asText("");
      JsonNode payload = root.path("payload");
      String bookingId = payload.path("bookingId").asText(null);
      if (bookingId == null) return;

      Booking b = bookings.findById(bookingId).orElse(null);
      if (b == null) {
        log.warn("Booking not found for outcome: {}", bookingId);
        return;
      }

      if (EventRouting.PAYMENT_COMPLETED.equals(type)) {
        b.setStatus(BookingStatus.PAID);
        b.setMessage("Thanh toán thành công");
        bookings.save(b);
        log.info("Consumed PAYMENT_COMPLETED bookingId={}", bookingId);
      } else if (EventRouting.BOOKING_FAILED.equals(type)) {
        b.setStatus(BookingStatus.FAILED);
        b.setMessage(payload.path("reason").asText("Thanh toán thất bại"));
        bookings.save(b);
        log.info("Consumed BOOKING_FAILED bookingId={}", bookingId);
      }
    } catch (Exception e) {
      log.error("Payment outcome listener error", e);
    }
  }
}
