package fpt.sba.devquest.dto.column;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReorderColumnsRequest(
        @NotEmpty(message = "Columns are required.")
        @Valid
        List<Item> columns
) {
    public record Item(
            @NotNull(message = "Column id is required.")
            Long id,
            @NotNull(message = "Position is required.")
            Integer position
    ) {
    }
}
