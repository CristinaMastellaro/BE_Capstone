package cristina.mastellaro.BE_Capstone.controllers;

import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.PayloadValidationException;
import cristina.mastellaro.BE_Capstone.payloads.ChangeAvatarDTO;
import cristina.mastellaro.BE_Capstone.payloads.ChangeInfoUserDTO;
import cristina.mastellaro.BE_Capstone.payloads.UserChangeInfoDTO;
import cristina.mastellaro.BE_Capstone.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService uServ;

    @PutMapping("/changeInfo")
    public ChangeInfoUserDTO changeInfo(@RequestBody @Validated UserChangeInfoDTO newInfo, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new PayloadValidationException(validation.getFieldErrors().stream().map(err -> err.getDefaultMessage()).toList());
        }
        return uServ.changeInfo(newInfo);
    }

    @PatchMapping("/upload")
    public ChangeAvatarDTO uploadAvatar(@AuthenticationPrincipal User authenticatedUser, @RequestParam("avatarUrl") MultipartFile file) throws IOException {
        return uServ.avatarUploader(authenticatedUser, file);
    }
}
