package bai3.model.state;

import bai3.model.PaymentOrder;

public class CompletedPaymentState implements PaymentState {
    @Override
    public String getName() {
        return "Hoan tat";
    }

    @Override
    public void verifyPayment(PaymentOrder order) {
        System.out.println("Thanh toan da hoan tat, khong can kiem tra lai.");
    }

    @Override
    public void processPayment(PaymentOrder order, double amount) {
        System.out.println("Thanh toan da hoan tat, khong thu tien lai.");
    }

    @Override
    public void completePayment(PaymentOrder order) {
        System.out.println("Trang thai hien tai da la Hoan tat.");
    }

    @Override
    public void cancelPayment(PaymentOrder order) {
        System.out.println("Khong the huy khi thanh toan da hoan tat.");
    }
}
