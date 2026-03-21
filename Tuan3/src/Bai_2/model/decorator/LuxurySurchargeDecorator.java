package bai2.model.decorator;

public class LuxurySurchargeDecorator extends TaxDecorator {
    public LuxurySurchargeDecorator(TaxComponent component) {
        super(component);
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Phu thu xa xi";
    }

    @Override
    public double getTaxAmount() {
        return component.getTaxAmount() + 30000;
    }
}
