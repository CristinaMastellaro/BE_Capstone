package cristina.mastellaro.BE_Capstone.payloads;

public record PhotoDTO(
        int id,
        String photographer,
        String photographer_url,
        SrcDTO src
) {
}
