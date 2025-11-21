package cristina.mastellaro.BE_Capstone.payloads;

public record ChangeInfoUserDTO(
        String name,
        String surname,
        String username,
        String email
) {
}
