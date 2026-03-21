package bai1.model.state;

import bai1.model.Order;

public class ProcessingState implements OrderState {
    @Override
    public String getName() {
        return "Dang xu ly";
    }

    @Override
    public void verifyOrder(Order order) {
        System.out.println("Don hang da qua buoc Moi tao, khong can kiem tra lai.");
    }

    @Override
    public void processOrder(Order order) {
        System.out.println("[Dang xu ly] Dong goi va van chuyen don hang: " + order.getOrderId());
    }

    @Override
    public void deliverOrder(Order order) {
        System.out.println("[Dang xu ly] Cap nhat trang thai: da giao.");
        order.setState(new DeliveredState());
    }

    @Override
    public void cancelOrder(Order order) {
        System.out.println("[Dang xu ly] Huy don hang, tien hanh hoan tien.");
        order.refund();
        order.setState(new CancelledState());
    }
}
