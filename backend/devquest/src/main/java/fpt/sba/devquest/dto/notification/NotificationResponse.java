package fpt.sba.devquest.dto.notification;

public record NotificationResponse(
        Long id,
        String title,
        String time,
        boolean unread
) {
}
