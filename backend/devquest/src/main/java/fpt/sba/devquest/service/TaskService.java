package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.task.CreateTaskRequest;
import fpt.sba.devquest.dto.task.TaskResponse;
import fpt.sba.devquest.dto.task.UpdateTaskRequest;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    TaskResponse getTask(Long id);

    TaskResponse updateTask(Long id, UpdateTaskRequest request);

    void deleteTask(Long id);
}
