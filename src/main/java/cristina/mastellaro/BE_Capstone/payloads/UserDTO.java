package cristina.mastellaro.BE_Capstone.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserDTO(
        String name,
        String surname,
        @NotBlank(message = "The username must not be blank")
        @Size(min = 4, message = "The username must be at least 4 characters long")
        String username,
        @NotBlank(message = "The email must not be blank")
        @Email(message = "Write an email in the correct form")
        String email,
        @NotBlank(message = "The password must not be blank")
        @Size(min = 8, message = "The password must be at least 8 characters long")
        @Pattern(regexp = "^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", message = "The password must contain at least one letter, one number and one special character")
        String password
) {
}
