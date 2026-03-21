package bai2.model.state;

import bai2.model.Product;

public class FinalizedTaxState implements TaxState {
    @Override
    public String getName() {
        return "Da chot thue";
    }

    @Override
    public void reviewTaxPolicy(Product product) {
        System.out.println("Thue da duoc chot, khong can review lai.");
    }

    @Override
    public void calculateTax(Product product) {
        System.out.println("Thue da duoc tinh va chot.");
    }

    @Override
    public void finalizeTax(Product product) {
        System.out.println("Trang thai hien tai da la Da chot thue.");
    }

    @Override
    public void cancelTax(Product product) {
        System.out.println("Khong the huy sau khi da chot thue.");
    }
}
