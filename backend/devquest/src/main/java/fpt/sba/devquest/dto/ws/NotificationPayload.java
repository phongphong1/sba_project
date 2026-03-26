package fpt.sba.devquest.dto.ws;

public record NotificationPayload(
        Long id,
        String title,
        String time,
        boolean unread
) {
}
