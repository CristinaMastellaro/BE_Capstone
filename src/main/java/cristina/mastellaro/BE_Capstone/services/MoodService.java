package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Mood;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
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

    public Mood findMoodByName(String name) {
        return mRepo.findByName(name).orElseThrow(() -> new NotFoundException(name, ""));
    }

    public boolean existsMoodByName(String name) {
        return mRepo.existsByName(name);
    }

    public Mood saveMood(String name) {
        if (existsMoodByName(name)) throw new AlreadyUsedException("There is already a mood named " + name);
        Mood newMood = new Mood(name);
        mRepo.save(newMood);
        log.info("Mood " + name + " saved");
        return newMood;
    }

    public List<Mood> findAllMoods() {
        return mRepo.findAll();
    }
}
