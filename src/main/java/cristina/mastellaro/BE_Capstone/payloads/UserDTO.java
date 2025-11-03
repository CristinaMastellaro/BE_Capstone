package cristina.mastellaro.BE_Capstone.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserDTO(
        String name,
        String surname,
        @NotBlank
        @Size(min = 4)
        String username,
        @NotBlank
        @Email
        String email,
        @NotBlank
        @Size(min = 8)
        @Pattern(regexp = "^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", message = "The password must have at least 8 characters and contain at least one letter, one number and one special character")
        String password
) {
}
