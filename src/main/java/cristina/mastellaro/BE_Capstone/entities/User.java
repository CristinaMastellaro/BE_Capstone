package cristina.mastellaro.BE_Capstone.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({"password", "userRole", "authorities", "enabled", "accountNonExpired", "credentialsNonExpired", "accountNonLocked"})
public class User implements UserDetails {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String avatar;
    private UserRoles userRole;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Playlist> playlists = new ArrayList<>();

    public User(String name, String surname, String username, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = "https://ui-avatars.com/api/?name=" + name.charAt(0) + "+" + surname.charAt(0);
        this.userRole = UserRoles.SIMPLEUSER;
    }

    public User(String name, String surname, String username, String email, String password, String avatar) {
        this(name, surname, username, email, password);
        this.avatar = avatar;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userRole.name()));
    }
}
