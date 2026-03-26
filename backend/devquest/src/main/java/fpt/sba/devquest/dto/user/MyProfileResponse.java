package fpt.sba.devquest.dto.user;

public record MyProfileResponse(UserPayload user, StatsPayload stats) {

    public record UserPayload(
            Long id,
            String fullName,
            String email,
            String avatarUrl,
            String systemRole,
            String bio,
            Boolean emailNotifications
    ) {
    }

    public record StatsPayload(
            Long workspacesCount,
            Long tasksCompleted,
            Long totalComments,
            String activeSince
    ) {
    }
}
