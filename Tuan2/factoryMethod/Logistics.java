package factoryMethod;

public abstract class Logistics {

    // Factory Method
    protected abstract Transport createTransport();

    // Business method using the Product
    public void planDelivery() {
        Transport transport = createTransport();
        transport.deliver();
    }
}

