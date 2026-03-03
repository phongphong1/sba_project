package fpt.sba.gaushare.services.impl;

import fpt.sba.gaushare.services.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class PasswordServiceImpl implements PasswordService {

    private final RedisTemplate<String, String> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    private static final String DIGITS = "0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String OTP_PREFIX = "OTP:";

    @Override
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    @Override
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(hashedPassword, plainPassword);
    }

    @Override
    public String generateOtp(String email, int length, int ttlMinutes) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        }

        redisTemplate.opsForValue().set(
                OTP_PREFIX + email,
                otp.toString(),
                Duration.ofMinutes(ttlMinutes)
        );
        return otp.toString();
    }

    @Override
    public boolean validateOtp(String email, String userInputCode) {
        String savedCode = redisTemplate.opsForValue().get(OTP_PREFIX + email);
        return userInputCode.equals(savedCode);
    }

    @Override
    public void deleteOtp(String email) {
        redisTemplate.delete(OTP_PREFIX + email);
    }
}
