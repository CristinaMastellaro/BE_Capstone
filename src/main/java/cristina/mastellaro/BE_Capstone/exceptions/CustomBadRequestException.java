package cristina.mastellaro.BE_Capstone.exceptions;

public class CustomBadRequestException extends RuntimeException {
    public CustomBadRequestException(String message) {
        super(message);
    }
}
