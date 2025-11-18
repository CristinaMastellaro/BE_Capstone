package cristina.mastellaro.BE_Capstone;

import cristina.mastellaro.BE_Capstone.services.PexelsAPIService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BeCapstoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeCapstoneApplication.class, args);
    }

    @Bean
    CommandLineRunner ginoGinetto(PexelsAPIService client) {
        return args -> {
//            Mono<PexelsResponseDTO> images = client.findImage("cats");
//            images.subscribe(System.out::println);
        };
    }

}
