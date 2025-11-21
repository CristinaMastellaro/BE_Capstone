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
        message.setText("Congratulations! Now you can search for the perfect music for your mood and you can discover new music from all around the world.\n\nHave an amazing journey!\nSoundHaven Team");
        mailSender.send(message);
        System.out.println("Mail sent!");
    }

    public int sendChangePasswordEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();

        int rdmNumber = (int) Math.floor(Math.random() * 1000000 + 1000000);
        message.setTo(email);
        message.setSubject("Change password in SoundHaven");
        message.setText("A change of password was requested. If it wasn't you, ignore this email.\n\nThis is the code: " + rdmNumber + "\n\nHave an amazing day!\nSoundHaven Team");
        mailSender.send(message);
        System.out.println("Mail sent!");

        return rdmNumber;
    }

    public void sendGeneralEmail(String email, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setTo(email);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
        System.out.println("Mail sent!");
    }
}
