package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.LoginDTO;
import cristina.mastellaro.BE_Capstone.payloads.LoginResponseDTO;
import cristina.mastellaro.BE_Capstone.payloads.UserDTO;
import cristina.mastellaro.BE_Capstone.services.LoginService;
import cristina.mastellaro.BE_Capstone.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService uServ;
    @Autowired
    private LoginService lServ;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User saveUser(@RequestBody @Validated UserDTO newUser, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fE -> fE.getDefaultMessage()).toList());
        }
        return uServ.saveUser(newUser);
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody @Validated LoginDTO dto, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fE -> fE.getDefaultMessage()).toList());
        }
        return new LoginResponseDTO(dto.username(), lServ.verifyUserAndGetToken(dto));
    }

}
