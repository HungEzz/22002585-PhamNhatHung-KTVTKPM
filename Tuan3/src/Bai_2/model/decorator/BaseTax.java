package bai2.model.decorator;

import bai2.model.Product;

public class BaseTax implements TaxComponent {
    private final Product product;

    public BaseTax(Product product) {
        this.product = product;
    }

    @Override
    public String getDescription() {
        return "Thue co ban";
    }

    @Override
    public double getTaxAmount() {
        return product.calculateBaseTax();
    }
}
