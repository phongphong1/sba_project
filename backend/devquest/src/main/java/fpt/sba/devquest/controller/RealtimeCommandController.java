package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.ws.ConversationMessagePayload;
import fpt.sba.devquest.dto.ws.SendMessageCommand;
import fpt.sba.devquest.dto.ws.TaskMoveCommand;
import fpt.sba.devquest.dto.ws.TaskMovedPayload;
import fpt.sba.devquest.entity.UserDetailsImpl;
import fpt.sba.devquest.service.RealtimeAuthorizationService;
import fpt.sba.devquest.service.RealtimeEventService;
import fpt.sba.devquest.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequiredArgsConstructor
public class RealtimeCommandController {

    private final RealtimeEventService realtimeEventService;
    private final RealtimeAuthorizationService realtimeAuthorizationService;
    private final TaskService taskService;

    @MessageMapping("/messages/send")
    public void sendMessage(SendMessageCommand command, Authentication authentication) {
        Long senderId = resolveUserId(authentication);
        if (senderId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized websocket command.");
        }
        realtimeAuthorizationService.assertConversationAccess(senderId, command.conversationId());

        ConversationMessagePayload payload = new ConversationMessagePayload(
                command.conversationId(),
                senderId,
                command.content()
        );
        realtimeEventService.publishMessageToConversation(command.conversationId(), payload);
    }

    @MessageMapping("/tasks/move")
    public void moveTask(TaskMoveCommand command, Authentication authentication) {
        Long movedByUserId = resolveUserId(authentication);
        if (movedByUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized websocket command.");
        }
        realtimeAuthorizationService.assertWorkspaceAccess(movedByUserId, command.workspaceId());

        taskService.updateTaskPositionWs(command.taskId(), command.toColumnId(), command.position());

        TaskMovedPayload payload = new TaskMovedPayload(
                command.workspaceId(),
                command.taskId(),
                command.fromColumnId(),
                command.toColumnId(),
                command.position(),
                movedByUserId
        );
        realtimeEventService.publishTaskMovedToWorkspace(command.workspaceId(), payload);
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userDetails.getId();
        }
        return null;
    }
}
