package bai2.model.state;

import bai2.model.Product;

public class NewTaxState implements TaxState {
    @Override
    public String getName() {
        return "Moi tao";
    }

    @Override
    public void reviewTaxPolicy(Product product) {
        System.out.println("[Moi tao] Kiem tra chinh sach thue cho san pham: " + product.getName());
    }

    @Override
    public void calculateTax(Product product) {
        System.out.println("[Moi tao] Bat dau tinh thue.");
        product.setState(new CalculatingTaxState());
        product.calculateTax();
    }

    @Override
    public void finalizeTax(Product product) {
        System.out.println("Khong the chot thue khi chua tinh thue.");
    }

    @Override
    public void cancelTax(Product product) {
        System.out.println("[Moi tao] Huy yeu cau tinh thue.");
        product.setState(new CancelledTaxState());
    }
}
