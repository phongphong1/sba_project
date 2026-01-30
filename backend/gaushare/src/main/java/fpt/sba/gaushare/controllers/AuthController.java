package fpt.sba.gaushare.controllers;


import fpt.sba.gaushare.dto.ApiResponse;
import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;
import fpt.sba.gaushare.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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

}
