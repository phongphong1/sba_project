package fpt.sba.devquest.dto.task;

import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
        Long boardId,
        Long columnId,
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
