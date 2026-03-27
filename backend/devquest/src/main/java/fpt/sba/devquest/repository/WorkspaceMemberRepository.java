package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.WorkspaceMember;
import fpt.sba.devquest.entity.WorkspaceMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, WorkspaceMemberId> {
    long countByUser_Id(Long userId);

    List<WorkspaceMember> findByUser_Id(Long userId);

    List<WorkspaceMember> findByWorkspace_Id(Long workspaceId);

    boolean existsByUser_IdAndWorkspace_Id(Long userId, Long workspaceId);

    java.util.Optional<WorkspaceMember> findByWorkspace_IdAndUser_Id(Long workspaceId, Long userId);
}
