package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.service.MagicLinkTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class MagicLinkTokenServiceImpl implements MagicLinkTokenService {

    private static final String KEY_PREFIX = "auth:magic-link:";

    private final StringRedisTemplate stringRedisTemplate;

    @Value("${app.auth.verify.expiry-minutes:15}")
    private long expiryMinutes;

    @Override
    public void save(String token, String email) {
        String key = KEY_PREFIX + token;
        stringRedisTemplate.opsForValue().set(key, email, Duration.ofMinutes(expiryMinutes));
    }

    @Override
    public String consumeEmail(String token) {
        String key = KEY_PREFIX + token;
        return stringRedisTemplate.opsForValue().getAndDelete(key);
    }
}
