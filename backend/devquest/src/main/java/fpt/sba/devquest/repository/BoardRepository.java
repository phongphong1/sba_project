package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    long countByWorkspace_Id(Long workspaceId);

    List<Board> findByWorkspace_IdOrderByCreatedAtAsc(Long workspaceId);

    Optional<Board> findByIdAndWorkspace_Id(Long id, Long workspaceId);
}
