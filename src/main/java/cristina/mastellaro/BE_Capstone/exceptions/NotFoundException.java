package cristina.mastellaro.BE_Capstone.exceptions;

import java.util.UUID;

public class NotFoundException extends RuntimeException {
    public NotFoundException(UUID id) {
        super("No element with id " + id + " found");
    }
}
