package com.buoi6.user.config;

import com.buoi6.user.event.EventRouting;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

  @Bean
  TopicExchange movieTopicExchange() {
    return new TopicExchange(EventRouting.EXCHANGE, true, false);
  }
}
