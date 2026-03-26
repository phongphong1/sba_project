package fpt.sba.devquest.dto.workspace;

import java.util.List;

public record WorkspaceBoardDetailResponse(
        WorkspaceItem workspace,
        List<BoardSummaryItem> boards,
        BoardItem board,
        List<MemberItem> workspaceMembers,
        List<ColumnItem> columns,
        List<TaskItem> tasks
) {
    public record WorkspaceItem(
            Long id,
            String name,
            String description
    ) {
    }

    public record BoardSummaryItem(
            Long id,
            Long workspaceId,
            String name,
            String description,
            long columnCount,
            long taskCount
    ) {
    }

    public record BoardItem(
            Long id,
            Long workspaceId,
            String name,
            String description
    ) {
    }

    public record MemberItem(
            Long id,
            String fullName,
            String role,
            String avatar,
            String color
    ) {
    }

    public record ColumnItem(
            Long id,
            String name,
            int position
    ) {
    }

    public record AssigneeItem(
            Long id,
            String name,
            String avatar,
            String color
    ) {
    }

    public record ChecklistItem(
            Long id,
            String text,
            boolean done
    ) {
    }

    public record CommentItem(
            Long id,
            String author,
            String avatar,
            String color,
            String message,
            String time
    ) {
    }

    public record AttachmentItem(
            Long id,
            String name,
            String meta
    ) {
    }

    public record TaskItem(
            Long id,
            Long columnId,
            String title,
            String priority,
            int position,
            String dueDate,
            int progress,
            AssigneeItem assignee,
            String description,
            List<ChecklistItem> checklist,
            List<CommentItem> comments,
            List<AttachmentItem> attachments
    ) {
    }
}
