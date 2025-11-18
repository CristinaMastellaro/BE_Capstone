package cristina.mastellaro.BE_Capstone.payloads.striveSchool;

import java.util.List;

public record StriveSchoolResponseDTO(
        List<FoundSongDTO> data
) {
}
