package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.repositories.ArtistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ArtistService {
    @Autowired
    private ArtistRepository aRepo;
}
