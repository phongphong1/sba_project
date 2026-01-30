package fpt.sba.gaushare.dto.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import static fpt.sba.gaushare.constants.ValidationMessage.*;

import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    @NotBlank(message = FULLNAME_NOT_BLANK)
    private String fullname;

    @NotBlank(message = EMAIL_NOT_BLANK)
    @Email(message = EMAIL_INVALID)
    private String email;

    @NotBlank(message = USERNAME_NOT_BLANK)
    @Size(min = 4, max = 20, message = USERNAME_SIZE)
    private String username;

    @NotNull(message = DOB_NOT_NULL)
    @Past(message = DOB_PAST)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dob;

    @NotBlank(message = PASSWORD_NOT_BLANK)
    @Size(min = 6, message = PASSWORD_SIZE)
    private String password;
}
