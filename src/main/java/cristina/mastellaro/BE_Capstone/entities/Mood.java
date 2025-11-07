package cristina.mastellaro.BE_Capstone.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "moods")
@Getter
@Setter
@NoArgsConstructor
public class Mood {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "mood")
    @JsonIgnore
    private List<MoodSong> songs = new ArrayList<>();

    public Mood(String mood) {
        this.name = mood;
    }
}
