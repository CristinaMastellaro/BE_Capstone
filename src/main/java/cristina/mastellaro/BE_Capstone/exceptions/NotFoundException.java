package cristina.mastellaro.BE_Capstone.exceptions;

import java.util.UUID;

public class NotFoundException extends RuntimeException {
    public NotFoundException(UUID id) {
        super("No element with id " + id + " found");
    }

    public NotFoundException(String username) {
        super("No user with username " + username + " found");
    }

    public NotFoundException(String mood, String typeMood) {
        super("No mood named " + mood + " found");
    }
}
