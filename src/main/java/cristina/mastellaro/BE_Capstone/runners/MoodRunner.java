package cristina.mastellaro.BE_Capstone.runners;

import cristina.mastellaro.BE_Capstone.services.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MoodRunner implements CommandLineRunner {

    @Autowired
    private MoodService mServ;

    @Override
    public void run(String... args) throws Exception {
        List<String> moods = List.of("Happy", "Angry", "Energetic", "In love", "Relaxed", "Sad", "I don't know", "Other");
        moods.forEach(mood -> {
            if (!mServ.existsMoodByName(mood)) {
                mServ.saveMood(mood);
            }
        });
    }
}

