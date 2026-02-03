package fpt.sba.gaushare.services;

import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.requests.VerifyRequestDTO;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;
import fpt.sba.gaushare.dto.responses.VerifyResponse;

public interface AuthService {

    RegistrationResponse registerUser(UserRegistrationDTO userRegistration);

    VerifyResponse verifyOtpCode(VerifyRequestDTO verifyRequestDTO);

}
