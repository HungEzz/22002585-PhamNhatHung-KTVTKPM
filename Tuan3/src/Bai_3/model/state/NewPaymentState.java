package bai3.model.state;

import bai3.model.PaymentOrder;

public class NewPaymentState implements PaymentState {
    @Override
    public String getName() {
        return "Moi tao";
    }

    @Override
    public void verifyPayment(PaymentOrder order) {
        System.out.println("[Moi tao] Kiem tra thong tin thanh toan don: " + order.getOrderId());
    }

    @Override
    public void processPayment(PaymentOrder order, double amount) {
        System.out.println("[Moi tao] Bat dau xu ly thanh toan.");
        order.setState(new ProcessingPaymentState());
        order.processPayment(amount);
    }

    @Override
    public void completePayment(PaymentOrder order) {
        System.out.println("Khong the hoan tat khi thanh toan chua duoc xu ly.");
    }

    @Override
    public void cancelPayment(PaymentOrder order) {
        System.out.println("[Moi tao] Huy yeu cau thanh toan.");
        order.setState(new CancelledPaymentState());
    }
}
