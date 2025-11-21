package cristina.mastellaro.BE_Capstone.payloads.country;

import java.util.List;

public record CountryInfoDTO(
//        CountryNameDTO name,
//        CountryFlagDTO flags
        List<CountryData> data
) {
}
