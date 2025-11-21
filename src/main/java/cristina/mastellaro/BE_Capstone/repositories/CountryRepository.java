package cristina.mastellaro.BE_Capstone.repositories;

import cristina.mastellaro.BE_Capstone.entities.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {
}
