package fpt.sba.devquest.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateBoardRequest(
        @NotBlank(message = "Board name is required.")
        @Size(max = 100, message = "Board name must be at most 100 characters.")
        String name
) {
}
