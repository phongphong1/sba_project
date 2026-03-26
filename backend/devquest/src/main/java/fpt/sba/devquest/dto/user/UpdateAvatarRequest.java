package fpt.sba.devquest.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UpdateAvatarRequest(
        @NotBlank(message = "Avatar URL is required.")
        String avatarUrl
) {
}
