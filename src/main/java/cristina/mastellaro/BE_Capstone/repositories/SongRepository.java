package cristina.mastellaro.BE_Capstone.repositories;

import cristina.mastellaro.BE_Capstone.entities.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {
}
