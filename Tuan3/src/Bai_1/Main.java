package bai1;

import bai1.model.Order;
import bai1.model.decorator.BaseOrderCost;
import bai1.model.decorator.CostComponent;
import bai1.model.decorator.GiftWrapDecorator;
import bai1.model.decorator.InsuranceDecorator;
import bai1.model.decorator.ShippingFeeDecorator;
import bai1.model.strategy.ExpressShippingStrategy;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Mo phong quan ly don hang: State + Strategy + Decorator ===");

        Order order = new Order("DH001", 500000, 12.5, 2.0);

        System.out.println("\n1) State Pattern:");
        order.verify();
        order.process();
        order.process();
        order.deliver();
        order.cancel();

        System.out.println("\n2) Strategy Pattern:");
        System.out.println("Phi van chuyen mac dinh (thuong): " + order.getShippingFee() + " VND");
        order.setShippingStrategy(new ExpressShippingStrategy());
        System.out.println("Phi van chuyen sau khi doi sang nhanh: " + order.getShippingFee() + " VND");

        System.out.println("\n3) Decorator Pattern:");
        CostComponent totalCost = new BaseOrderCost(order);
        totalCost = new ShippingFeeDecorator(totalCost, order);
        totalCost = new GiftWrapDecorator(totalCost);
        totalCost = new InsuranceDecorator(totalCost);

        System.out.println("Mo ta chi phi: " + totalCost.getDescription());
        System.out.println("Tong chi phi cuoi cung: " + totalCost.getCost() + " VND");

        System.out.println("\nKet luan:");
        System.out.println("- State giup tach hanh vi theo tung trang thai don hang.");
        System.out.println("- Strategy giup thay doi cach tinh phi van chuyen linh hoat.");
        System.out.println("- Decorator giup cong them cac dich vu phu ma khong sua lop goc.");
    }
}