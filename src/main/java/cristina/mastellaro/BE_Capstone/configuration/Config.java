package cristina.mastellaro.BE_Capstone.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    public String getApiKeyFromLastFm(@Value("${lastfm.api.key}") String apiKeyLastfm) {
        return apiKeyLastfm;
    }
}
