package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.task.CreateTaskRequest;
import fpt.sba.devquest.dto.task.TaskResponse;
import fpt.sba.devquest.dto.task.UpdateTaskRequest;
import fpt.sba.devquest.entity.Board;
import fpt.sba.devquest.entity.Column;
import fpt.sba.devquest.entity.Task;
import fpt.sba.devquest.entity.SubTask;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.repository.BoardRepository;
import fpt.sba.devquest.repository.ColumnRepository;
import fpt.sba.devquest.repository.TaskRepository;
import fpt.sba.devquest.repository.SubtaskRepository;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.service.RealtimeAuthorizationService;
import fpt.sba.devquest.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter INPUT_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final UserRepository userRepository;
    private final RealtimeAuthorizationService realtimeAuthorizationService;

    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        User currentUser = getCurrentUser();
        Board board = boardRepository.findById(request.boardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found."));

        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), board.getWorkspace().getId());

        Column column = columnRepository.findByIdAndBoard_Id(request.columnId(), board.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found in board."));

        int nextPosition = taskRepository.findTopByColumn_IdOrderByPositionDesc(column.getId())
                .map(task -> task.getPosition().intValue() + 1000)
                .orElse(1000);

        Task task = new Task();
        task.setColumn(column);
        task.setCreator(currentUser);
        task.setAssignee(resolveAssignee(request.assigneeId()));
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setPriority(normalizePriority(request.priority()));
        task.setEstimateHours(request.estimateHours());
        task.setColor(normalizeColor(request.color()));
        task.setStartDate(parseDateTime(request.startDate()));
        task.setDueDate(parseDateTime(request.dueDate()));
        task.setPosition((double) nextPosition);
        task.setProgress(0);
        task.setReminderEnabled(false);

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));

        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());
        return toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));

        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());

        Long boardId = request.boardId() != null ? request.boardId() : task.getColumn().getBoard().getId();
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found."));
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), board.getWorkspace().getId());

        Long columnId = request.columnId() != null ? request.columnId() : task.getColumn().getId();
        Column column = columnRepository.findByIdAndBoard_Id(columnId, board.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found in board."));

        task.setColumn(column);
        if (request.title() != null && !request.title().isBlank()) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.priority() != null) {
            task.setPriority(normalizePriority(request.priority()));
        }
        if (request.estimateHours() != null) {
            task.setEstimateHours(request.estimateHours());
        }
        if (request.color() != null) {
            task.setColor(normalizeColor(request.color()));
        }
        if (request.startDate() != null) {
            task.setStartDate(parseDateTime(request.startDate()));
        }
        if (request.dueDate() != null) {
            task.setDueDate(parseDateTime(request.dueDate()));
        }
        if (request.assigneeId() != null) {
            task.setAssignee(resolveAssignee(request.assigneeId()));
        }

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));

        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());
        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public void updateTaskPositionWs(Long taskId, Long toColumnId, Double position) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return;
        }
        Column toColumn = columnRepository.findById(toColumnId).orElse(null);
        if (toColumn == null) {
            return;
        }
        task.setColumn(toColumn);
        task.setPosition(position);
        taskRepository.save(task);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<fpt.sba.devquest.dto.task.SubtaskResponse> getSubtasks(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());

        return subtaskRepository.findByTask_Id(taskId).stream()
                .map(s -> new fpt.sba.devquest.dto.task.SubtaskResponse(s.getId(), taskId, s.getContent(), Boolean.TRUE.equals(s.getIsCompleted())))
                .toList();
    }

    @Override
    @Transactional
    public fpt.sba.devquest.dto.task.SubtaskResponse createSubtask(Long taskId, fpt.sba.devquest.dto.task.CreateSubtaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());

        SubTask subtask = new SubTask();
        subtask.setTask(task);
        subtask.setContent(request.text());
        subtask.setIsCompleted(false);
        SubTask saved = subtaskRepository.save(subtask);

        return new fpt.sba.devquest.dto.task.SubtaskResponse(saved.getId(), taskId, saved.getContent(), Boolean.TRUE.equals(saved.getIsCompleted()));
    }

    @Override
    @Transactional
    public fpt.sba.devquest.dto.task.SubtaskResponse updateSubtask(Long taskId, Long subtaskId, fpt.sba.devquest.dto.task.UpdateSubtaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());

        SubTask subtask = subtaskRepository.findByIdAndTask_Id(subtaskId, taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtask not found in task."));

        if (request.text() != null && !request.text().isBlank()) {
            subtask.setContent(request.text());
        }
        if (request.done() != null) {
            subtask.setIsCompleted(request.done());
        }
        SubTask saved = subtaskRepository.save(subtask);
        return new fpt.sba.devquest.dto.task.SubtaskResponse(saved.getId(), taskId, saved.getContent(), Boolean.TRUE.equals(saved.getIsCompleted()));
    }

    @Override
    @Transactional
    public void deleteSubtask(Long taskId, Long subtaskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
        User currentUser = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(currentUser.getId(), task.getColumn().getBoard().getWorkspace().getId());

        SubTask subtask = subtaskRepository.findByIdAndTask_Id(subtaskId, taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtask not found in task."));
        subtaskRepository.delete(subtask);
    }

    private User resolveAssignee(Long assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        return userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee not found."));
    }

    private Instant parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            LocalDateTime dateTime = LocalDateTime.parse(value, INPUT_DATE_TIME);
            return dateTime.atZone(ZONE).toInstant();
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid datetime format. Use yyyy-MM-dd'T'HH:mm");
        }
    }

    private String normalizePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return "MEDIUM";
        }
        return priority.trim().toUpperCase();
    }

    private String normalizeColor(String color) {
        if (color == null || color.isBlank()) {
            return "#5051F9";
        }
        return color;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized."));
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse.AssigneeSummary assignee = null;
        if (task.getAssignee() != null) {
            assignee = new TaskResponse.AssigneeSummary(task.getAssignee().getId(), task.getAssignee().getFullname());
        }

        return new TaskResponse(
                task.getId(),
                task.getColumn().getBoard().getId(),
                task.getColumn().getId(),
                task.getTitle(),
                normalizePriority(task.getPriority()),
                task.getPosition() == null ? 0 : task.getPosition().intValue(),
                task.getStartDate(),
                task.getDueDate(),
                assignee,
                task.getDescription(),
                task.getEstimateHours(),
                task.getColor(),
                task.getProgress()
        );
    }
}
