package cristina.mastellaro.BE_Capstone.payloads;

public record LoginResponseDTO(
        String username,
        String name,
        String surname,
        String email,
        String avatar,
        String token
) {
}
