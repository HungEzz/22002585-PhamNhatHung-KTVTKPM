package bai1.model.state;

import bai1.model.Order;

public interface OrderState {
    String getName();

    void verifyOrder(Order order);

    void processOrder(Order order);

    void deliverOrder(Order order);

    void cancelOrder(Order order);
}
