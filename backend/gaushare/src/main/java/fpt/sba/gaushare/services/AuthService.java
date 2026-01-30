package fpt.sba.gaushare.services;

import fpt.sba.gaushare.dto.requests.UserRegistrationDTO;
import fpt.sba.gaushare.dto.responses.RegistrationResponse;

public interface AuthService {

    public RegistrationResponse registerUser(UserRegistrationDTO userRegistration);

}
