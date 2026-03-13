package factoryMethod;

public class Main {

    public static void main(String[] args) {
        // Client chọn loại Logistics (Concrete Creator)
        Logistics roadLogistics = new RoadLogistics();
        Logistics seaLogistics = new SeaLogistics();

        System.out.println("Road logistics:");
        roadLogistics.planDelivery();

        System.out.println("Sea logistics:");
        seaLogistics.planDelivery();
    }
}

