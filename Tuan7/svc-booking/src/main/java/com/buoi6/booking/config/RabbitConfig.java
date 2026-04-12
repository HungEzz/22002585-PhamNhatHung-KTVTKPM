package com.buoi6.booking.config;

import com.buoi6.booking.event.EventRouting;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

  public static final String QUEUE_PAYMENT_OUTCOME = "q.booking.payment-outcome";

  @Bean
  TopicExchange movieTopicExchange() {
    return new TopicExchange(EventRouting.EXCHANGE, true, false);
  }

  @Bean
  Queue bookingPaymentOutcomeQueue() {
    return new Queue(QUEUE_PAYMENT_OUTCOME, true);
  }

  @Bean
  Binding bindPaymentCompleted(
      Queue bookingPaymentOutcomeQueue, TopicExchange movieTopicExchange) {
    return BindingBuilder.bind(bookingPaymentOutcomeQueue)
        .to(movieTopicExchange)
        .with(EventRouting.PAYMENT_COMPLETED);
  }

  @Bean
  Binding bindBookingFailed(
      Queue bookingPaymentOutcomeQueue, TopicExchange movieTopicExchange) {
    return BindingBuilder.bind(bookingPaymentOutcomeQueue)
        .to(movieTopicExchange)
        .with(EventRouting.BOOKING_FAILED);
  }
}
