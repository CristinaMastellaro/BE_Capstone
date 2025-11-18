package cristina.mastellaro.BE_Capstone;

import cristina.mastellaro.BE_Capstone.payloads.PexelsResponseDTO;
import cristina.mastellaro.BE_Capstone.services.ExternalAPIsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class BeCapstoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeCapstoneApplication.class, args);
    }

    @Bean
    CommandLineRunner ginoGinetto(ExternalAPIsService client) {
        return args -> {
            Mono<PexelsResponseDTO> images = client.findImage("cats");
            images.subscribe(System.out::println);
        };
    }

}
