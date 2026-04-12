package com.buoi6.payment.event;

import com.buoi6.payment.config.RabbitConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.ThreadLocalRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class BookingCreatedListener {

  private static final Logger log = LoggerFactory.getLogger(BookingCreatedListener.class);

  private final ObjectMapper mapper;
  private final DomainEventPublisher publisher;

  public BookingCreatedListener(ObjectMapper mapper, DomainEventPublisher publisher) {
    this.mapper = mapper;
    this.publisher = publisher;
  }

  @RabbitListener(queues = RabbitConfig.QUEUE_BOOKING_CREATED)
  public void onBookingCreated(byte[] body) {
    try {
      JsonNode root = mapper.readTree(body);
      String type = root.path("eventType").asText("");
      if (!EventRouting.BOOKING_CREATED.equals(type)) {
        return;
      }
      JsonNode p = root.path("payload");
      String bookingId = p.path("bookingId").asText(null);
      String userId = p.path("userId").asText("");
      String username = p.path("username").asText("");
      if (bookingId == null) {
        return;
      }
      log.info("Consumed {} bookingId={}", EventRouting.BOOKING_CREATED, bookingId);
      Thread.sleep(400 + ThreadLocalRandom.current().nextInt(400));
      boolean ok = ThreadLocalRandom.current().nextDouble() > 0.35;
      if (ok) {
        publisher.publishPaymentCompleted(bookingId, userId, username);
      } else {
        publisher.publishBookingFailed(bookingId, userId, "Thanh toán giả lập thất bại");
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    } catch (Exception e) {
      log.error("BookingCreatedListener error", e);
    }
  }
}
