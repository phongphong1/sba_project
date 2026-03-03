package fpt.sba.gaushare.dto.requests;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static fpt.sba.gaushare.constants.ValidationMessage.PASSWORD_NOT_BLANK;
import static fpt.sba.gaushare.constants.ValidationMessage.USERNAME_NOT_BLANK;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {

    @NotBlank(message = USERNAME_NOT_BLANK)
    private String username;

    @NotBlank(message = PASSWORD_NOT_BLANK)
    private String password;

}
