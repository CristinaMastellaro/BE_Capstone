package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Country;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
import cristina.mastellaro.BE_Capstone.payloads.country.CountryResponseDTO;
import cristina.mastellaro.BE_Capstone.repositories.CountryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CountryService {
    //    private final WebClient webClient;
    @Autowired
    private CountryRepository cRepo;

//    @Autowired
//    public CountryService(@Qualifier("countryWebClient") WebClient webClientCountry) {
//        this.webClient = webClientCountry;
//    }

    public void saveCountry(String name, String code) {
        Country country = new Country(code, name);

        cRepo.save(country);

        log.info(name + " has been saved in the db!");
    }

    public int numberOfCountriesInDb() {
        return cRepo.findAll().size();
    }

    public CountryResponseDTO getCountryFromCode(String code) {
        String name = cRepo.findById(code).orElseThrow(() -> new NotFoundException("No country found by the code " + code, false)).getName();
        return new CountryResponseDTO(name);
    }

    public List<String> countriesNames() {
        return cRepo.findAllNames();
    }

//    public Flux<CountryInfoDTO> getNameCountry(String code) {
//        return webClient.get()
//                .uri(uriBuilder -> uriBuilder.path("/" + code).build())
//                .retrieve()
//                .onStatus(HttpStatusCode::is4xxClientError, response ->
//                        response.bodyToMono(String.class)
//                                .flatMap(body -> {
//                                    log.error("Error 4xx from ResCountries: {}", body);
//                                    return Mono.error(new ResCountriesException());
//                                }))
//                .onStatus(HttpStatusCode::is5xxServerError, res -> res.bodyToMono(String.class)
//                        .flatMap(body -> {
//                            log.error("Error 5xx from ResCountries: {}", body);
//                            return Mono.error(new RuntimeException("Server Error from ResCountries"));
//                        }))
//                .bodyToFlux(CountryInfoDTO.class)
//                .onErrorResume(e -> {
//                    log.error("Generic error from Pexels: {}", e.getMessage());
//                    return Mono.error((new RuntimeException("ResCountries is temporarily not available")));
//                });
//    }
}
