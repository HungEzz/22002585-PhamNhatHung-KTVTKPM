package com.buoi6.user.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserEventPublisher {

  private static final Logger log = LoggerFactory.getLogger(UserEventPublisher.class);

  private final RabbitTemplate rabbit;
  private final ObjectMapper mapper;

  public UserEventPublisher(RabbitTemplate rabbit, ObjectMapper mapper) {
    this.rabbit = rabbit;
    this.mapper = mapper;
  }

  public void publishUserRegistered(String userId, String username, String email) {
    var payload = new UserRegisteredPayload(userId, username, email, Instant.now());
    var env = new EventEnvelope(EventRouting.USER_REGISTERED, payload);
    try {
      byte[] body = mapper.writeValueAsBytes(env);
      rabbit.convertAndSend(EventRouting.EXCHANGE, EventRouting.USER_REGISTERED, body);
      log.info("Published {} userId={}", EventRouting.USER_REGISTERED, userId);
    } catch (Exception e) {
      log.error("Failed to publish USER_REGISTERED", e);
    }
  }
}
