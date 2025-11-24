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

        return UriUtils.encodeQueryParam(normalized, StandardCharsets.UTF_8);
    }

    //    public List<FoundSongDTO> findSongByMood(String mood) {
    public Flux<FoundSongDTO> findSongByMood(String mood) {

        return lFmServ.getInfoMoodSongsToSearch(mood)
                .flatMap(track ->
                        ssServ.searchSong(normalize(track.name()))
                                .map(striveSchoolResponseDTO -> {

                                    if (striveSchoolResponseDTO == null)
                                        return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name())) &&
                                                            normalize(singleTrackStrSch.title_short()).equalsIgnoreCase(normalize(track.name()))
                                            )
                                            .findFirst()
                                            .orElse(null);
                                })
                                .onErrorResume(e -> {
                                    String msg = e.getMessage();

                                    System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());

                                    if (msg.contains("Client error")
                                            || msg.contains("Connection reset")
                                            || msg.contains("The connection observed an error")) {
                                        return Mono.error(new RuntimeException("STOP_FLOW"));
                                    }

                                    return Mono.empty();
                                }), 4
                )
                .onErrorResume(e -> {

                    if ("STOP_FLOW".equals(e.getMessage())) {
                        System.out.println("Flow interrupted");
                        return Flux.empty();
                    }
                    return Flux.error(e);
                });
    }

    public Flux<FoundSongDTO> findSongsByCountry(String country) {

        return lFmServ.getInfoCountrySongsToSearch(country)
                .flatMap(track ->
                        ssServ.searchSong(normalize(track.name()))
                                .map(striveSchoolResponseDTO -> {

                                    if (striveSchoolResponseDTO == null)
                                        return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name())) &&
                                                            normalize(singleTrackStrSch.title_short()).equalsIgnoreCase(normalize(track.name()))
                                            )
                                            .findFirst()
                                            .orElse(null);
                                })
                                .onErrorResume(e -> {
                                    String msg = e.getMessage();

                                    System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());

                                    if (msg.contains("Client error")
                                            || msg.contains("Connection reset")
                                            || msg.contains("The connection observed an error")) {
                                        return Mono.error(new RuntimeException("STOP_FLOW"));
                                    }

                                    return Mono.empty();
                                }), 4
                )
                .onErrorResume(e -> {

                    if ("STOP_FLOW".equals(e.getMessage())) {
                        System.out.println("Flow interrupted");
                        return Flux.empty();
                    }
                    return Flux.error(e);
                });
    }

    public Flux<FoundSongDTO> findSongByPeriod(String period) {

        return lFmServ.getInfoPeriodSongsToSearch(period)
                .flatMap(track ->
                        ssServ.searchSong(normalize(track.name()))
                                .map(striveSchoolResponseDTO -> {

                                    if (striveSchoolResponseDTO == null)
                                        return null;

                                    return striveSchoolResponseDTO.data().stream()
                                            .filter(singleTrackStrSch ->
                                                    normalize(singleTrackStrSch.artist().name()).equalsIgnoreCase(normalize(track.artist().name())) &&
                                                            normalize(singleTrackStrSch.title_short()).equalsIgnoreCase(normalize(track.name()))
                                            )
                                            .findFirst()
                                            .orElse(null);
                                })
                                .onErrorResume(e -> {
                                    String msg = e.getMessage();

                                    System.err.println("Error on track " + track.name() + " by artist " + track.artist().name() + ": " + e.getMessage());

                                    if (msg.contains("Client error")
                                            || msg.contains("Connection reset")
                                            || msg.contains("The connection observed an error")) {
                                        return Mono.error(new RuntimeException("STOP_FLOW"));
                                    }

                                    return Mono.empty();
                                }), 4
                )
                .onErrorResume(e -> {

                    if ("STOP_FLOW".equals(e.getMessage())) {
                        System.out.println("Flow interrupted");
                        return Flux.empty();
                    }
                    return Flux.error(e);
                });
    }
}

