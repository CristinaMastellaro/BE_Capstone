package cristina.mastellaro.BE_Capstone.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Confirm registration to SoundHaven");
        message.setText("Congratulations! Now you can search for the perfect music for your mood and you can discover new music from all around the world");
        mailSender.send(message);
        System.out.println("Mail sent!");
    }
}
