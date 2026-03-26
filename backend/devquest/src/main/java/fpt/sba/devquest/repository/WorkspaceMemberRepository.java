package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.WorkspaceMember;
import fpt.sba.devquest.entity.WorkspaceMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, WorkspaceMemberId> {
    long countByUser_Id(Long userId);

    List<WorkspaceMember> findByUser_Id(Long userId);
}
