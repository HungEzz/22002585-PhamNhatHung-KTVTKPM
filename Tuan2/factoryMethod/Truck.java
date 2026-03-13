package factoryMethod;

public class Truck implements Transport {

    @Override
    public void deliver() {
        System.out.println("Delivering by road using a truck.");
    }
}

