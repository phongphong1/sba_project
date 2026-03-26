package fpt.sba.devquest.dto.workspace;

import java.util.List;

public record WorkspaceTimelineResponse(
        List<MemberItem> members,
        List<TaskItem> tasks
) {
    public record MemberItem(
            Long id,
            String name,
            String role,
            String avatar,
            String color
    ) {
    }

    public record AssigneeItem(
            Long id,
            String name,
            String role,
            String avatar,
            String color
    ) {
    }

    public record TaskItem(
            Long id,
            String title,
            AssigneeItem assignee,
            String startDate,
            String dueDate,
            String color,
            int progress
    ) {
    }
}
