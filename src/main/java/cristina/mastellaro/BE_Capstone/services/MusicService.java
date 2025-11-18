package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.payloads.striveSchool.FoundSongDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;

@Service
@Slf4j
public class MusicService {
    @Autowired
    private LastFmService lFmServ;
    @Autowired
    private StriveSchoolService ssServ;

    private static String normalize(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);

        normalized = normalized.replaceAll(" ", "");
        normalized = normalized.replaceAll("\\p{M}", "");
        System.out.println("UriUtils.encodeQueryParam(normalized, StandardCharsets.UTF_8) " +
                UriUtils.encodeQueryParam(normalized, StandardCharsets.UTF_8));

        return UriUtils.encodeQueryParam(normalized, StandardCharsets.UTF_8);
    }

    //    public List<FoundSongDTO> findSongByMood(String mood) {
    public Flux<FoundSongDTO> findSongByMood(String mood) {

        return lFmServ.getInfoMoodSongsToSearch(mood)
                .flatMap(track ->
                        ssServ.searchSong(normalize(track.artist().name()))
                                .map(striveSchoolResponseDTO -> {
                                    if (striveSchoolResponseDTO == null) return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name()))
                                                            && normalize(singleTrackStrSch.title_short()).equalsIgnoreCase(normalize(track.name())))
                                            .findFirst()
                                            .orElse(null);
                                }).onErrorResume(e -> {
                                    System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());
                                    return Mono.empty();
                                }), 50);
//                .map(striveRes ->{
//                    if (striveRes.data() != null &&
//                            !striveRes.data().isEmpty()) {
//                        if (striveRes.data().get.artist().name().equals(Normalizer.normalize(songInfo.artist().name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", ""))
//                                && song.title_short().equals(Normalizer.normalize(songInfo.name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", ""))))
//                    }
//                        }

//                .map(song -> new FoundSongDTO(song.))
//        searchedSongs.flatMap(track ->
//                ssServ.searchSong(Normalizer.normalize(songInfo.name(), Normalizer.Form.NFD)
//                        .replaceAll("/[\u0300-\u036f]/g", "") +
//                        Normalizer.normalize(songInfo.artist().name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", "")));

//        List<Mono<StriveSchoolResponseDTO>> songs = new ArrayList<>();
//        List<FoundSongDTO> songs = new ArrayList<>();

        // So, based on the results from Last.fm (that would be the title and the author of the songs), now I should search each pair title-author
        // through the strive-school api
//        searchedSongs.subscribe(allSongs -> {
//            allSongs.tracks().track().forEach(songInfo -> {
//                // The api will give me a list of songs that have a match with the query
//                Mono<StriveSchoolResponseDTO> foundSongs =
//                        ssServ.searchSong(Normalizer.normalize(songInfo.name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", "") +
//                                Normalizer.normalize(songInfo.artist().name(), Normalizer.Form.NFD)
//                                        .replaceAll("/[\u0300-\u036f]/g", ""));
//                // I don't need all of them:
//                // I need only one song that matches exactly both the title and the author
//                Mono<List<FoundSongDTO>> correspondences = foundSongs.map(data -> data.data().stream().filter(song ->
//                        song.artist().name().equals(Normalizer.normalize(songInfo.artist().name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", ""))
//                                && song.title_short().equals(Normalizer.normalize(songInfo.name(), Normalizer.Form.NFD)
//                                .replaceAll("/[\u0300-\u036f]/g", ""))
//                ).toList());
//                // Filter still gives me a list of answers. Since all the songs should match the title and author of the query,
//                // if I choose the first element of the filtered array, it will be ok.
//                correspondences.subscribe(song -> {
//                            System.out.println("song " + song);
//                            songs.add(song.getFirst());
//                        }
////                        songs.add(song.stream().findFirst().orElseThrow(() -> new NotFoundException("No song found")))
//                );
//            });
//            // This procedure will be applied to all the results from the search with the Last.fm api
//        });
//
//        return songs;
    }
}
