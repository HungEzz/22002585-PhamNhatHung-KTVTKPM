package bai3.model.state;

import bai3.model.PaymentOrder;

public class ProcessingPaymentState implements PaymentState {
    @Override
    public String getName() {
        return "Dang xu ly";
    }

    @Override
    public void verifyPayment(PaymentOrder order) {
        System.out.println("Don hang dang xu ly thanh toan, bo qua buoc kiem tra lai.");
    }

    @Override
    public void processPayment(PaymentOrder order, double amount) {
        System.out.println("[Dang xu ly] Tien hanh thu tien.");
        order.executePayment(amount);
    }

    @Override
    public void completePayment(PaymentOrder order) {
        System.out.println("[Dang xu ly] Hoan tat thanh toan.");
        order.setState(new CompletedPaymentState());
    }

    @Override
    public void cancelPayment(PaymentOrder order) {
        System.out.println("[Dang xu ly] Huy giao dich va hoan tien.");
        order.refund();
        order.setState(new CancelledPaymentState());
    }
}
