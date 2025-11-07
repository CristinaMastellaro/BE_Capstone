package cristina.mastellaro.BE_Capstone.payloads;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank(message = "The username must not be blank")
        String username,
        @NotBlank(message = "The password must not be blank")
        String password
) {
}
