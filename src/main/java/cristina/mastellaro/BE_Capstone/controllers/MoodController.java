package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.Mood;
import cristina.mastellaro.BE_Capstone.services.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/moods")
public class MoodController {
    @Autowired
    private MoodService mServ;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    public Mood saveMood() {
    public void saveMood() {
    }

    @GetMapping("/{moodName}")
//    public Mood findMoodByName() {
    public void findMoodByName() {
    }

    @GetMapping
    public List<Mood> findAllMoods() {
        return mServ.findAllMoods();
    }

}
