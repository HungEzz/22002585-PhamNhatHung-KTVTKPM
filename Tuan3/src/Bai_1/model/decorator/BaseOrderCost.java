package bai1.model.decorator;

import bai1.model.Order;

public class BaseOrderCost implements CostComponent {
    private final Order order;

    public BaseOrderCost(Order order) {
        this.order = order;
    }

    @Override
    public String getDescription() {
        return "Gia tri don hang";
    }

    @Override
    public double getCost() {
        return order.getAmount();
    }
}
