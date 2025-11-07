package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.Mood;
import cristina.mastellaro.BE_Capstone.services.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
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
        List<Mood> totalMoods = new ArrayList<>(mServ.findAllMoods().stream().sorted(Comparator.comparing(Mood::getName)).toList());

        Mood other = mServ.findMoodByName("Other");
        Mood iDontKnow = mServ.findMoodByName("I don't know");
        Mood relaxed = mServ.findMoodByName("Relaxed");

        totalMoods.removeIf(mood -> mood.getName().equals("Other") || mood.getName().equals("I don't know") || mood.getName().equals("Relaxed"));
        totalMoods.addLast(iDontKnow);
        totalMoods.addLast(other);
        totalMoods.addFirst(relaxed);
        return totalMoods;
    }

}
