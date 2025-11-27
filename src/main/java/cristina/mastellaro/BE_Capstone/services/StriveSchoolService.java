package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.exceptions.ClientPexelsException;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.FoundSongDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.StriveSchoolResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class StriveSchoolService {
    private final WebClient webClient;

    @Autowired
    public StriveSchoolService(@Qualifier("striveSchoolWebClient") WebClient webClientStriveSchool) {
        this.webClient = webClientStriveSchool;
    }

    public Mono<StriveSchoolResponseDTO> searchSong(String query) {
        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path("/search")
                                .queryParam("q", query)
                                .build()
                )
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Error 4xx from strive-school: {}", body);
                                    return Mono.error(new ClientPexelsException("Client error from strive-school"));
                                }))
                .onStatus(HttpStatusCode::is5xxServerError, res -> res.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Error 5xx from strive-school: {}", body);
                            return Mono.error(new RuntimeException("Server Error from strive-school"));
                        }))
                .bodyToMono(StriveSchoolResponseDTO.class);
    }

    public Mono<FoundSongDTO> findSpecificSong(String id) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/track/" + id).build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Error 4xx from strive-school: {}", body);
                                    return Mono.error(new ClientPexelsException("Client error from strive-school"));
                                }))
                .onStatus(HttpStatusCode::is5xxServerError, res -> res.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Error 5xx from strive-school: {}", body);
                            return Mono.error(new RuntimeException("Server Error from strive-school"));
                        }))
                .bodyToMono(FoundSongDTO.class);
    }
}
