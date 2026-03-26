package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.ws.ConversationMessagePayload;
import fpt.sba.devquest.dto.ws.NotificationPayload;
import fpt.sba.devquest.dto.ws.TaskMovedPayload;
import fpt.sba.devquest.dto.ws.WsEvent;
import fpt.sba.devquest.service.RealtimeEventService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RealtimeEventServiceImpl implements RealtimeEventService {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public RealtimeEventServiceImpl(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void publishNotificationToUser(String username, NotificationPayload payload) {
        WsEvent event = createEvent("NOTIFICATION_CREATED", "/user/queue/notifications", payload);
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/notifications", event);
    }

    @Override
    public void publishMessageToConversation(Long conversationId, ConversationMessagePayload payload) {
        String channel = "/topic/conversations/" + conversationId + "/messages";
        WsEvent event = createEvent("MESSAGE_CREATED", channel, payload);
        simpMessagingTemplate.convertAndSend(channel, event);
    }

    @Override
    public void publishTaskMovedToWorkspace(Long workspaceId, TaskMovedPayload payload) {
        String channel = "/topic/workspaces/" + workspaceId + "/tasks";
        WsEvent event = createEvent("TASK_MOVED", channel, payload);
        simpMessagingTemplate.convertAndSend(channel, event);
    }

    private WsEvent createEvent(String type, String channel, Object payload) {
        return new WsEvent(
                UUID.randomUUID().toString(),
                type,
                channel,
                Instant.now(),
                payload
        );
    }
}
