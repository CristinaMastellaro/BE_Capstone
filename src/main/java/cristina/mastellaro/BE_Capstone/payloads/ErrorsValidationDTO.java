package cristina.mastellaro.BE_Capstone.payloads;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorsValidationDTO(
        String message, List<String> listErrors, LocalDateTime timeStamp
) {
}
