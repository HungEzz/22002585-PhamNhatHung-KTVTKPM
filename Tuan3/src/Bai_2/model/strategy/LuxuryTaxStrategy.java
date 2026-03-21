package bai2.model.strategy;

public class LuxuryTaxStrategy implements TaxStrategy {
    @Override
    public String getName() {
        return "Thue xa xi";
    }

    @Override
    public double calculateTax(double basePrice) {
        return basePrice * 0.30;
    }
}
