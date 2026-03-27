package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.task.CreateTaskRequest;
import fpt.sba.devquest.dto.task.TaskResponse;
import fpt.sba.devquest.dto.task.UpdateTaskRequest;
import fpt.sba.devquest.dto.task.CreateSubtaskRequest;
import fpt.sba.devquest.dto.task.UpdateSubtaskRequest;
import fpt.sba.devquest.dto.task.SubtaskResponse;
import fpt.sba.devquest.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
        return taskService.createTask(request);
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return taskService.getTask(id);
    }

    @PatchMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/{taskId}/checklist")
    public java.util.List<SubtaskResponse> getSubtasks(@PathVariable Long taskId) {
        return taskService.getSubtasks(taskId);
    }

    @PostMapping("/{taskId}/checklist")
    public SubtaskResponse createSubtask(@PathVariable Long taskId, @Valid @RequestBody CreateSubtaskRequest request) {
        return taskService.createSubtask(taskId, request);
    }

    @PatchMapping("/{taskId}/checklist/{itemId}")
    public SubtaskResponse updateSubtask(@PathVariable Long taskId, @PathVariable Long itemId, @RequestBody UpdateSubtaskRequest request) {
        return taskService.updateSubtask(taskId, itemId, request);
    }

    @DeleteMapping("/{taskId}/checklist/{itemId}")
    public void deleteSubtask(@PathVariable Long taskId, @PathVariable Long itemId) {
        taskService.deleteSubtask(taskId, itemId);
    }
}
