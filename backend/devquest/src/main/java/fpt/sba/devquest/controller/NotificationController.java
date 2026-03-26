package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.notification.NotificationActionResponse;
import fpt.sba.devquest.dto.notification.NotificationCreateRequest;
import fpt.sba.devquest.dto.notification.NotificationResponse;
import fpt.sba.devquest.dto.ws.NotificationPayload;
import fpt.sba.devquest.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getNotifications() {
        return notificationService.getMyNotifications();
    }

    @PostMapping
    public NotificationResponse createNotification(@Valid @RequestBody NotificationCreateRequest request) {
        return notificationService.createNotification(request);
    }

    @PatchMapping("/read-all")
    public NotificationActionResponse markAllAsRead() {
        return notificationService.markAllAsRead();
    }

    @PatchMapping("/{id}/read")
    public NotificationActionResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @GetMapping("/test")
    public String test() {

        notificationService.createNotification(new NotificationCreateRequest(
                2L,
                "This is a test notification.",
                "ASSIGNMENT"
        ));
        return "Notification API is working!";
    }
}
