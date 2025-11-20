package cristina.mastellaro.BE_Capstone.payloads.lastFm;

import java.util.List;

public record TrackLastFmDTO(
        List<AllTracksDTO> track
) {
}
