package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.payloads.PexelsResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.country.CountryInfoDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.FoundSongDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.StriveSchoolResponseDTO;
import cristina.mastellaro.BE_Capstone.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class ExternalAPIsController {
    @Autowired
    private PexelsAPIService pApiServ;
    @Autowired
    private CountryService cServ;
    @Autowired
    private LastFmService lFmServ;
    @Autowired
    private StriveSchoolService ssServ;
    @Autowired
    private MusicService mServ;

    // Pictures
    @GetMapping("/picture")
    public Mono<ResponseEntity<PexelsResponseDTO>> getPicturesFromPexels(@RequestParam String search) {
        return pApiServ.findImage(search)
                .map(ResponseEntity::ok);
    }

    // Countries
    @GetMapping("/country")
    public Flux<ResponseEntity<CountryInfoDTO>> getCountryNameFromCode(@RequestParam String code) {
        return cServ.getNameCountry(code).map(ResponseEntity::ok);
    }

    // Last.fm: categorize songs
//    @GetMapping("/nameSongsByCountry")
//    public void getNameSongsByCountry(@RequestParam String country) {

    /// /        `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${data[0].name.common}&api_key=${TOKEN_LAST_FM}&format=json&limit=30
//    }
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

    @GetMapping("/search")
    public Mono<ResponseEntity<StriveSchoolResponseDTO>> generalSearch(@RequestParam String query) {
        return ssServ.searchSong(query).map(ResponseEntity::ok);
    }
/*
    API for pictures
    "https://api.pexels.com/v1/search?query="

    API for country
    "https://restcountries.com/v3.1/alpha/" + selectedRegionCode

    Search for songs in Last.fm
    `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${data[0].name.common}&api_key=${TOKEN_LAST_FM}&format=json&limit=30

    Search for songs with strive-school
    - Search songs by country
`https://striveschool-api.herokuapp.com/api/deezer/search?q=${song.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")} ${song.artist
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`

     - General search
     "https://striveschool-api.herokuapp.com/api/deezer/search?q="

     -
*/
}
