package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
    long countByWorkspace_Id(Long workspaceId);
}
