package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.task.CreateTaskRequest;
import fpt.sba.devquest.dto.task.TaskResponse;
import fpt.sba.devquest.dto.task.UpdateTaskRequest;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    TaskResponse getTask(Long id);

    TaskResponse updateTask(Long id, UpdateTaskRequest request);

    void deleteTask(Long id);

    void updateTaskPositionWs(Long taskId, Long toColumnId, Double position);

    fpt.sba.devquest.dto.task.SubtaskResponse createSubtask(Long taskId, fpt.sba.devquest.dto.task.CreateSubtaskRequest request);

    fpt.sba.devquest.dto.task.SubtaskResponse updateSubtask(Long taskId, Long subtaskId, fpt.sba.devquest.dto.task.UpdateSubtaskRequest request);

    void deleteSubtask(Long taskId, Long subtaskId);

    java.util.List<fpt.sba.devquest.dto.task.SubtaskResponse> getSubtasks(Long taskId);
}
