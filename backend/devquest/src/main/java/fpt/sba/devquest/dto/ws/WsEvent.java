package fpt.sba.devquest.dto.ws;

import java.time.Instant;

public record WsEvent(
        String eventId,
        String type,
        String channel,
        Instant timestamp,
        Object payload
) {
}
