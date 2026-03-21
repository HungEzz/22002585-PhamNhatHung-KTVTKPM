package bai2.model.strategy;

public class ExciseTaxStrategy implements TaxStrategy {
    @Override
    public String getName() {
        return "Thue tieu thu";
    }

    @Override
    public double calculateTax(double basePrice) {
        return basePrice * 0.20;
    }
}
