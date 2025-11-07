package cristina.mastellaro.BE_Capstone.repositories;

import cristina.mastellaro.BE_Capstone.entities.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
}
