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
import java.util.concurrent.atomic.AtomicBoolean;

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

        return UriUtils.encodeQueryParam(normalized, StandardCharsets.UTF_8);
    }

    //    public List<FoundSongDTO> findSongByMood(String mood) {
    public Flux<FoundSongDTO> findSongByMood(String mood) {

        AtomicBoolean stop = new AtomicBoolean(false);

        return lFmServ.getInfoMoodSongsToSearch(mood)
                .flatMap(track -> {

                    if (stop.get()) {
                        return Mono.empty();
                    }

                    return ssServ.searchSong(normalize(track.name()))
                            .map(striveSchoolResponseDTO -> {
                                try {
                                    if (striveSchoolResponseDTO == null) return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name()))
                                                            && normalize(normalize(track.name())).equalsIgnoreCase(normalize(singleTrackStrSch.title_short())))
                                            .findFirst()
                                            .orElse(null);
                                } catch (Exception e) {
                                    if (e.getMessage().equalsIgnoreCase("Client error from strive-school")) {
                                        stop.set(true);
                                    }
                                    return null;
                                }
                            }).onErrorResume(e -> {
                                System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());
                                return Mono.empty();
                            });
                }, 4);
    }

    public Flux<FoundSongDTO> findSongsByCountry(String country) {

        AtomicBoolean stop = new AtomicBoolean(false);

        return lFmServ.getInfoCountrySongsToSearch(country)
                .flatMap(track -> {
                    if (stop.get()) {
                        return Mono.empty();
                    }
                    return ssServ.searchSong(normalize(track.name()))
                            .map(striveSchoolResponseDTO -> {
                                try {
                                    if (striveSchoolResponseDTO == null) return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name()))
                                                            && normalize(singleTrackStrSch.title_short()).equalsIgnoreCase(normalize(track.name())))
                                            .findFirst()
                                            .orElse(null);
                                } catch (Exception e) {
                                    if (e.getMessage().equalsIgnoreCase("Client error from strive-school")) {
                                        stop.set(true);
                                    }
                                    return null;
                                }
                            }).onErrorResume(e -> {
                                System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());
                                return Mono.empty();
                            });
                }, 4);
    }
}
