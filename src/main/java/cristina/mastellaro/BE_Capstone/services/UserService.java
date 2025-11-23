package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.email.EmailSender;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.AlreadyUsedException;
import cristina.mastellaro.BE_Capstone.exceptions.NotFoundException;
import cristina.mastellaro.BE_Capstone.payloads.*;
import cristina.mastellaro.BE_Capstone.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository uRepo;
    @Autowired
    private PasswordEncoder pEncoder;
    @Autowired
    private EmailSender eSender;
    @Autowired
    private List<String> apiKey;

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

        try {
            eSender.sendRegistrationEmail(userToSave.getEmail());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        log.info("The user has been saved!");

        return userToSave;
    }

    public User findUserByUsername(String username) {
        User user = uRepo.findByUsername(username);
        if (user == null) throw new NotFoundException(username);

        return user;
    }

    public LoginResponseDTO getInfoUser(LoginDTO dto, String token) {
        User user = uRepo.findByUsername(dto.username());

        return new LoginResponseDTO(dto.username(), user.getName(), user.getSurname(), user.getEmail(), token);
    }

    public void changePassword(LoginDTO dto) {
        User user = uRepo.findByUsername(dto.username());

        user.setPassword(pEncoder.encode(dto.password()));

        uRepo.save(user);

        log.info("New password saved!");
    }

    public ChangeInfoUserDTO changeInfo(UserChangeInfoDTO newInfo) {
        User userToUpdate = findUserByUsername(newInfo.oldUsername());
        String oldEmail = userToUpdate.getEmail();

        userToUpdate.setName(newInfo.name());
        userToUpdate.setSurname(newInfo.surname());

        if (!userToUpdate.getEmail().equals(newInfo.email())) {
            if (uRepo.existsByEmail(newInfo.email()))
                throw new AlreadyUsedException("The email " + newInfo.email() + "has already been used");
            else userToUpdate.setEmail(newInfo.email());
        }

        if (!userToUpdate.getUsername().equals(newInfo.username())) {
            if (uRepo.existsByUsername(newInfo.username()))
                throw new AlreadyUsedException("The username " + newInfo.username() + "has already been used");
            else userToUpdate.setUsername(newInfo.username());
        }

        uRepo.save(userToUpdate);

        log.info("The info has been updated correctly!");

        if (!oldEmail.equals(newInfo.email())) {
            try {
                eSender.sendGeneralEmail(newInfo.email(), "Change email in Muse", "Hello! Your email has been changed in Muse and now the notifications will be sent here!\n\nIf this request wasn't made by you, contact us.\n\nHave an amazing day!\nMuse Team");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        return new ChangeInfoUserDTO(userToUpdate.getName(), userToUpdate.getSurname(), userToUpdate.getUsername(), userToUpdate.getEmail());
    }
}
