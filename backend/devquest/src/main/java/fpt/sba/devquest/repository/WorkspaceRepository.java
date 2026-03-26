package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    boolean existsByIdAndOwner_Id(Long id, Long ownerId);
}
