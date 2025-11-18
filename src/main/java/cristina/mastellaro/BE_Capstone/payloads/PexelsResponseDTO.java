package cristina.mastellaro.BE_Capstone.payloads;

import java.util.List;

public record PexelsResponseDTO(
        int total_results,
        int page,
        int per_page,
        List<PhotoDTO> photos
) {
}
