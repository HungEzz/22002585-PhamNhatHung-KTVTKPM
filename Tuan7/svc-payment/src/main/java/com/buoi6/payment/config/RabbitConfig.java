package com.buoi6.payment.config;

import com.buoi6.payment.event.EventRouting;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

  public static final String QUEUE_BOOKING_CREATED = "q.payment.booking-created";
  public static final String QUEUE_NOTIFICATION = "q.notification.payment-completed";

  @Bean
  TopicExchange movieTopicExchange() {
    return new TopicExchange(EventRouting.EXCHANGE, true, false);
  }

  @Bean
  Queue paymentBookingCreatedQueue() {
    return new Queue(QUEUE_BOOKING_CREATED, true);
  }

  @Bean
  Binding bindBookingCreated(Queue paymentBookingCreatedQueue, TopicExchange movieTopicExchange) {
    return BindingBuilder.bind(paymentBookingCreatedQueue)
        .to(movieTopicExchange)
        .with(EventRouting.BOOKING_CREATED);
  }

  @Bean
  Queue notificationPaymentCompletedQueue() {
    return new Queue(QUEUE_NOTIFICATION, true);
  }

  @Bean
  Binding bindNotification(
      Queue notificationPaymentCompletedQueue, TopicExchange movieTopicExchange) {
    return BindingBuilder.bind(notificationPaymentCompletedQueue)
        .to(movieTopicExchange)
        .with(EventRouting.PAYMENT_COMPLETED);
  }
}
