package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.payloads.PexelsResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.country.CountryResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.AllTracksDTO;
import cristina.mastellaro.BE_Capstone.payloads.lastFm.LastFmResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.FoundSongDTO;
import cristina.mastellaro.BE_Capstone.payloads.striveSchool.StriveSchoolResponseDTO;
import cristina.mastellaro.BE_Capstone.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/songs/country")
    public Flux<AllTracksDTO> searchInfoForSongsByCountry(@RequestParam String country) {
        return lFmServ.getInfoCountrySongsToSearch(country);
    }

    @GetMapping("/songs/country/all")
    public Flux<FoundSongDTO> searchForAllSongsByCountry(@RequestParam String country) {
        return mServ.findSongsByCountry(country);
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<StriveSchoolResponseDTO>> generalSearch(@RequestParam String query) {
        return ssServ.searchSong(query).map(ResponseEntity::ok);
    }

    @GetMapping("/track/{idSong}")
    public Mono<FoundSongDTO> searchSingleSong(@PathVariable String idSong) {
        return ssServ.findSpecificSong(idSong);
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
