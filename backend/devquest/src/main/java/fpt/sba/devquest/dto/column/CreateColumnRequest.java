package fpt.sba.devquest.dto.column;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateColumnRequest(
        @NotBlank(message = "Column name is required.")
        @Size(max = 50, message = "Column name must be at most 50 characters.")
        String name
) {
}
