package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.ws.ConversationMessagePayload;
import fpt.sba.devquest.dto.ws.NotificationPayload;
import fpt.sba.devquest.dto.ws.TaskMovedPayload;

public interface RealtimeEventService {

    void publishNotificationToUser(String username, NotificationPayload payload);

    void publishMessageToConversation(Long conversationId, ConversationMessagePayload payload);

    void publishTaskMovedToWorkspace(Long workspaceId, TaskMovedPayload payload);
}
