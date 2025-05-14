package com.homeease.service;

import org.springframework.stereotype.Service;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.*;

@Service
public class EmailService {

    public static void sendConfirmationEmail(String userEmail, String productName, String startDate, String endDate) {
        String to = userEmail; // El correo del usuario que se pasa al método
        String from = "homease2025@gmail.com"; // Tu correo de envío
        String host = "smtp.gmail.com"; // SMTP server para Gmail

        Properties properties = new Properties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        properties.put("mail.smtp.ssl.trust", "smtp.gmail.com"); // Permite conexiones sin verificar el certificado

        // Autenticación
        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("homease2025@gmail.com", "osyv alhx dwrk dfbu");
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject("Confirmación de Reserva - " + productName);
            message.setText("Hola, tu reserva para el producto " + productName + " ha sido confirmada.\n"
                    + "Fecha de inicio: " + startDate + "\n"
                    + "Fecha de fin: " + endDate + "\n"
                    + "Gracias por usar nuestros servicios!");

            Transport.send(message);
            System.out.println("Correo enviado correctamente.");
        } catch (MessagingException mex) {
            mex.printStackTrace();
            System.out.println("Error al enviar el correo: " + mex.getMessage());
        }
    }
}