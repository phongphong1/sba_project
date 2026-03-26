package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    long countByUser_Id(Long userId);
}
