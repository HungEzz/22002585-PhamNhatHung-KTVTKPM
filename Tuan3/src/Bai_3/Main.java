package bai3;

import bai3.model.PaymentOrder;
import bai3.model.decorator.BasePayment;
import bai3.model.decorator.DiscountCodeDecorator;
import bai3.model.decorator.PaymentComponent;
import bai3.model.decorator.ProcessingFeeDecorator;
import bai3.model.strategy.PaypalStrategy;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Bai 3: He thong thanh toan ===");

        PaymentOrder order = new PaymentOrder("TT001", 1000000);

        System.out.println("\n1) State Pattern:");
        order.verifyPayment();
        order.processPayment(order.getBaseAmount());

        System.out.println("\n2) Strategy Pattern:");
        order.setPaymentStrategy(new PaypalStrategy());
        order.processPayment(order.getBaseAmount());
        order.completePayment();
        order.cancelPayment();

        System.out.println("\n3) Decorator Pattern:");
        PaymentComponent component = new BasePayment(order.getBaseAmount());
        component = new ProcessingFeeDecorator(component, 0.025);
        component = new DiscountCodeDecorator(component, 50000);

        System.out.println("Mo ta thanh toan: " + component.getDescription());
        System.out.printf("So tien thanh toan cuoi cung: %.0f VND%n", component.getFinalAmount());

        System.out.println("\nKet luan:");
        System.out.println("- State quan ly luong thanh toan theo trang thai.");
        System.out.println("- Strategy cho phep doi phuong thuc thanh toan linh hoat (The, PayPal).");
        System.out.println("- Decorator bo sung phi xu ly, ma giam gia ma khong sua lop thanh toan goc.");
    }
}
