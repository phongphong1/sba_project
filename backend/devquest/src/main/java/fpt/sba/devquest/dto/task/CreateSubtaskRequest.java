package fpt.sba.devquest.dto.task;

import jakarta.validation.constraints.NotBlank;

public record CreateSubtaskRequest(
        @NotBlank(message = "Text cannot be empty")
        String text
) {
}
