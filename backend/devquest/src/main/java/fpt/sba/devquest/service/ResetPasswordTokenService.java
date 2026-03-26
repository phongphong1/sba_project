package fpt.sba.devquest.service;

public interface ResetPasswordTokenService {

    void save(String token, String email);

    String consumeEmail(String token);
}
