package bai1.model.strategy;

public interface ShippingStrategy {
    String getName();

    double calculateShippingFee(double distanceKm, double weightKg);
}
