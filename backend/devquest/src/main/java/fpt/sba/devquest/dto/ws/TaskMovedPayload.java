package fpt.sba.devquest.dto.ws;

public record TaskMovedPayload(
        Long workspaceId,
        Long taskId,
        Long fromColumnId,
        Long toColumnId,
        Double position,
        Long movedByUserId
) {
}
