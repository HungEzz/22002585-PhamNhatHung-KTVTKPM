package com.buoi6.booking;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit
public class BookingServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(BookingServiceApplication.class, args);
  }
}
