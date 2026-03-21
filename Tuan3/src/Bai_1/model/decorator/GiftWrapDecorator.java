package bai1.model.decorator;

public class GiftWrapDecorator extends CostDecorator {
    public GiftWrapDecorator(CostComponent component) {
        super(component);
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Goi qua";
    }

    @Override
    public double getCost() {
        return component.getCost() + 10000;
    }
}
