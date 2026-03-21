package bai3.model.decorator;

public class BasePayment implements PaymentComponent {
    private final double baseAmount;

    public BasePayment(double baseAmount) {
        this.baseAmount = baseAmount;
    }

    @Override
    public String getDescription() {
        return "Gia tri goc";
    }

    @Override
    public double getFinalAmount() {
        return baseAmount;
    }
}
