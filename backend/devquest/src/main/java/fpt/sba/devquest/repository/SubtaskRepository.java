package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubtaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByTask_Id(Long taskId);
    List<SubTask> findByTask_IdIn(List<Long> taskIds);
    Optional<SubTask> findByIdAndTask_Id(Long id, Long taskId);
    long countByTask_Id(Long taskId);
    long countByTask_IdAndIsCompletedTrue(Long taskId);
}
