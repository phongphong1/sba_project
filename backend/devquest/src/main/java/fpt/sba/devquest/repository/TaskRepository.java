package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("select count(t) from Task t where t.assignee.id = :userId and t.progress = 100")
    long countCompletedByAssigneeId(@Param("userId") Long userId);
}
