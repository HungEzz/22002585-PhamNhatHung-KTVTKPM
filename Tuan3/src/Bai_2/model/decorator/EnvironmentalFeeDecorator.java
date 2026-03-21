package bai2.model.decorator;

public class EnvironmentalFeeDecorator extends TaxDecorator {
    public EnvironmentalFeeDecorator(TaxComponent component) {
        super(component);
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Phi moi truong";
    }

    @Override
    public double getTaxAmount() {
        return component.getTaxAmount() + 15000;
    }
}
