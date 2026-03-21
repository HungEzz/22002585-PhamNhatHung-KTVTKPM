package bai2.model.strategy;

public interface TaxStrategy {
    String getName();

    double calculateTax(double basePrice);
}
