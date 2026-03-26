package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTask_IdIn(List<Long> taskIds);
}
