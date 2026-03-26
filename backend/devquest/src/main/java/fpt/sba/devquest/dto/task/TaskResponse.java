package fpt.sba.devquest.dto.task;

import java.time.Instant;

public record TaskResponse(
        Long id,
        Long boardId,
        Long columnId,
        String title,
        String priority,
        int position,
        Instant startDate,
        Instant dueDate,
        AssigneeSummary assignee,
        String description,
        Integer estimateHours,
        String color,
        Integer progress
) {
    public record AssigneeSummary(Long id, String fullName) {
    }
}
