package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByWorkspace_IdOrderByPositionAscStartTimeAsc(Long workspaceId);
}
