package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.PlaylistDTO;
import cristina.mastellaro.BE_Capstone.services.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playlists")
public class PlaylistController {
    @Autowired
    private PlaylistService pServ;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Playlist savePlaylist(@AuthenticationPrincipal User user, @RequestBody @Validated PlaylistDTO newPlaylist, BindingResult validation) {
        if (validation.hasErrors())
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fL -> fL.getDefaultMessage()).toList());
        return pServ.savePlaylist(user, newPlaylist);
    }


}
