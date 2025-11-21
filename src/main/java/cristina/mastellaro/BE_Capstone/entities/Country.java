package cristina.mastellaro.BE_Capstone.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "countries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Country {
    @Id
    @Column(name = "codes", unique = true, nullable = false)
    @JsonProperty("Code")
    private String Code;
    @Column(name = "names", nullable = false)
    @JsonProperty("Name")
    private String Name;
}
