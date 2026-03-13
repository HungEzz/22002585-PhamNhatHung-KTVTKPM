package abstractFactory;

public abstract class Computer {

    private final String ram;
    private final String hdd;
    private final String cpu;

    protected Computer(String ram, String hdd, String cpu) {
        this.ram = ram;
        this.hdd = hdd;
        this.cpu = cpu;
    }

    public String getRam() {
        return ram;
    }

    public String getHdd() {
        return hdd;
    }

    public String getCpu() {
        return cpu;
    }

    @Override
    public String toString() {
        return "RAM=" + ram + ", HDD=" + hdd + ", CPU=" + cpu;
    }
}

