package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.notification.NotificationActionResponse;
import fpt.sba.devquest.dto.notification.NotificationCreateRequest;
import fpt.sba.devquest.dto.notification.NotificationResponse;
import fpt.sba.devquest.dto.ws.NotificationPayload;
import fpt.sba.devquest.entity.Notification;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.repository.NotificationRepository;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.service.NotificationService;
import fpt.sba.devquest.service.RealtimeEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final RealtimeEventService realtimeEventService;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

        @Override
        @Transactional
        public NotificationResponse createNotification(NotificationCreateRequest request) {
        User sender = getCurrentUser();
        User recipient = userRepository.findById(request.recipientId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found."));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSenderId(sender.getId());
        notification.setType(request.type() == null || request.type().isBlank() ? "GENERAL" : request.type());
        notification.setMessage(request.title());
        notification.setIsRead(false);
        notification.setCreatedAt(Instant.now());

        Notification saved = notificationRepository.save(notification);
        NotificationPayload payload = new NotificationPayload(
            saved.getId(),
            saved.getMessage(),
            toRelativeTime(saved.getCreatedAt()),
            true
        );
        realtimeEventService.publishNotificationToUser(recipient.getEmail(), payload);

        return toResponse(saved);
        }

    @Override
    @Transactional
    public NotificationActionResponse markAllAsRead() {
        User user = getCurrentUser();
        notificationRepository.markAllAsRead(user.getId());
        return new NotificationActionResponse("All notifications marked as read");
    }

    @Override
    @Transactional
    public NotificationActionResponse markAsRead(Long notificationId) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndRecipient_Id(notificationId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));

        notification.setIsRead(true);
        notificationRepository.save(notification);
        return new NotificationActionResponse("Notification marked as read");
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized."));
    }

    private NotificationResponse toResponse(Notification notification) {
        boolean unread = !Boolean.TRUE.equals(notification.getIsRead());
        String title = notification.getMessage();
        String time = toRelativeTime(notification.getCreatedAt());
        return new NotificationResponse(notification.getId(), title, time, unread);
    }

    private String toRelativeTime(Instant createdAt) {
        if (createdAt == null) {
            return "just now";
        }

        long minutes = Math.max(0, Duration.between(createdAt, Instant.now()).toMinutes());
        if (minutes < 1) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes + "m ago";
        }

        long hours = minutes / 60;
        if (hours < 24) {
            return hours + "h ago";
        }

        long days = hours / 24;
        return days + "d ago";
    }
}
