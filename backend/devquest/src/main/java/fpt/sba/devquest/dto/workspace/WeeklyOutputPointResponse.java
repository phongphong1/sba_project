package fpt.sba.devquest.dto.workspace;

public record WeeklyOutputPointResponse(
        int id,
        String label,
        int completedTasks,
        int goalTasks
) {
}
