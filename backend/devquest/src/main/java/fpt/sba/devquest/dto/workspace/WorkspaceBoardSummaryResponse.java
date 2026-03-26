package fpt.sba.devquest.dto.workspace;

public record WorkspaceBoardSummaryResponse(
        String id,
        String workspaceId,
        String name,
        String description,
        long columnCount,
        long taskCount,
        long completedTaskCount
) {
}
