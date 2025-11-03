package cristina.mastellaro.BE_Capstone.services;

import cristina.mastellaro.BE_Capstone.entities.User;
import cristina.mastellaro.BE_Capstone.exceptions.UnauthorizedException;
import cristina.mastellaro.BE_Capstone.payloads.LoginDTO;
import cristina.mastellaro.BE_Capstone.security.JwtTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private JwtTools jwtTools;
    @Autowired
    private PasswordEncoder pEncoder;
    @Autowired
    private UserService uServ;

    public String verifyUserAndGetToken(LoginDTO dto) {
        User user = uServ.findUserByUsername(dto.username());

        if (pEncoder.matches(dto.password(), user.getPassword())) {
            return jwtTools.createToken(user);
        } else {
            throw new UnauthorizedException("Wrong credentials!");
        }
    }

}
