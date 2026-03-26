package fpt.sba.devquest.dto.workspace;

import java.util.List;

public record WorkspaceTaskSummaryResponse(
        List<MemberItem> members,
        List<TaskItem> tasks
) {
    public record MemberItem(
            String id,
            String fullName,
            String role,
            String avatar,
            String color
    ) {
    }

    public record AssigneeItem(
            String id,
            String name,
            String avatar,
            String color
    ) {
    }

    public record TaskItem(
            String id,
            String boardId,
            String boardName,
            int position,
            String title,
            String status,
            String priority,
            String sprint,
            int progress,
            String dueDate,
            boolean reminderEnabled,
            AssigneeItem assignee,
            List<MemberItem> members,
            int estimateHours
    ) {
    }
}
