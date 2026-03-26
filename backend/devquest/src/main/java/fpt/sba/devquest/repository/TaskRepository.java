package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("select count(t) from Task t where t.assignee.id = :userId and t.progress = 100")
    long countCompletedByAssigneeId(@Param("userId") Long userId);

    List<Task> findByColumn_Board_Workspace_IdOrderByPositionAsc(Long workspaceId);

    List<Task> findByColumn_Board_IdOrderByPositionAsc(Long boardId);

    Optional<Task> findTopByColumn_IdOrderByPositionDesc(Long columnId);
}
