package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.email.EmailSender;
import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.*;
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
    @Autowired
    private EmailSender eSender;

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
        return uServ.getInfoUser(dto, lServ.verifyUserAndGetToken(dto));
    }

    @GetMapping("/changePassword")
    public int requestChangePassword(@RequestParam String email) {
        return eSender.sendChangePasswordEmail(email);
    }

    @PatchMapping("/changePassword")
    public void changePassword(@RequestBody @Validated LoginDTO dto, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(fE -> fE.getDefaultMessage()).toList());
        }
        uServ.changePassword(dto);
    }

    @PutMapping("/changeInfo")
    public ChangeInfoUserDTO changeInfo(@RequestBody @Validated UserChangeInfoDTO newInfo, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(err -> err.getDefaultMessage()).toList());
        }
        return uServ.changeInfo(newInfo);
    }

}
