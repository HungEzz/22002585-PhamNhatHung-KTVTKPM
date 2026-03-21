package bai2.model.strategy;

public class VatTaxStrategy implements TaxStrategy {
    @Override
    public String getName() {
        return "Thue VAT";
    }

    @Override
    public double calculateTax(double basePrice) {
        return basePrice * 0.10;
    }
}
