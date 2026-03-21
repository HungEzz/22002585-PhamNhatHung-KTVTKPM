package bai2.model.state;

import bai2.model.Product;

public interface TaxState {
    String getName();

    void reviewTaxPolicy(Product product);

    void calculateTax(Product product);

    void finalizeTax(Product product);

    void cancelTax(Product product);
}
