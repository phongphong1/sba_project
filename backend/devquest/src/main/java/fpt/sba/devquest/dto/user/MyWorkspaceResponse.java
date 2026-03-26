package fpt.sba.devquest.dto.user;

public record MyWorkspaceResponse(
        String id,
        String name,
        String description,
        String role,
        Long boardCount,
        String activeSince
) {
}
