package cristina.mastellaro.BE_Capstone.exceptions;

public class ResCountriesException extends RuntimeException {
    public ResCountriesException() {
        super("Error from ResCountries client");
    }

    public ResCountriesException(String message) {
        super(message);
    }
}
