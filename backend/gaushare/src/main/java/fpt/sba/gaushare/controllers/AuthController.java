package fpt.sba.gaushare.controllers;


import fpt.sba.gaushare.dto.ApiResponse;
import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.requests.VerifyRequestDTO;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;
import fpt.sba.gaushare.dto.responses.VerifyResponse;
import fpt.sba.gaushare.services.AuthService;
import fpt.sba.gaushare.services.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;


    @GetMapping
    public ResponseEntity<String> hello() {

        HashMap<String, String> templateValues = new HashMap<>();
        templateValues.put("otpCode", "556688");
        templateValues.put("name", "LetGauCode");
        templateValues.put("expireTime", "30");

        emailService.sendEmailWithTemplate(
                "hoangvanphong102@gmail.com",
                "Test Email",
                "OTPMail",
                templateValues
        );
        return ResponseEntity.ok("Hello World");
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerUser(
            @Valid @RequestBody UserRegistrationDTO userRegistrationDTO
            ) {

        RegistrationResponse response = authService.registerUser(userRegistrationDTO);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyResponse>> verifyUser(
            @Valid @RequestBody VerifyRequestDTO verifyRequestDTO
    ) {
        VerifyResponse response = authService.verifyOtpCode(verifyRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(response));
    }


}
