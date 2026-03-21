package bai1.model.decorator;

public class InsuranceDecorator extends CostDecorator {
    public InsuranceDecorator(CostComponent component) {
        super(component);
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Bao hiem";
    }

    @Override
    public double getCost() {
        return component.getCost() + 20000;
    }
}
