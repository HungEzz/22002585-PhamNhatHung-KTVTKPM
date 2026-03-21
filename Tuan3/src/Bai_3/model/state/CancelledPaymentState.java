package bai3.model.state;

import bai3.model.PaymentOrder;

public class CancelledPaymentState implements PaymentState {
    @Override
    public String getName() {
        return "Huy";
    }

    @Override
    public void verifyPayment(PaymentOrder order) {
        System.out.println("Giao dich da huy, khong the kiem tra.");
    }

    @Override
    public void processPayment(PaymentOrder order, double amount) {
        System.out.println("Giao dich da huy, khong the xu ly.");
    }

    @Override
    public void completePayment(PaymentOrder order) {
        System.out.println("Giao dich da huy, khong the hoan tat.");
    }

    @Override
    public void cancelPayment(PaymentOrder order) {
        System.out.println("Giao dich da o trang thai Huy.");
    }
}
