package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import cristina.mastellaro.BE_Capstone.entities.Song;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
import cristina.mastellaro.BE_Capstone.exceptions.SongAlreadyInPlaylistException;
import cristina.mastellaro.BE_Capstone.payloads.PlaylistDTO;
import cristina.mastellaro.BE_Capstone.payloads.SongDTO;
import cristina.mastellaro.BE_Capstone.repositories.PlaylistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PlaylistService {
    @Autowired
    private PlaylistRepository pRepo;
    @Autowired
    private UserService uServ;
    @Autowired
    private SongService sServ;

    //    @Transactional
    public Playlist savePlaylist(User autheticatedUser, PlaylistDTO newPlaylist) {
        User userToUse = uServ.findUserById(autheticatedUser.getId());
        if (pRepo.findTitlesByUser(userToUse).contains(newPlaylist.name()))
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

    //    @Transactional
    public Playlist getPlaylistByName(User authenticatedUser, String playlist) {
        Playlist found = pRepo.findByNameAndUser(authenticatedUser, playlist);
        if (found == null) {
            if (playlist.equals("favourites")) {
                found = new Playlist("favourites", authenticatedUser);
                pRepo.save(found);
                return found;
            } else {
                throw new NotFoundException(playlist, 0);
            }
        } else {
            return found;
        }
    }

    public Playlist changeNamePlaylist(User authenticatedUser, String namePlaylistToChange, String newName) {
        Playlist playlistToUpdate = pRepo.findByNameAndUser(authenticatedUser, namePlaylistToChange);
        if (playlistToUpdate == null)
            throw new NotFoundException("You don't have a playlist called " + namePlaylistToChange);

        playlistToUpdate.setName(newName);

        pRepo.save(playlistToUpdate);

        log.info("Name of the playlist updated!");

        return playlistToUpdate;

    }

    //    @Transactional
    public Playlist addSongToPlaylist(User authenticatedUser, SongDTO newSong, String playlistName) {
        User userToUse = uServ.findUserById(authenticatedUser.getId());
        Song song;
        if (sServ.existsSongById(newSong.id())) song = sServ.findSongById(newSong.id());
        else song = sServ.saveSong(newSong);

        Playlist playlist;
        if (pRepo.findTitlesByUser(userToUse).contains(playlistName))
            playlist = getPlaylistByName(authenticatedUser, playlistName);
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

    public Playlist deleteSongFromPlaylist(User user, String idSong, String namePlaylist) {
        Playlist playlist = getPlaylistByName(user, namePlaylist);

        List<Song> songsOfPlaylist = playlist.getSongs();

        playlist.setSongs(songsOfPlaylist.stream().filter(song -> !song.getId().equals(idSong)).collect(Collectors.toList()));

        pRepo.save(playlist);

        return playlist;
    }

    //    @Transactional
    public List<PlaylistDTO> findAllPlaylists(User authenticatedUser) {
        User userToUse = uServ.findUserById(authenticatedUser.getId());
        List<Playlist> playlists = pRepo.findAllPlaylistsByUser(userToUse);

        List<PlaylistDTO> response = new ArrayList<>();
        playlists.forEach(playlist -> {
            List<SongDTO> songs = new ArrayList<>();
            playlist.getSongs().forEach(song -> {
                SongDTO songToAdd = new SongDTO(song.getId(), song.getCover(), song.getTitle(), song.getAuthor());
                songs.add(songToAdd);
            });
            response.add(new PlaylistDTO(playlist.getName(), songs));
        });
        return response;
    }

    public void deletePlaylist(User authenticatedUser, String namePlaylist) {
        Playlist playlistToDelete = pRepo.findByNameAndUser(authenticatedUser, namePlaylist);

        if (playlistToDelete == null) throw new NotFoundException("You don't have a playlist called " + namePlaylist);

        pRepo.delete(playlistToDelete);

        log.info("Playlist deleted!");
    }
}
