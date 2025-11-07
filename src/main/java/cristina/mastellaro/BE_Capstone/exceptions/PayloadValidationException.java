package cristina.mastellaro.BE_Capstone.exceptions;

import lombok.Getter;

import java.util.List;

@Getter
public class PayloadValidationException extends RuntimeException {
    private List<String> errorsMessages;

    public PayloadValidationException(List<String> errorsMessages) {
        super("The payload isn't compile correctly");
        this.errorsMessages = errorsMessages;
    }
}
