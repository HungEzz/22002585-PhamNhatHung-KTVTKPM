package bai3.model;

import bai3.model.state.NewPaymentState;
import bai3.model.state.PaymentState;
import bai3.model.strategy.CreditCardStrategy;
import bai3.model.strategy.PaymentStrategy;

public class PaymentOrder {
    private final String orderId;
    private final double baseAmount;
    private PaymentState state;
    private PaymentStrategy paymentStrategy;

    public PaymentOrder(String orderId, double baseAmount) {
        this.orderId = orderId;
        this.baseAmount = baseAmount;
        this.state = new NewPaymentState();
        this.paymentStrategy = new CreditCardStrategy();
    }

    public String getOrderId() {
        return orderId;
    }

    public double getBaseAmount() {
        return baseAmount;
    }

    public void setState(PaymentState state) {
        this.state = state;
        System.out.println("-> Trang thai thanh toan hien tai: " + state.getName());
    }

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
        System.out.println("-> Phuong thuc thanh toan: " + paymentStrategy.getName());
    }

    public void executePayment(double amount) {
        paymentStrategy.pay(orderId, amount);
    }

    public void verifyPayment() {
        state.verifyPayment(this);
    }

    public void processPayment(double amount) {
        state.processPayment(this, amount);
    }

    public void completePayment() {
        state.completePayment(this);
    }

    public void cancelPayment() {
        state.cancelPayment(this);
    }

    public void refund() {
        System.out.println("-> Hoan tien thanh toan cho don " + orderId + ": " + baseAmount + " VND");
    }
}
