package bai1.model.state;

import bai1.model.Order;

public class DeliveredState implements OrderState {
    @Override
    public String getName() {
        return "Da giao";
    }

    @Override
    public void verifyOrder(Order order) {
        System.out.println("Don hang da giao, khong the kiem tra lai quy trinh ban dau.");
    }

    @Override
    public void processOrder(Order order) {
        System.out.println("Don hang da giao, khong con xu ly.");
    }

    @Override
    public void deliverOrder(Order order) {
        System.out.println("Don hang da o trang thai Da giao.");
    }

    @Override
    public void cancelOrder(Order order) {
        System.out.println("Khong the huy don hang da giao.");
    }
}
