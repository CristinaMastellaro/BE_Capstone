package cristina.mastellaro.BE_Capstone.payloads.country;

import java.util.List;

public record CountryInfoDTO(
        List<CountryData> data
) {
}
