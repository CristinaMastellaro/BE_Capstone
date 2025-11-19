package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.PlaylistDTO;
import cristina.mastellaro.BE_Capstone.payloads.SongDTO;
import cristina.mastellaro.BE_Capstone.services.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<PlaylistDTO> getAllPlaylistsNames(@AuthenticationPrincipal User user) {
        return pServ.findAllPlaylists(user);
    }

    @GetMapping("/{namePlaylist}")
    public Playlist getPlaylistByName(@AuthenticationPrincipal User user, @PathVariable String namePlaylist) {
        return pServ.getPlaylistByName(user, namePlaylist);
    }

    @PatchMapping("/{namePlaylist}/add")
    public Playlist addSongToPlaylist(@AuthenticationPrincipal User user, @RequestBody @Validated SongDTO newSong, @PathVariable String namePlaylist, BindingResult validation) {
        if (validation.hasErrors())
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fL -> fL.getDefaultMessage()).toList());
        return pServ.addSongToPlaylist(user, newSong, namePlaylist);
    }

    @PatchMapping("/{namePlaylist}")
    public Playlist changeNamePlaylist(@AuthenticationPrincipal User user, @PathVariable String namePlaylist, @RequestParam String newName) {
        return pServ.changeNamePlaylist(user, namePlaylist, newName);
    }

    @DeleteMapping("/{namePlaylist}/{idSong}")
    public Playlist deleteSongFromPlaylist(@AuthenticationPrincipal User user, @PathVariable String namePlaylist, @PathVariable String idSong) {
        return pServ.deleteSongFromPlaylist(user, idSong, namePlaylist);
    }

    @DeleteMapping("/{namePlaylist}")
    public void deletePlaylist(@AuthenticationPrincipal User user, @PathVariable String namePlaylist) {
        pServ.deletePlaylist(user, namePlaylist);
    }

}
