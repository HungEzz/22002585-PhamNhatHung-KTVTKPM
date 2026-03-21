package bai1.model.strategy;

public class ExpressShippingStrategy implements ShippingStrategy {
    @Override
    public String getName() {
        return "Giao hang nhanh";
    }

    @Override
    public double calculateShippingFee(double distanceKm, double weightKg) {
        return 30000 + (distanceKm * 3000) + (weightKg * 1500);
    }
}
