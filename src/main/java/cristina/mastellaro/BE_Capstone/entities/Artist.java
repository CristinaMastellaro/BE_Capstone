package cristina.mastellaro.BE_Capstone.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
public class Artist {

    @Id
    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    private String id;
    @Column(nullable = false)
    private String name;
    private String picture;

    @OneToMany(mappedBy = "artist")
    @JsonIgnore
    private List<Album> albums;
    @ManyToMany(mappedBy = "artists")
    private List<Song> songs;

    public Artist(String id, String name, String picture) {
        this.id = id;
        this.name = name;
        this.picture = picture;
    }
}
