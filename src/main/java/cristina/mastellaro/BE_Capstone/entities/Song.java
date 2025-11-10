package cristina.mastellaro.BE_Capstone.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
public class Song {

    @Id
    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    private String id;
    @Column(nullable = false)
    private String title;
    private int duration;
    @Column(nullable = false)
    private String preview;
    private String cover;
    @Column(nullable = false)
    private String artist;

    @OneToMany(mappedBy = "song")
    @JsonIgnore
    private List<MoodSong> moods = new ArrayList<>();
//    @ManyToMany
//    @JoinTable(name = "song_artist",
//            joinColumns = @JoinColumn(name = "song_id"),
//            inverseJoinColumns = @JoinColumn(name = "artist_id"))
//    private List<Artist> artists = new ArrayList<>();
//    @ManyToOne
//    private Album album;
//    @OneToMany(mappedBy = "")
//@JsonIgnore
//    private List<Playlist> playlists;

    public Song(String id, String title, String artist, String preview, String cover) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.preview = preview;
        this.cover = cover;
    }

    public Song(String id, String title, String artist, int duration, String preview, String cover
    ) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.preview = preview;
        this.cover = cover;
//        this.album = album;
    }
}
