package fpt.sba.devquest.dto.ws;

public record ConversationMessagePayload(
        Long conversationId,
        Long senderId,
        String content
) {
}
