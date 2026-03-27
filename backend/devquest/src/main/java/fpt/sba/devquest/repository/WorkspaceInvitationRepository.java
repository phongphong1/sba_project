package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.WorkspaceInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceInvitationRepository extends JpaRepository<WorkspaceInvitation, Long> {
    Optional<WorkspaceInvitation> findByToken(String token);
    Optional<WorkspaceInvitation> findByWorkspace_IdAndEmailAndStatus(Long workspaceId, String email, String status);
    java.util.List<WorkspaceInvitation> findByEmailAndStatusOrderByCreatedAtDesc(String email, String status);
}
