package fpt.sba.devquest.service;

public interface RealtimeAuthorizationService {

    void assertWorkspaceAccess(Long userId, Long workspaceId);

    void assertConversationAccess(Long userId, Long conversationId);
}
