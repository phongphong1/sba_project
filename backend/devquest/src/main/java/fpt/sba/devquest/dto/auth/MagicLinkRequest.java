package fpt.sba.devquest.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MagicLinkRequest(
        @NotBlank(message = "Email is required.")
        @Email(message = "Email is invalid.")
        String email
) {
}
