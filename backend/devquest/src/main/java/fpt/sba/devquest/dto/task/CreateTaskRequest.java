package fpt.sba.devquest.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
        @NotNull(message = "Board id is required.")
        Long boardId,
        @NotNull(message = "Column id is required.")
        Long columnId,
        @NotBlank(message = "Title is required.")
        @Size(max = 255, message = "Title must be at most 255 characters.")
        String title,
        String description,
        String priority,
        Integer estimateHours,
        String color,
        String startDate,
        String dueDate,
        Long assigneeId
) {
}
