package cristina.mastellaro.BE_Capstone.exceptions;

public class AlreadyUsedException extends RuntimeException {
    public AlreadyUsedException(String message) {
        super(message);
    }
}
