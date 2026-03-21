package bai3.model.decorator;

public class DiscountCodeDecorator extends PaymentDecorator {
    private final double discountAmount;

    public DiscountCodeDecorator(PaymentComponent component, double discountAmount) {
        super(component);
        this.discountAmount = discountAmount;
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Ma giam gia";
    }

    @Override
    public double getFinalAmount() {
        double amount = component.getFinalAmount() - discountAmount;
        return Math.max(amount, 0);
    }
}
