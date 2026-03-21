package bai3.model.strategy;

public interface PaymentStrategy {
    String getName();

    void pay(String orderId, double amount);
}
