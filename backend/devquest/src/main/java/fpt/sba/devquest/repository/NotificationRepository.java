package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(Long recipientId);

    Optional<Notification> findByIdAndRecipient_Id(Long id, Long recipientId);

    @Modifying
    @Query("update Notification n set n.isRead = true where n.recipient.id = :recipientId and (n.isRead = false or n.isRead is null)")
    int markAllAsRead(@Param("recipientId") Long recipientId);
}
