package fpt.sba.gaushare.services;

import java.util.HashMap;

public interface EmailService {

    void sendEmail(String recipient, String subject, String body);

    void sendEmailWithTemplate(String recipient, String subject, String templateName, HashMap<String, String> templateValues);

}
