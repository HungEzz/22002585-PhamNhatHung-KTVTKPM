package com.buoi6.payment.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class DomainEventPublisher {

  private static final Logger log = LoggerFactory.getLogger(DomainEventPublisher.class);

  private final RabbitTemplate rabbit;
  private final ObjectMapper mapper;

  public DomainEventPublisher(RabbitTemplate rabbit, ObjectMapper mapper) {
    this.rabbit = rabbit;
    this.mapper = mapper;
  }

  public void publishPaymentCompleted(String bookingId, String userId, String username)
      throws Exception {
    ObjectNode payload = mapper.createObjectNode();
    payload.put("bookingId", bookingId);
    payload.put("userId", userId);
    payload.put("username", username != null ? username : "");
    ObjectNode env = mapper.createObjectNode();
    env.put("eventType", EventRouting.PAYMENT_COMPLETED);
    env.set("payload", payload);
    byte[] body = mapper.writeValueAsBytes(env);
    rabbit.convertAndSend(EventRouting.EXCHANGE, EventRouting.PAYMENT_COMPLETED, body);
    log.info("Published {} bookingId={}", EventRouting.PAYMENT_COMPLETED, bookingId);
  }

  public void publishBookingFailed(String bookingId, String userId, String reason)
      throws Exception {
    ObjectNode payload = mapper.createObjectNode();
    payload.put("bookingId", bookingId);
    payload.put("userId", userId);
    payload.put("reason", reason);
    ObjectNode env = mapper.createObjectNode();
    env.put("eventType", EventRouting.BOOKING_FAILED);
    env.set("payload", payload);
    byte[] body = mapper.writeValueAsBytes(env);
    rabbit.convertAndSend(EventRouting.EXCHANGE, EventRouting.BOOKING_FAILED, body);
    log.info("Published {} bookingId={}", EventRouting.BOOKING_FAILED, bookingId);
  }
}
