package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.Song;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
import cristina.mastellaro.BE_Capstone.payloads.SongDTO;
import cristina.mastellaro.BE_Capstone.repositories.SongRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class SongService {
    @Autowired
    private SongRepository sRepo;

    public Song saveSong(SongDTO newSong) {
        if (sRepo.existsById(newSong.id()))
            throw new AlreadyUsedException("The song with id " + newSong.id() + " is already saved in the DB");

        Song song = new Song(newSong.id(), newSong.title(), newSong.author(), newSong.cover());

        sRepo.save(song);

        log.info("Song " + newSong.title() + " saved!");

        return song;
    }

    public Song findSongById(String id) {
        return sRepo.findById(id).orElseThrow(() -> new NotFoundException(UUID.fromString(id)));
    }

    public boolean existsSongById(String id) {
        return sRepo.existsById(id);
    }


//    public List<Song> saveAllSongs(List<Song>) {
//
//    }

}
