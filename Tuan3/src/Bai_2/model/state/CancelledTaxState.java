package bai2.model.state;

import bai2.model.Product;

public class CancelledTaxState implements TaxState {
    @Override
    public String getName() {
        return "Huy";
    }

    @Override
    public void reviewTaxPolicy(Product product) {
        System.out.println("Yeu cau da huy, khong the review.");
    }

    @Override
    public void calculateTax(Product product) {
        System.out.println("Yeu cau da huy, khong the tinh thue.");
    }

    @Override
    public void finalizeTax(Product product) {
        System.out.println("Yeu cau da huy, khong the chot thue.");
    }

    @Override
    public void cancelTax(Product product) {
        System.out.println("Yeu cau da o trang thai Huy.");
    }
}
