package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.Song;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.SongDTO;
import cristina.mastellaro.BE_Capstone.services.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/songs")
public class SongController {
    @Autowired
    private SongService sServ;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
//    public Song saveSong() {
    public Song saveSong(@RequestBody SongDTO newSong, BindingResult validation) {
        if (validation.hasErrors())
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fL -> fL.getDefaultMessage()).toList());
        return sServ.saveSong(newSong);
    }

    @GetMapping("/{idSong}")
    public Song findSongById(@PathVariable String idSong) {
        return sServ.findSongById(idSong);
    }


}
