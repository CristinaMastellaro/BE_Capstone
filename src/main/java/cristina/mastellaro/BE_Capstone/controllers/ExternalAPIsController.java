package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.payloads.country.AllCountriesDTO;
import cristina.mastellaro.BE_Capstone.payloads.country.CountryResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.AllTracksDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.FoundSongDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.StriveSchoolResponseDTO;
import cristina.mastellaro.BE_Capstone.services.CountryService;
import cristina.mastellaro.BE_Capstone.services.LastFmService;
import cristina.mastellaro.BE_Capstone.services.MusicService;
import cristina.mastellaro.BE_Capstone.services.StriveSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExternalAPIsController {
    //    @Autowired
//    private PexelsAPIService pApiServ;
    @Autowired
    private CountryService cServ;
    @Autowired
    private LastFmService lFmServ;
    @Autowired
    private StriveSchoolService ssServ;
    @Autowired
    private MusicService mServ;

    // Pictures
//    @GetMapping("/picture")
//    public Mono<ResponseEntity<PexelsResponseDTO>> getPicturesFromPexels(@RequestParam String search) {
//        return pApiServ.findImage(search)
//                .map(ResponseEntity::ok);
//    }

    // Countries
    @GetMapping("/country")
    public CountryResponseDTO getCountryNameFromCode(@RequestParam String code) {
        return cServ.getCountryFromCode(code);
    }

    // Last.fm: categorize songs
    @GetMapping("/nameSongsByMood")
    public Mono<ResponseEntity<LastFmResponseDTO>> getNameSongsByMood(@RequestParam String mood) {
        return lFmServ.findSongsByMood(mood)
                .map(ResponseEntity::ok);
    }

    // strive-school
    @GetMapping("/songs/mood")
    public Flux<FoundSongDTO> searchForSongs(@RequestParam String mood) {
        return mServ.findSongByMood(mood);
    }

    @GetMapping("/nameCountries")
    public AllCountriesDTO getAllCountriesNames() {
        List<String> countriesNames = cServ.countriesNames();
        return new AllCountriesDTO(countriesNames);
    }

    @GetMapping("/songs/country")
    public Flux<AllTracksDTO> searchInfoForSongsByCountry(@RequestParam String country) {
        return lFmServ.getInfoCountrySongsToSearch(country);
    }

    @GetMapping("/songs/country/all")
    public Flux<FoundSongDTO> searchForAllSongsByCountry(@RequestParam String country) {
        return mServ.findSongsByCountry(country);
    }

    @GetMapping("/songs/period")
    public Flux<AllTracksDTO> searchInfoForSongsByPeriod(@RequestParam String period) {
        return lFmServ.getInfoPeriodSongsToSearch(period);
    }

    @GetMapping("/songs/period/{period}")
    public Flux<FoundSongDTO> searchForAllSongsByPeriod(@PathVariable String period) {
        return mServ.findSongByPeriod(period);
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<StriveSchoolResponseDTO>> generalSearch(@RequestParam String query) {
        return ssServ.searchSong(query).map(ResponseEntity::ok);
    }

    @GetMapping("/track/{idSong}")
    public Mono<FoundSongDTO> searchSingleSong(@PathVariable String idSong) {
        return ssServ.findSpecificSong(idSong);
    }
}
