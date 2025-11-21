package cristina.mastellaro.BE_Capstone.payloads;

public record UserChangeInfoDTO(
        String oldUsername,
        String username,
        String name,
        String surname,
        String email
) {
}
