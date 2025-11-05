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
        List<String> moods = List.of("Sad", "Happy", "Angry", "I don't know", "Quiet", "Relaxed", "Annoyed", "Energetic", "In love", "Other");
        moods.forEach(mood -> {
            if (!mServ.existsMoodByName(mood)) {
                mServ.saveMood(mood);
            }
        });
    }
}

