package cristina.mastellaro.BE_Capstone;

import cristina.mastellaro.BE_Capstone.services.MusicService;
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
    CommandLineRunner ginoGinetto(MusicService client) {
        return args -> {
//            List<Mono<StriveSchoolResponseDTO>> images = client.findSongByMood("sad");
//            images.forEach(song -> song.subscribe(System.out::println));
        };
    }

}
