package fpt.sba.devquest.dto.workspace;

public record CreateBoardResponse(
        Long id,
        Long workspaceId,
        String name
) {
}
