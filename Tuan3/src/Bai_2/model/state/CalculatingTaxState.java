package bai2.model.state;

import bai2.model.Product;

public class CalculatingTaxState implements TaxState {
    @Override
    public String getName() {
        return "Dang tinh thue";
    }

    @Override
    public void reviewTaxPolicy(Product product) {
        System.out.println("Dang trong qua trinh tinh thue, khong can review lai.");
    }

    @Override
    public void calculateTax(Product product) {
        System.out.println("[Dang tinh thue] Thue co ban cua " + product.getName() + ": " + product.calculateBaseTax() + " VND");
    }

    @Override
    public void finalizeTax(Product product) {
        System.out.println("[Dang tinh thue] Chot ket qua tinh thue.");
        product.setState(new FinalizedTaxState());
    }

    @Override
    public void cancelTax(Product product) {
        System.out.println("[Dang tinh thue] Huy yeu cau tinh thue.");
        product.setState(new CancelledTaxState());
    }
}
