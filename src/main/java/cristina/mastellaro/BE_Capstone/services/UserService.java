package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
import cristina.mastellaro.BE_Capstone.payloads.UserDTO;
import cristina.mastellaro.BE_Capstone.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository uRepo;
    @Autowired
    private PasswordEncoder pEncoder;

    public User findUserById(UUID id) {
        return uRepo.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public User saveUser(UserDTO newUser) {
        // Check if the mail and username are already used
        if (uRepo.existsByEmail(newUser.email()))
            throw new AlreadyUsedException("The email " + newUser.email() + " is already used");
        if (uRepo.existsByUsername(newUser.username()))
            throw new AlreadyUsedException("The username " + newUser.username() + " is already used");

        User userToSave = new User(newUser.name(), newUser.surname(), newUser.username(), newUser.email(), pEncoder.encode(newUser.password()));

        uRepo.save(userToSave);

        log.info("The user has been saved!");

        return userToSave;
    }

    public User findUserByUsername(String username) {
        User user = uRepo.findByUsername(username);
        if (user == null) throw new NotFoundException(username);

        return user;
    }
}
