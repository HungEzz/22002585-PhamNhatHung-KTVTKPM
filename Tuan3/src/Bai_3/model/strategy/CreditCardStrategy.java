package bai3.model.strategy;

public class CreditCardStrategy implements PaymentStrategy {
    @Override
    public String getName() {
        return "The tin dung";
    }

    @Override
    public void pay(String orderId, double amount) {
        System.out.println("[Credit Card] Thanh toan don " + orderId + " so tien: " + amount + " VND");
    }
}
