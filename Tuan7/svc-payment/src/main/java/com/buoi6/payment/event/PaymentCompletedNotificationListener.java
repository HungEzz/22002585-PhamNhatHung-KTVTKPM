package com.buoi6.payment.event;

import com.buoi6.payment.config.RabbitConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentCompletedNotificationListener {

  private static final Logger log = LoggerFactory.getLogger(PaymentCompletedNotificationListener.class);

  private final ObjectMapper mapper;

  public PaymentCompletedNotificationListener(ObjectMapper mapper) {
    this.mapper = mapper;
  }

  @RabbitListener(queues = RabbitConfig.QUEUE_NOTIFICATION)
  public void onPaymentCompleted(byte[] body) {
    try {
      JsonNode root = mapper.readTree(body);
      JsonNode p = root.path("payload");
      String bookingId = p.path("bookingId").asText("?");
      String username = p.path("username").asText("User");
      log.info("NOTIFICATION: Booking #{} thành công!", bookingId);
      log.info(
          "NOTIFICATION: {} đã đặt đơn #{} thành công",
          username.isBlank() ? "User" : username,
          bookingId);
    } catch (Exception e) {
      log.error("Notification listener error", e);
    }
  }
}
