package cristina.mastellaro.BE_Capstone.payloads;

import jakarta.validation.constraints.NotBlank;

public record SongDTO(
        @NotBlank
        String id,
        @NotBlank
        String cover,
        @NotBlank
        String title,
        @NotBlank
        String author,
        @NotBlank
        String preview
) {
}
