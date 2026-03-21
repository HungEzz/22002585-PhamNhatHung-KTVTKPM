package bai1.model.state;

import bai1.model.Order;

public class NewState implements OrderState {
    @Override
    public String getName() {
        return "Moi tao";
    }

    @Override
    public void verifyOrder(Order order) {
        System.out.println("[Moi tao] Kiem tra thong tin don hang: " + order.getOrderId());
    }

    @Override
    public void processOrder(Order order) {
        System.out.println("[Moi tao] Bat dau xu ly don hang.");
        order.setState(new ProcessingState());
    }

    @Override
    public void deliverOrder(Order order) {
        System.out.println("Khong the giao ngay khi don hang dang o trang thai Moi tao.");
    }

    @Override
    public void cancelOrder(Order order) {
        System.out.println("[Moi tao] Huy don hang truoc khi xu ly.");
        order.setState(new CancelledState());
    }
}
