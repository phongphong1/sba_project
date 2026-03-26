package fpt.sba.devquest.dto.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationCreateRequest(
        @NotNull(message = "Recipient id is required.")
        Long recipientId,
        @NotBlank(message = "Title is required.")
        String title,
        String type
) {
}
