package fpt.sba.gaushare.controllers;


import fpt.sba.gaushare.dto.ApiResponse;
import fpt.sba.gaushare.dto.requests.AuthenticationRequest;
import fpt.sba.gaushare.dto.requests.ResendOtpRequest;
import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.requests.VerifyRequestDTO;
import fpt.sba.gaushare.dto.responses.AuthenticationResponse;
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

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerUser(
            @Valid @RequestBody UserRegistrationDTO userRegistrationDTO
            ) {

        RegistrationResponse response = authService.registerUser(userRegistrationDTO);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(
            @Valid @RequestBody AuthenticationRequest authenticationRequest
    ){
        AuthenticationResponse response = authService.login(authenticationRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyResponse>> verifyUser(
            @Valid @RequestBody VerifyRequestDTO verifyRequestDTO
    ) {
        VerifyResponse response = authService.verifyOtpCode(verifyRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestBody ResendOtpRequest request) {
        authService.sendOtpEmail(request.getEmail(), "Verify your email");
        return ResponseEntity.ok(ApiResponse.success("OTP code resent successfully"));
    }



}
