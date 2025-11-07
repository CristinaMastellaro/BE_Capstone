package cristina.mastellaro.BE_Capstone.payloads;

import java.time.LocalDateTime;

public record ErrorsDTO(String message, LocalDateTime timeStamp) {
}
