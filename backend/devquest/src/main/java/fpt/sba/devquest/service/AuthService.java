package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.auth.LoginRequest;
import fpt.sba.devquest.dto.auth.LoginResponse;
import fpt.sba.devquest.dto.auth.ActionResponse;
import fpt.sba.devquest.dto.auth.ForgotPasswordRequest;
import fpt.sba.devquest.dto.auth.RegisterRequest;
import fpt.sba.devquest.dto.auth.RegisterResponse;
import fpt.sba.devquest.dto.auth.ResetPasswordRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    RegisterResponse verify(String token);

    ActionResponse forgotPassword(ForgotPasswordRequest request);

    ActionResponse resetPassword(ResetPasswordRequest request);

    RegisterResponse register(RegisterRequest request);
}
