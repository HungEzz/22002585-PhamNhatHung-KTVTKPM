package bai2.model.decorator;

public abstract class TaxDecorator implements TaxComponent {
    protected final TaxComponent component;

    protected TaxDecorator(TaxComponent component) {
        this.component = component;
    }
}
