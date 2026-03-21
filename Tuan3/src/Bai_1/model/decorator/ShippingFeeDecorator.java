package bai1.model.decorator;

import bai1.model.Order;

public class ShippingFeeDecorator extends CostDecorator {
    private final Order order;

    public ShippingFeeDecorator(CostComponent component, Order order) {
        super(component);
        this.order = order;
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Phi van chuyen";
    }

    @Override
    public double getCost() {
        return component.getCost() + order.getShippingFee();
    }
}
