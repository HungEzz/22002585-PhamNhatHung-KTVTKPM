package bai3.model.decorator;

public class ProcessingFeeDecorator extends PaymentDecorator {
    private final double feeRate;

    public ProcessingFeeDecorator(PaymentComponent component, double feeRate) {
        super(component);
        this.feeRate = feeRate;
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Phi xu ly";
    }

    @Override
    public double getFinalAmount() {
        return component.getFinalAmount() * (1 + feeRate);
    }
}
