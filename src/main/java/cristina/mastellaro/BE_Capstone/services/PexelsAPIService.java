package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.exceptions.ClientPexelsException;
import cristina.mastellaro.BE_Capstone.payloads.PexelsResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Slf4j
public class PexelsAPIService {
    private final WebClient webClient;
    @Autowired
    private List<String> apiKeys;

    @Autowired
    public PexelsAPIService(@Qualifier("pexelsWebClient") WebClient webClientPexels) {
        this.webClient = webClientPexels;
    }

    public Mono<PexelsResponseDTO> findImage(String image) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search")
                        .queryParam("query", image)
                        .build())
                .header("Authorization", apiKeys.get(1))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Error 4xx from Pexels: {}", body);
                                    return Mono.error(new ClientPexelsException());
                                }))
                .onStatus(HttpStatusCode::is5xxServerError, res -> res.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Error 5xx from Pexels: {}", body);
                            return Mono.error(new RuntimeException("Server Error from Pexels"));
                        }))
                .bodyToMono(PexelsResponseDTO.class)
                .onErrorResume(e -> {
                    log.error("Generic error from Pexels: {}", e.getMessage());
                    return Mono.error((new RuntimeException("Pexels is temporarily not available")));
                });
    }

//    public Mono<String> getPicturesFromPexels(String query) {
//        WebClient client = WebClient.create("https://api.pexels.com/v1");
//
//        WebClient.UriSpec<WebClient.RequestBodySpec> uriSpec = client.post();
//
//        WebClient.RequestBodySpec bodySpec = uriSpec.uri("/search");
//
//        WebClient.ResponseSpec responseSpec = headersSpec.header(
//                        HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
//                .acceptCharset(StandardCharsets.UTF_8)
//                .ifNoneMatch("*")
//                .ifModifiedSince(ZonedDateTime.now())
//                .retrieve();
//        return webClientPexels.get()
//                .uri("/search?q=" + query)
//                .retrieve()
//                .onStatus(HttpStatusCode::is4xxClientError, response ->
//                        Mono.error(new RuntimeException("Client Error: " + response.statusCode())))
//                .onStatus(HttpStatusCode::is5xxServerError, response ->
//                        Mono.error(new RuntimeException("Server Error: " + response.statusCode())))
//                .bodyToMono(String.class);
//
//    }
//
}
