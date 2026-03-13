package abstractFactory;

public class Main {

    public static void main(String[] args) {
        Computer pc = ComputerFactory.getComputer(
                new PCFactory("16 GB", "512 GB SSD", "Intel i5"));
        Computer server = ComputerFactory.getComputer(
                new ServerFactory("64 GB", "4 TB SSD", "Xeon"));

        System.out.println("PC config: " + pc);
        System.out.println("Server config: " + server);
    }
}

