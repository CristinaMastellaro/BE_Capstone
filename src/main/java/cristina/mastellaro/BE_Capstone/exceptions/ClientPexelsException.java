package cristina.mastellaro.BE_Capstone.exceptions;

public class ClientPexelsException extends RuntimeException {

    public ClientPexelsException() {
        super("Client error from Pexels");
    }

    public ClientPexelsException(String message) {
        super(message);
    }
}
