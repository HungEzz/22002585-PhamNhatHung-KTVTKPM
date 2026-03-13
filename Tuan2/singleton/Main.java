package singleton;

public class Main {

    public static void main(String[] args) {
        // Simple demo to show that all instances are the same inside each pattern
        System.out.println("Eager: " + (SingletonEager.getInstance() == SingletonEager.getInstance()));
        System.out.println("Lazy: " + (SingletonLazy.getInstance() == SingletonLazy.getInstance()));
        System.out.println("ThreadSafe: " + (SingletonThreadSafe.getInstance() == SingletonThreadSafe.getInstance()));
        System.out.println("DoubleChecked: " + (SingletonDoubleChecked.getInstance() == SingletonDoubleChecked.getInstance()));
        System.out.println("BillPugh: " + (BillPughSingleton.getInstance() == BillPughSingleton.getInstance()));
        System.out.println("Serializable: " + (SingletonSerializable.getInstance() == SingletonSerializable.getInstance()));

        SingletonEnum.INSTANCE.setValue(42);
        System.out.println("Enum value: " + SingletonEnum.INSTANCE.getValue());
    }
}

