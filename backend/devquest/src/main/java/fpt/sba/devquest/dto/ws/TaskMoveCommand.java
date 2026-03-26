package fpt.sba.devquest.dto.ws;

public record TaskMoveCommand(
        Long workspaceId,
        Long taskId,
        Long fromColumnId,
        Long toColumnId,
        Double position
) {
}
