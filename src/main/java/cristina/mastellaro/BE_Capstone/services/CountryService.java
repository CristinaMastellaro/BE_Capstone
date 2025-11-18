package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.exceptions.ResCountriesException;
import cristina.mastellaro.BE_Capstone.payloads.country.CountryInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class CountryService {
    private final WebClient webClient;

    @Autowired
    public CountryService(@Qualifier("countryWebClient") WebClient webClientCountry) {
        this.webClient = webClientCountry;
    }

    public Flux<CountryInfoDTO> getNameCountry(String code) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/" + code).build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Error 4xx from ResCountries: {}", body);
                                    return Mono.error(new ResCountriesException());
                                }))
                .onStatus(HttpStatusCode::is5xxServerError, res -> res.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Error 5xx from ResCountries: {}", body);
                            return Mono.error(new RuntimeException("Server Error from ResCountries"));
                        }))
                .bodyToFlux(CountryInfoDTO.class)
                .onErrorResume(e -> {
                    log.error("Generic error from Pexels: {}", e.getMessage());
                    return Mono.error((new RuntimeException("ResCountries is temporarily not available")));
                });
    }
}
