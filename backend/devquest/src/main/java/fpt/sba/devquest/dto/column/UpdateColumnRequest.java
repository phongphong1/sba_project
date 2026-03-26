package fpt.sba.devquest.dto.column;

import jakarta.validation.constraints.Size;

public record UpdateColumnRequest(
        @Size(max = 50, message = "Column name must be at most 50 characters.")
        String name,
        Integer position
) {
}
