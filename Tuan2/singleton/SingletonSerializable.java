package singleton;

import java.io.ObjectStreamException;
import java.io.Serializable;

public class SingletonSerializable implements Serializable {

    private static final long serialVersionUID = 1L;

    private SingletonSerializable() {
    }

    private static class SingletonHelper {
        private static final SingletonSerializable INSTANCE = new SingletonSerializable();
    }

    public static SingletonSerializable getInstance() {
        return SingletonHelper.INSTANCE;
    }

    private Object readResolve() throws ObjectStreamException {
        return SingletonHelper.INSTANCE;
    }
}

