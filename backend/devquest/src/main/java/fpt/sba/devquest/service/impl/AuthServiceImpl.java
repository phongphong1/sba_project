package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.auth.LoginRequest;
import fpt.sba.devquest.dto.auth.LoginResponse;
import fpt.sba.devquest.dto.auth.ActionResponse;
import fpt.sba.devquest.dto.auth.ForgotPasswordRequest;
import fpt.sba.devquest.dto.auth.RegisterRequest;
import fpt.sba.devquest.dto.auth.RegisterResponse;
import fpt.sba.devquest.dto.auth.ResetPasswordRequest;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.service.AuthService;
import fpt.sba.devquest.service.EmailService;
import fpt.sba.devquest.service.MagicLinkTokenService;
import fpt.sba.devquest.service.ResetPasswordTokenService;
import fpt.sba.devquest.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final MagicLinkTokenService magicLinkTokenService;
    private final ResetPasswordTokenService resetPasswordTokenService;

    @Value("${app.auth.verify.base-url}")
    private String verifyBaseUrl;

    @Value("${app.auth.verify.expiry-minutes:15}")
    private long verifyExpiryMinutes;

    @Value("${app.auth.reset-password.base-url}")
    private String resetPasswordBaseUrl;

    @Value("${app.auth.reset-password.expiry-minutes:15}")
    private long resetPasswordExpiryMinutes;

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(request.email(), request.password())
            );
            String token = jwtUtils.generateTokenFromUsername(authentication.getName());
            return new LoginResponse(token);
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
    }

    @Override
    public RegisterResponse verify(String token) {
        if (!StringUtils.hasText(token)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verify token is required.");
        }

        String email = magicLinkTokenService.consumeEmail(token);
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Verify token is invalid or expired.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (Boolean.TRUE.equals(user.getIsActive())) {
            return new RegisterResponse("Email is already verified.");
        }

        user.setIsActive(true);
        userRepository.save(user);
        return new RegisterResponse("Email verified successfully. You can log in now.");
    }

    @Override
    public ActionResponse forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email())
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .ifPresent(this::sendResetPasswordEmail);

        return new ActionResponse(true, "Magic link sent");
    }

    @Override
    public ActionResponse resetPassword(ResetPasswordRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password and confirm password do not match.");
        }

        String email = resetPasswordTokenService.consumeEmail(request.token());
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Reset token is invalid or expired.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        return new ActionResponse(true, "Password updated");
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password and confirm password do not match.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists.");
        }

        User user = new User();
        user.setFullname(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setSystemRole("ROLE_USER");
        user.setIsActive(false);
        user.setEmailNotifications(true);
        userRepository.save(user);

        sendVerifyEmail(user);

        return new RegisterResponse("Registration successful. Please check your email to confirm your account.");
    }

    private void sendVerifyEmail(User user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        magicLinkTokenService.save(token, user.getEmail());

        String link = verifyBaseUrl + "?token=" + token;
        HashMap<String, String> variables = new HashMap<>();
        variables.put("fullname", user.getFullname() != null ? user.getFullname() : user.getEmail());
        variables.put("magicLink", link);
        variables.put("expiryTime", String.valueOf(verifyExpiryMinutes));

        emailService.sendEmailWithTemplate(user.getEmail(), "Confirm your account", "ComfirmEmail", variables);
    }

    private void sendResetPasswordEmail(User user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        resetPasswordTokenService.save(token, user.getEmail());

        String link = resetPasswordBaseUrl + "?token=" + token;
        HashMap<String, String> variables = new HashMap<>();
        variables.put("fullname", user.getFullname() != null ? user.getFullname() : user.getEmail());
        variables.put("resetLink", link);
        variables.put("expiryTime", String.valueOf(resetPasswordExpiryMinutes));

        emailService.sendEmailWithTemplate(user.getEmail(), "Reset your password", "ForgotPassword", variables);
    }
}
