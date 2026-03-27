package fpt.sba.devquest.dto.workspace;

import java.time.Instant;

public record UserInvitationResponse(
    Long id,
    Long workspaceId,
    String workspaceName,
    String inviterName,
    String token,
    String status,
    Instant expiresAt,
    Instant createdAt
) {
}
