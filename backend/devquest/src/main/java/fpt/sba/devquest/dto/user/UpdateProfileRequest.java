package fpt.sba.devquest.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Full name is required.")
        @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters.")
        String fullName,
        String bio,
        @NotNull(message = "Email notifications is required.")
        Boolean emailNotifications
) {
}
