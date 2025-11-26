package cristina.mastellaro.BE_Capstone.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class ExternalAPIConfig {

    @Bean
    public String getApiKeyLastFm(@Value("${lastfm.api.key}") String apiKeyLastfm) {
        return apiKeyLastfm;
    }

    @Bean
    public WebClient pexelsWebClient() {
        return WebClient.builder().baseUrl("https://api.pexels.com/v1").build();
    }

    @Bean
    public WebClient countryWebClient() {
//        return WebClient.builder().baseUrl("https://restcountries.com/v3.1/alpha").build();
        return WebClient.builder().baseUrl("https://api.first.org/data/v1/countries").build();
    }

    @Bean
    public WebClient lastFmWebClient() {
        return WebClient.builder().baseUrl("http://ws.audioscrobbler.com/2.0").build();
    }

    @Bean
    public WebClient striveSchoolWebClient() {
        return WebClient.builder().baseUrl("https://striveschool-api.herokuapp.com/api/deezer").build();
    }

    // For external APIs
//    @Bean
//    public WebClient webClientPexels() {
//        return WebClient.builder()
//                .baseUrl("https://api.pexels.com/v1")
//                .build();
//    }
}
