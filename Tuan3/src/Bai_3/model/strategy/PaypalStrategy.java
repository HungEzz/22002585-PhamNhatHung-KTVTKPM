package bai3.model.strategy;

public class PaypalStrategy implements PaymentStrategy {
    @Override
    public String getName() {
        return "PayPal";
    }

    @Override
    public void pay(String orderId, double amount) {
        System.out.println("[PayPal] Thanh toan don " + orderId + " so tien: " + amount + " VND");
    }
}
