package bai1.model;

import bai1.model.state.NewState;
import bai1.model.state.OrderState;
import bai1.model.strategy.ShippingStrategy;
import bai1.model.strategy.StandardShippingStrategy;

public class Order {
    private final String orderId;
    private final double amount;
    private final double distanceKm;
    private final double weightKg;
    private OrderState state;
    private ShippingStrategy shippingStrategy;

    public Order(String orderId, double amount, double distanceKm, double weightKg) {
        this.orderId = orderId;
        this.amount = amount;
        this.distanceKm = distanceKm;
        this.weightKg = weightKg;
        this.state = new NewState();
        this.shippingStrategy = new StandardShippingStrategy();
    }

    public String getOrderId() {
        return orderId;
    }

    public double getAmount() {
        return amount;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setState(OrderState state) {
        this.state = state;
        System.out.println("-> Trang thai hien tai: " + state.getName());
    }

    public void setShippingStrategy(ShippingStrategy shippingStrategy) {
        this.shippingStrategy = shippingStrategy;
        System.out.println("-> Chien luoc van chuyen: " + shippingStrategy.getName());
    }

    public double getShippingFee() {
        return shippingStrategy.calculateShippingFee(distanceKm, weightKg);
    }

    public void verify() {
        state.verifyOrder(this);
    }

    public void process() {
        state.processOrder(this);
    }

    public void deliver() {
        state.deliverOrder(this);
    }

    public void cancel() {
        state.cancelOrder(this);
    }

    public void refund() {
        System.out.println("-> Hoan tien cho don hang " + orderId + " so tien: " + amount + " VND");
    }
}
