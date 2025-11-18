package cristina.mastellaro.BE_Capstone.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Configuration
public class Config {

    @Bean
    public List<String> getApiKeys(@Value("${lastfm.api.key}") String apiKeyLastfm, @Value("${pexels.api.key}") String apiKeyPexels) {
        return List.of(apiKeyLastfm, apiKeyPexels);
    }

    @Bean
    public WebClient pexelsWebClient() {
        return WebClient.builder().baseUrl("https://api.pexels.com/v1").build();
    }

    @Bean
    public WebClient countryWebClient() {
        return WebClient.builder().baseUrl("https://restcountries.com/v3.1/alpha").build();
    }

    @Bean
    public WebClient lastFmWebClient() {
        return WebClient.builder().baseUrl("http://ws.audioscrobbler.com/2.0").build();
    }

    // For external APIs
//    @Bean
//    public WebClient webClientPexels() {
//        return WebClient.builder()
//                .baseUrl("https://api.pexels.com/v1")
//                .build();
//    }
}
