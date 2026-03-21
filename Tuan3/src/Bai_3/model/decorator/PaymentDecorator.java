package bai3.model.decorator;

public abstract class PaymentDecorator implements PaymentComponent {
    protected final PaymentComponent component;

    protected PaymentDecorator(PaymentComponent component) {
        this.component = component;
    }
}
