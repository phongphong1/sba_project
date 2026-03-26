package fpt.sba.devquest.dto.ws;

public record SendMessageCommand(
        Long conversationId,
        String content
) {
}
