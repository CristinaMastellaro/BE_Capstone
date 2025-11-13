//package cristina.mastellaro.BE_Capstone.entities;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AccessLevel;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.util.List;
//
//@Entity
//@Table(name = "albums")
//@Getter
//@Setter
//@NoArgsConstructor
//public class Album {
//
//    @Id
//    @Setter(AccessLevel.NONE)
//    private String id;
//    @Column(nullable = false)
//    private String title;
//    private String cover;
//
//    @ManyToOne
//    private Artist artist;
//    @OneToMany(mappedBy = "album")
//    @JsonIgnore
//    private List<Song> songs;
//
//    public Album(String id, String title, String cover, Artist artist) {
//        this.id = id;
//        this.title = title;
//        this.cover = cover;
//        this.artist = artist;
//    }
//}
