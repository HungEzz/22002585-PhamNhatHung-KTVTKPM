package bai1.model.strategy;

public class StandardShippingStrategy implements ShippingStrategy {
    @Override
    public String getName() {
        return "Giao hang thuong";
    }

    @Override
    public double calculateShippingFee(double distanceKm, double weightKg) {
        return 15000 + (distanceKm * 2000) + (weightKg * 1000);
    }
}
