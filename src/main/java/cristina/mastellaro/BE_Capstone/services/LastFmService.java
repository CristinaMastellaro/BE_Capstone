package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.exceptions.LastFmException;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Slf4j
public class LastFmService {
    private final WebClient webClient;
    @Autowired
    private List<String> apiKeys;

    @Autowired
    public LastFmService(@Qualifier("lastFmWebClient") WebClient webClientLastFm) {
        this.webClient = webClientLastFm;
    }

    // For mood
    public Mono<LastFmResponseDTO> findSongsByMood(String mood) {
        System.out.println("mood " + mood);
        String url = UriComponentsBuilder
                .fromHttpUrl("http://ws.audioscrobbler.com/2.0/")
                .queryParam("method", "tag.getTopTracks")
                .queryParam("tag", mood)
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

}
