package cristina.mastellaro.BE_Capstone.payloads;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PlaylistDTO(
        @NotBlank
        String name,
        List<SongDTO> songs
) {
}
