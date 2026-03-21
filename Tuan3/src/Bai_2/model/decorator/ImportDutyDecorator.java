package bai2.model.decorator;

public class ImportDutyDecorator extends TaxDecorator {
    public ImportDutyDecorator(TaxComponent component) {
        super(component);
    }

    @Override
    public String getDescription() {
        return component.getDescription() + " + Thue nhap khau bo sung";
    }

    @Override
    public double getTaxAmount() {
        return component.getTaxAmount() + 25000;
    }
}
