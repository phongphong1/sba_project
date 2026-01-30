package fpt.sba.gaushare.services;

import java.security.SecureRandom;

public interface PasswordService {
    String hashPassword(String plainPassword);

    boolean verifyPassword(String plainPassword, String hashedPassword);

    String generateOtp(String email, int length, int ttlMinutes);
}
