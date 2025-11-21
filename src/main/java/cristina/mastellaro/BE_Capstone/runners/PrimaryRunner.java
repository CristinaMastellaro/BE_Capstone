package cristina.mastellaro.BE_Capstone.runners;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cristina.mastellaro.BE_Capstone.entities.Country;
import cristina.mastellaro.BE_Capstone.services.CountryService;
import cristina.mastellaro.BE_Capstone.services.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class PrimaryRunner implements CommandLineRunner {

    @Autowired
    private MoodService mServ;
    @Autowired
    private CountryService cServ;

    @Override
    public void run(String... args) throws Exception {
        // Save moods in db
        List<String> moods = List.of("Happy", "Angry", "Energetic", "Love", "Relaxed", "Moody", "Sad", "I don't know", "Other");
        moods.forEach(mood -> {
            if (!mServ.existsMoodByName(mood)) {
                mServ.saveMood(mood);
            }
        });

        if (cServ.numberOfCountriesInDb() == 0) {
            ObjectMapper mapper = new ObjectMapper();

            InputStream is = getClass().getResourceAsStream("/countries.json");

            List<Country> countries = mapper.readValue(is, new TypeReference<List<Country>>() {
            });

            countries.forEach(country -> cServ.saveCountry(country.getName(), country.getCode()));
        }

    }
}

