package bai1.model.state;

import bai1.model.Order;

public class CancelledState implements OrderState {
    @Override
    public String getName() {
        return "Huy";
    }

    @Override
    public void verifyOrder(Order order) {
        System.out.println("Don hang da huy, khong the kiem tra.");
    }

    @Override
    public void processOrder(Order order) {
        System.out.println("Don hang da huy, khong the xu ly.");
    }

    @Override
    public void deliverOrder(Order order) {
        System.out.println("Don hang da huy, khong the giao.");
    }

    @Override
    public void cancelOrder(Order order) {
        System.out.println("Don hang da o trang thai Huy.");
    }
}
