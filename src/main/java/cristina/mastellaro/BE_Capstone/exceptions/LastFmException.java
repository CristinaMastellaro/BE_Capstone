package cristina.mastellaro.BE_Capstone.exceptions;

public class LastFmException extends RuntimeException {
    public LastFmException() {
        super("Client error from LastFm");
    }

    public LastFmException(String message) {
        super(message);
    }
}
