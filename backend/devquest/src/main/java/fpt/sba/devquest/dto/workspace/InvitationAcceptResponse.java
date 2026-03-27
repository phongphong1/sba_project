package fpt.sba.devquest.dto.workspace;

public record InvitationAcceptResponse(
        String jwtToken,
        String workspaceId,
        String workspaceName,
        String message
) {}
