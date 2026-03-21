package bai2;

import bai2.model.Product;
import bai2.model.decorator.BaseTax;
import bai2.model.decorator.EnvironmentalFeeDecorator;
import bai2.model.decorator.ImportDutyDecorator;
import bai2.model.decorator.LuxurySurchargeDecorator;
import bai2.model.decorator.TaxComponent;
import bai2.model.strategy.ExciseTaxStrategy;
import bai2.model.strategy.LuxuryTaxStrategy;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Bai 2: Tinh toan thue cho san pham ===");

        Product product = new Product("Nuoc hoa cao cap", 1200000);

        System.out.println("\n1) State Pattern:");
        product.reviewTaxPolicy();
        product.calculateTax();
        product.finalizeTax();
        product.cancelTax();

        System.out.println("\n2) Strategy Pattern:");
        product.setTaxStrategy(new ExciseTaxStrategy());
        System.out.println("Thue tieu thu: " + product.calculateBaseTax() + " VND");
        product.setTaxStrategy(new LuxuryTaxStrategy());
        System.out.println("Thue xa xi: " + product.calculateBaseTax() + " VND");

        System.out.println("\n3) Decorator Pattern:");
        TaxComponent taxComponent = new BaseTax(product);
        taxComponent = new EnvironmentalFeeDecorator(taxComponent);
        taxComponent = new ImportDutyDecorator(taxComponent);
        taxComponent = new LuxurySurchargeDecorator(taxComponent);

        System.out.println("Mo ta thue tong hop: " + taxComponent.getDescription());
        System.out.println("Tong thue phai nop: " + taxComponent.getTaxAmount() + " VND");

        System.out.println("\nKet luan:");
        System.out.println("- State quan ly quy trinh xu ly thue theo tung giai doan.");
        System.out.println("- Strategy cho phep thay doi cach tinh thue linh hoat theo loai san pham.");
        System.out.println("- Decorator cho phep cong don nhieu loai phi/thue bo sung ma khong sua lop goc.");
    }
}
