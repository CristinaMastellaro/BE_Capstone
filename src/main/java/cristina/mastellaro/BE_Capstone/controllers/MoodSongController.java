package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.MoodSong;
import cristina.mastellaro.BE_Capstone.services.MoodSongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/moodsongs")
public class MoodSongController {
    @Autowired
    private MoodSongService msServ;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MoodSong saveMoodSong() {
    }

    @GetMapping("/{moodName}")
    public List<MoodSong> getSongsByMoodName() {
    }
}
