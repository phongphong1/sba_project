package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.notification.NotificationActionResponse;
import fpt.sba.devquest.dto.notification.NotificationCreateRequest;
import fpt.sba.devquest.dto.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications();

    NotificationResponse createNotification(NotificationCreateRequest request);

    NotificationActionResponse markAllAsRead();

    NotificationActionResponse markAsRead(Long notificationId);
}
