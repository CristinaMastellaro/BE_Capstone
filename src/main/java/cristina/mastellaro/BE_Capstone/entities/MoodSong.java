package cristina.mastellaro.BE_Capstone.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mood_song")
@Getter
@Setter
@NoArgsConstructor
public class MoodSong {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne
    private Mood mood;
    @ManyToOne
    private Song song;
}
