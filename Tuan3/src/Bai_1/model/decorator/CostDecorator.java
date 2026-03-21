package bai1.model.decorator;

public abstract class CostDecorator implements CostComponent {
    protected final CostComponent component;

    protected CostDecorator(CostComponent component) {
        this.component = component;
    }
}
