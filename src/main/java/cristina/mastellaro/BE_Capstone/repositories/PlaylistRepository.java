package cristina.mastellaro.BE_Capstone.repositories;

import cristina.mastellaro.BE_Capstone.entities.Playlist;
import cristina.mastellaro.BE_Capstone.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {
    //    @Query("SELECT f FROM Fattura f WHERE f.data BETWEEN : start AND :end")
//    List<Fattura> findByDataBetween(@Param("start")LocalDate start,
//                                    @Param("end")LocalDate end);
    @Query("SELECT p.name FROM Playlist p WHERE p.user = :user")
    List<String> findTitlesByUser(@Param("user") User user);

    @Query("SELECT p FROM Playlist p WHERE p.user = :user AND p.name = :name")
    Playlist findByNameAndUser(@Param("user") User user, @Param("name") String name);
}
