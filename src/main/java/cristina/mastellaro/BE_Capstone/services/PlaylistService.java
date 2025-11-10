package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import cristina.mastellaro.BE_Capstone.entities.Song;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.SongAlreadyInPlaylistException;
import cristina.mastellaro.BE_Capstone.payloads.PlaylistDTO;
import cristina.mastellaro.BE_Capstone.payloads.SongDTO;
import cristina.mastellaro.BE_Capstone.repositories.PlaylistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PlaylistService {
    @Autowired
    private PlaylistRepository pRepo;
    @Autowired
    private UserService uServ;
    @Autowired
    private SongService sServ;

    public Playlist savePlaylist(User autheticatedUser, PlaylistDTO newPlaylist) {

        if (pRepo.findTitlesByUser(autheticatedUser).contains(newPlaylist.name()))
            throw new AlreadyUsedException("There is already a playlist by the name " + newPlaylist.name());

        List<Song> songsForPlaylist = new ArrayList<>();

        for (SongDTO singleSong : newPlaylist.songs()) {
            Song song;
            if (!sServ.existsSongById(singleSong.id())) {
                song = sServ.saveSong(singleSong);
            } else {
                song = sServ.findSongById(singleSong.id());
            }
            songsForPlaylist.add(song);
        }

        Playlist playlist = new Playlist(newPlaylist.name(), autheticatedUser, songsForPlaylist);

        pRepo.save(playlist);

        log.info("Playlist " + newPlaylist.name() + " saved");

        return playlist;
    }

    public Playlist getPlaylistByName(User authenticatedUser, String playlist) {
        return pRepo.findByNameAndUser(authenticatedUser, playlist);
    }

    public Playlist addSongToPlaylist(User authenticatedUser, SongDTO newSong, String playlistName) {
        Song song;
        if (sServ.existsSongById(newSong.id())) song = sServ.findSongById(newSong.id());
        else song = sServ.saveSong(newSong);

        Playlist playlist;
        if (pRepo.findTitlesByUser(authenticatedUser).contains(playlistName))
            playlist = pRepo.findByNameAndUser(authenticatedUser, playlistName);
        else {
            playlist = new Playlist(playlistName, authenticatedUser);
            pRepo.save(playlist);
        }

        if (playlist.getSongs().contains(song))
            throw new SongAlreadyInPlaylistException("The song " + song.getTitle() + " is already present in the playlist " + playlist.getName());

        List<Song> songListPlaylist = playlist.getSongs();
        songListPlaylist.add(song);

        playlist.setSongs(songListPlaylist);

        pRepo.save(playlist);

        log.info("Song " + song.getTitle() + " successfully saved in the playlist " + playlistName);

        return playlist;

    }
}
