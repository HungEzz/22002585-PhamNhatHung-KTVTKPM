package bai3.model.state;

import bai3.model.PaymentOrder;

public interface PaymentState {
    String getName();

    void verifyPayment(PaymentOrder order);

    void processPayment(PaymentOrder order, double amount);

    void completePayment(PaymentOrder order);

    void cancelPayment(PaymentOrder order);
}
