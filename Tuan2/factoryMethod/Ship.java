package factoryMethod;

public class Ship implements Transport {

    @Override
    public void deliver() {
        System.out.println("Delivering by sea using a ship.");
    }
}

