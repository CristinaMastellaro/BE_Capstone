package cristina.mastellaro.BE_Capstone.repositories;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {
}
