package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.StriveSchoolResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class MusicService {
    @Autowired
    private LastFmService lFmServ;
    @Autowired
    private StriveSchoolService ssServ;

    public List<Mono<StriveSchoolResponseDTO>> findSongByMood(String mood) {
//        System.out.println("I'm starting mu search");
        Mono<LastFmResponseDTO> searchedSongs = lFmServ.findSongsByMood(mood);

//        System.out.println("Searched songs by Last.fm:");
//        searchedSongs.subscribe(System.out::println);

        List<Mono<StriveSchoolResponseDTO>> songs = new ArrayList<>();

        searchedSongs.subscribe(allSongs -> {
            allSongs.tracks().track().forEach(song -> {
                Mono<StriveSchoolResponseDTO> foundSong =
                        ssServ.searchSong(Normalizer.normalize(song.name(), Normalizer.Form.NFD)
                                .replaceAll("/[\u0300-\u036f]/g", "") +
                                Normalizer.normalize(song.artist().name(), Normalizer.Form.NFD)
                                        .replaceAll("/[\u0300-\u036f]/g", ""));
//                System.out.println("song: " + foundSong.subscribe(System.out::println));
                songs.add(foundSong);
            });
        });

        return songs;
    }
}
