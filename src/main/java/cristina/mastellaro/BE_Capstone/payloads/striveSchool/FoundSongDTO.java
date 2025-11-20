package cristina.mastellaro.BE_Capstone.payloads.striveSchool;

import cristina.mastellaro.BE_Capstone.payloads.lastFm.ArtistLastFmDTO;

public record FoundSongDTO(
        String id,
        String title,
        String title_short,
        String preview,
        ArtistLastFmDTO artist,
        AlbumDTO album
) {
}
