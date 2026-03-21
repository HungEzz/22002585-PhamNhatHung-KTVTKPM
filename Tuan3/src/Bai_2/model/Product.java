package bai2.model;

import bai2.model.state.NewTaxState;
import bai2.model.state.TaxState;
import bai2.model.strategy.TaxStrategy;
import bai2.model.strategy.VatTaxStrategy;

public class Product {
    private final String name;
    private final double basePrice;
    private TaxState state;
    private TaxStrategy taxStrategy;

    public Product(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
        this.state = new NewTaxState();
        this.taxStrategy = new VatTaxStrategy();
    }

    public String getName() {
        return name;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public TaxState getState() {
        return state;
    }

    public void setState(TaxState state) {
        this.state = state;
        System.out.println("-> Trang thai thue hien tai: " + state.getName());
    }

    public void setTaxStrategy(TaxStrategy taxStrategy) {
        this.taxStrategy = taxStrategy;
        System.out.println("-> Chien luoc thue: " + taxStrategy.getName());
    }

    public double calculateBaseTax() {
        return taxStrategy.calculateTax(basePrice);
    }

    public void reviewTaxPolicy() {
        state.reviewTaxPolicy(this);
    }

    public void calculateTax() {
        state.calculateTax(this);
    }

    public void finalizeTax() {
        state.finalizeTax(this);
    }

    public void cancelTax() {
        state.cancelTax(this);
    }
}
