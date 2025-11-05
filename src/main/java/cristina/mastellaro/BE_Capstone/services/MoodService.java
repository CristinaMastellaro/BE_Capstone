package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Mood;
import cristina.mastellaro.BE_Capstone.repositories.MoodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class MoodService {
    @Autowired
    private MoodRepository mRepo;

//    if (!mServ.existsMoodByName(mood)) {
//                mServ.save(mood);
//            }

    public boolean existsMoodByName(String name) {
        return mRepo.existsByName(name);
    }

    public Mood saveMood(String name) {
        Mood newMood = new Mood(name);
        mRepo.save(newMood);
        log.info("Mood " + name + " saved");
        return newMood;
    }

    public List<Mood> findAllMoods() {
        return mRepo.findAll();
    }
}
