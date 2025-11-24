package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.exceptions.LastFmException;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.AllTracksDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Slf4j
public class LastFmService {
    private final WebClient webClient;
    @Autowired
    private List<String> apiKeys;
    @Autowired
    private StriveSchoolService ssServ;

    @Autowired
    public LastFmService(@Qualifier("lastFmWebClient") WebClient webClientLastFm) {
        this.webClient = webClientLastFm;
    }

    // For mood
    public Mono<LastFmResponseDTO> findSongsByMood(String mood) {
        String url = UriComponentsBuilder
                .fromHttpUrl("http://ws.audioscrobbler.com/2.0/")
                .queryParam("method", "tag.getTopTracks")
                .queryParam("tag", mood)
                .queryParam("limit", 25)
                .queryParam("api_key", apiKeys.getFirst())
                .queryParam("format", "json")
                .toUriString();
        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Error 4xx from Last.fm");
                                return Mono.error(new LastFmException());
                            });
                }).onStatus(HttpStatusCode::is5xxServerError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Server error from Last.fm");
                                return Mono.error(new RuntimeException("Server error from Last.fm"));
                            });
                }).bodyToMono(LastFmResponseDTO.class);
    }

    public Flux<AllTracksDTO> getInfoMoodSongsToSearch(String mood) {
        return findSongsByMood(mood).flatMapMany(res -> Flux.fromIterable(res.tracks().track()));
    }

    // For country
    public Mono<LastFmResponseDTO> findSongsByCountry(String country) {
        String url = UriComponentsBuilder
                .fromHttpUrl("http://ws.audioscrobbler.com/2.0/")
                .queryParam("method", "geo.getTopTracks")
                .queryParam("country", country)
                .queryParam("api_key", apiKeys.getFirst())
                .queryParam("format", "json")
                .queryParam("limit", "40")
                .toUriString();
        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Error 4xx from Last.fm");
                                return Mono.error(new LastFmException());
                            });
                }).onStatus(HttpStatusCode::is5xxServerError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Server error from Last.fm");
                                return Mono.error(new RuntimeException("Server error from Last.fm"));
                            });
                }).bodyToMono(LastFmResponseDTO.class);
    }

    public Flux<AllTracksDTO> getInfoCountrySongsToSearch(String country) {
        return findSongsByCountry(country).flatMapMany(res -> Flux.fromIterable(res.tracks().track()));
    }

    // For period
    public Mono<LastFmResponseDTO> findSongsByPeriod(String period) {
        String url = UriComponentsBuilder
                .fromHttpUrl("http://ws.audioscrobbler.com/2.0/")
                .queryParam("method", "tag.getTopTracks")
                .queryParam("tag", period)
                .queryParam("limit", 45)
                .queryParam("api_key", apiKeys.getFirst())
                .queryParam("format", "json")
                .toUriString();
        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Error 4xx from Last.fm");
                                return Mono.error(new LastFmException());
                            });
                }).onStatus(HttpStatusCode::is5xxServerError, res -> {
                    return res.bodyToMono(String.class)
                            .flatMap(body -> {
                                log.error("Server error from Last.fm");
                                return Mono.error(new RuntimeException("Server error from Last.fm"));
                            });
                }).bodyToMono(LastFmResponseDTO.class);
    }

    public Flux<AllTracksDTO> getInfoPeriodSongsToSearch(String period) {
        return findSongsByPeriod(period).flatMapMany(res -> Flux.fromIterable(res.tracks().track()));
    }

}
