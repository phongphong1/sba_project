package fpt.sba.devquest.service;

public interface MagicLinkTokenService {

    void save(String token, String email);

    String consumeEmail(String token);
}
