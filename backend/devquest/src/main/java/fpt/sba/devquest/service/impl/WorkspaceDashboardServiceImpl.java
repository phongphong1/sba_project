package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.workspace.WeeklyOutputPointResponse;
import fpt.sba.devquest.dto.workspace.CreateBoardRequest;
import fpt.sba.devquest.dto.workspace.CreateBoardResponse;
import fpt.sba.devquest.dto.workspace.CreateWorkspaceRequest;
import fpt.sba.devquest.dto.workspace.CreateWorkspaceResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceBoardDetailResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceBoardSummaryResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceDetailResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceScheduleItemResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceTaskSummaryResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceTimelineResponse;
import fpt.sba.devquest.entity.Attachment;
import fpt.sba.devquest.entity.Board;
import fpt.sba.devquest.entity.Schedule;
import fpt.sba.devquest.entity.Comment;
import fpt.sba.devquest.entity.SubTask;
import fpt.sba.devquest.entity.Task;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.entity.Workspace;
import fpt.sba.devquest.entity.WorkspaceMember;
import fpt.sba.devquest.entity.WorkspaceMemberId;
import fpt.sba.devquest.repository.AttachmentRepository;
import fpt.sba.devquest.repository.BoardRepository;
import fpt.sba.devquest.repository.ColumnRepository;
import fpt.sba.devquest.repository.CommentRepository;
import fpt.sba.devquest.repository.ScheduleRepository;
import fpt.sba.devquest.repository.SubtaskRepository;
import fpt.sba.devquest.repository.TaskRepository;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.repository.WorkspaceMemberRepository;
import fpt.sba.devquest.repository.WorkspaceRepository;
import fpt.sba.devquest.service.WorkspaceDashboardService;
import fpt.sba.devquest.service.EmailService;
import fpt.sba.devquest.service.MagicLinkTokenService;
import fpt.sba.devquest.dto.workspace.InviteMembersRequest;
import fpt.sba.devquest.dto.workspace.InvitationAcceptResponse;
import fpt.sba.devquest.entity.WorkspaceInvitation;
import fpt.sba.devquest.dto.workspace.UserInvitationResponse;
import fpt.sba.devquest.repository.WorkspaceInvitationRepository;
import fpt.sba.devquest.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class WorkspaceDashboardServiceImpl implements WorkspaceDashboardService {

    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_ONLY_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DUE_TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
    private static final List<String> COLORS = List.of("#EEF2FF", "#DBEAFE", "#E0F2FE", "#DCFCE7", "#FEF3C7", "#FEE2E2");

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final AttachmentRepository attachmentRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final CommentRepository commentRepository;
    private final ScheduleRepository scheduleRepository;
    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final MagicLinkTokenService magicLinkTokenService;
    private final WorkspaceInvitationRepository workspaceInvitationRepository;
    private final JwtUtils jwtUtils;

    @org.springframework.beans.factory.annotation.Value("${app.invite.base-url:http://localhost:5173/invite}")
    private String inviteBaseUrl;

    @org.springframework.beans.factory.annotation.Value("${app.invite.expiry-hours:72}")
    private long inviteExpiryHours;

    @Override
    @Transactional
    public CreateWorkspaceResponse createWorkspace(CreateWorkspaceRequest request) {
        User user = getCurrentUser();

        Workspace workspace = new Workspace();
        workspace.setName(request.name());
        workspace.setDescription(request.description());
        workspace.setOwner(user);
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        WorkspaceMember ownerMembership = new WorkspaceMember();
        WorkspaceMemberId ownerMembershipId = new WorkspaceMemberId();
        ownerMembershipId.setWorkspaceId(savedWorkspace.getId());
        ownerMembershipId.setUserId(user.getId());
        ownerMembership.setId(ownerMembershipId);
        ownerMembership.setWorkspace(savedWorkspace);
        ownerMembership.setUser(user);
        ownerMembership.setRole("ADMIN");
        workspaceMemberRepository.save(ownerMembership);

        return new CreateWorkspaceResponse(
                savedWorkspace.getId(),
                savedWorkspace.getName(),
                savedWorkspace.getDescription()
        );
    }

    @Override
    @Transactional
    public CreateBoardResponse createBoard(String workspaceId, CreateBoardRequest request) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);

        Board board = new Board();
        board.setWorkspace(workspace);
        board.setName(request.name());
        Board savedBoard = boardRepository.save(board);

        return new CreateBoardResponse(
                savedBoard.getId(),
                workspace.getId(),
                savedBoard.getName()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceDetailResponse getWorkspace(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        return new WorkspaceDetailResponse(
                workspaceKey(workspace.getId()),
                workspace.getName(),
                workspace.getDescription()
        );
    }

        @Override
        @Transactional(readOnly = true)
        public WorkspaceBoardDetailResponse getBoardDetail(String workspaceId, String boardId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        Long parsedBoardId = parseBoardId(boardId);
        Board board = boardRepository.findByIdAndWorkspace_Id(parsedBoardId, workspace.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found."));

        List<Board> allBoards = boardRepository.findByWorkspace_IdOrderByCreatedAtAsc(workspace.getId());
        List<WorkspaceBoardDetailResponse.BoardSummaryItem> boardSummaries = allBoards.stream().map(b -> {
            List<Task> boardTasks = taskRepository.findByColumn_Board_IdOrderByPositionAsc(b.getId());
            return new WorkspaceBoardDetailResponse.BoardSummaryItem(
                b.getId(),
                workspace.getId(),
                b.getName(),
                safe(b.getStatus()),
                columnRepository.countByBoard_Id(b.getId()),
                boardTasks.size()
            );
        }).toList();

        List<WorkspaceMember> memberships = workspaceMemberRepository.findByWorkspace_Id(workspace.getId());
        List<WorkspaceBoardDetailResponse.MemberItem> workspaceMembers = memberships.stream()
            .map(member -> {
                User user = member.getUser();
                return new WorkspaceBoardDetailResponse.MemberItem(
                    user.getId(),
                    safe(user.getFullname()),
                    normalizeRole(member.getRole()),
                    initials(user.getFullname(), user.getEmail()),
                    colorForUser(user.getId())
                );
            })
            .toList();

        List<fpt.sba.devquest.entity.Column> columns = columnRepository.findByBoard_IdOrderByPositionAsc(board.getId());
        List<WorkspaceBoardDetailResponse.ColumnItem> columnItems = columns.stream().map(c ->
            new WorkspaceBoardDetailResponse.ColumnItem(
                c.getId(),
                c.getTitle(),
                c.getPosition() == null ? 0 : c.getPosition().intValue()
            )).toList();

        List<Task> tasks = taskRepository.findByColumn_Board_IdOrderByPositionAsc(board.getId());
        List<Long> taskIds = tasks.stream().map(Task::getId).toList();

        Map<Long, List<Comment>> commentsByTaskId = taskIds.isEmpty()
            ? Map.of()
            : commentRepository.findByTask_IdIn(taskIds).stream()
            .collect(Collectors.groupingBy(comment -> comment.getTask().getId()));
        Map<Long, List<Attachment>> attachmentsByTaskId = taskIds.isEmpty()
            ? Map.of()
            : attachmentRepository.findByTask_IdIn(taskIds).stream()
            .collect(Collectors.groupingBy(attachment -> attachment.getTask().getId()));
        Map<Long, List<SubTask>> subtasksByTaskId = taskIds.isEmpty()
            ? Map.of()
            : subtaskRepository.findByTask_IdIn(taskIds).stream()
            .collect(Collectors.groupingBy(subtask -> subtask.getTask().getId()));

        List<WorkspaceBoardDetailResponse.TaskItem> taskItems = tasks.stream().map(task -> {
            WorkspaceBoardDetailResponse.AssigneeItem assignee = null;
            if (task.getAssignee() != null) {
            User a = task.getAssignee();
            assignee = new WorkspaceBoardDetailResponse.AssigneeItem(
                a.getId(),
                safe(a.getFullname()),
                initials(a.getFullname(), a.getEmail()),
                colorForUser(a.getId())
            );
            }

            List<WorkspaceBoardDetailResponse.CommentItem> commentItems = commentsByTaskId
                .getOrDefault(task.getId(), List.of())
                .stream()
                .map(comment -> new WorkspaceBoardDetailResponse.CommentItem(
                    comment.getId(),
                    safe(comment.getUser().getFullname()),
                    initials(comment.getUser().getFullname(), comment.getUser().getEmail()),
                    colorForUser(comment.getUser().getId()),
                    comment.getContent(),
                    toRelativeTime(comment.getCreatedAt())
                )).toList();

            List<WorkspaceBoardDetailResponse.AttachmentItem> attachmentItems = attachmentsByTaskId
                .getOrDefault(task.getId(), List.of())
                .stream()
                .map(attachment -> new WorkspaceBoardDetailResponse.AttachmentItem(
                    attachment.getId(),
                    attachment.getFileName(),
                    safe(attachment.getFileSizeMeta())
                )).toList();

            List<WorkspaceBoardDetailResponse.ChecklistItem> checklistItems = subtasksByTaskId
                .getOrDefault(task.getId(), List.of())
                .stream()
                .map(subtask -> new WorkspaceBoardDetailResponse.ChecklistItem(
                    subtask.getId(),
                    subtask.getContent(),
                    Boolean.TRUE.equals(subtask.getIsCompleted())
                )).toList();

            return new WorkspaceBoardDetailResponse.TaskItem(
                task.getId(),
                task.getColumn().getId(),
                task.getTitle(),
                normalizePriority(task.getPriority()).toUpperCase(Locale.ENGLISH),
                task.getPosition() == null ? 0 : task.getPosition().intValue(),
                formatTaskDueDateShort(task.getDueDate()),
                progress(task),
                assignee,
                safe(task.getDescription()),
                checklistItems,
                commentItems,
                attachmentItems
            );
        }).toList();

        return new WorkspaceBoardDetailResponse(
            new WorkspaceBoardDetailResponse.WorkspaceItem(
                workspace.getId(),
                workspace.getName(),
                workspace.getDescription()
            ),
            boardSummaries,
            new WorkspaceBoardDetailResponse.BoardItem(
                board.getId(),
                workspace.getId(),
                board.getName(),
                safe(board.getStatus())
            ),
            workspaceMembers,
            columnItems,
            taskItems
        );
        }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceBoardSummaryResponse> getBoards(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        List<Board> boards = boardRepository.findByWorkspace_IdOrderByCreatedAtAsc(workspace.getId());
        if (boards.isEmpty()) {
            return List.of();
        }

        List<Task> tasks = taskRepository.findByColumn_Board_Workspace_IdOrderByPositionAsc(workspace.getId());
        Map<Long, List<Task>> tasksByBoardId = tasks.stream()
                .collect(Collectors.groupingBy(task -> task.getColumn().getBoard().getId()));

        return boards.stream().map(board -> {
            List<Task> boardTasks = tasksByBoardId.getOrDefault(board.getId(), List.of());
            long completedTaskCount = boardTasks.stream().filter(task -> progress(task) >= 100).count();
            return new WorkspaceBoardSummaryResponse(
                    boardKey(board.getId()),
                    workspaceKey(workspace.getId()),
                    board.getName(),
                    board.getStatus(),
                    columnRepository.countByBoard_Id(board.getId()),
                    boardTasks.size(),
                    completedTaskCount
            );
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceTaskSummaryResponse getTaskSummary(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        List<WorkspaceMember> memberships = workspaceMemberRepository.findByWorkspace_Id(workspace.getId());
        List<Task> tasks = taskRepository.findByColumn_Board_Workspace_IdOrderByPositionAsc(workspace.getId());

        Map<Long, WorkspaceTaskSummaryResponse.MemberItem> memberByUserId = new LinkedHashMap<>();
        for (WorkspaceMember membership : memberships) {
            User user = membership.getUser();
            memberByUserId.put(user.getId(), new WorkspaceTaskSummaryResponse.MemberItem(
                    memberKey(user.getId()),
                    safe(user.getFullname()),
                    normalizeRole(membership.getRole()),
                    initials(user.getFullname(), user.getEmail()),
                    colorForUser(user.getId())
            ));
        }

        List<WorkspaceTaskSummaryResponse.TaskItem> taskItems = new ArrayList<>();
        int index = 1;
        for (Task task : tasks) {
            Board board = task.getColumn().getBoard();
            WorkspaceTaskSummaryResponse.AssigneeItem assignee = null;
            if (task.getAssignee() != null) {
                User assigneeUser = task.getAssignee();
                assignee = new WorkspaceTaskSummaryResponse.AssigneeItem(
                        memberKey(assigneeUser.getId()),
                        safe(assigneeUser.getFullname()),
                        initials(assigneeUser.getFullname(), assigneeUser.getEmail()),
                        colorForUser(assigneeUser.getId())
                );
            }

            taskItems.add(new WorkspaceTaskSummaryResponse.TaskItem(
                    taskKey(task.getId()),
                    boardKey(board.getId()),
                    board.getName(),
                    index++,
                    task.getTitle(),
                    mapStatus(progress(task)),
                    normalizePriority(task.getPriority()),
                    board.getName(),
                    progress(task),
                    formatDueDate(task.getDueDate()),
                    Boolean.TRUE.equals(task.getReminderEnabled()),
                    assignee,
                    List.of(),
                    task.getEstimateHours() == null ? 0 : task.getEstimateHours()
            ));
        }

        return new WorkspaceTaskSummaryResponse(new ArrayList<>(memberByUserId.values()), taskItems);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceScheduleItemResponse> getSchedule(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        List<Schedule> schedules = scheduleRepository.findByWorkspace_IdOrderByPositionAscStartTimeAsc(workspace.getId());

        List<WorkspaceScheduleItemResponse> items = new ArrayList<>();
        int fallbackPosition = 1;
        for (Schedule schedule : schedules) {
            items.add(new WorkspaceScheduleItemResponse(
                "sch-" + schedule.getId(),
                schedule.getTitle(),
                schedule.getPosition() == null ? fallbackPosition : schedule.getPosition(),
                schedule.getStartTime() == null ? "" : schedule.getStartTime().format(TIME_FORMAT),
                schedule.getEndTime() == null ? "" : schedule.getEndTime().format(TIME_FORMAT),
                safe(schedule.getLocation()),
                safe(schedule.getType())
            ));
            fallbackPosition++;
        }

        return items;
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceTimelineResponse getTimeline(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        List<WorkspaceMember> memberships = workspaceMemberRepository.findByWorkspace_Id(workspace.getId());
        List<Task> tasks = taskRepository.findByColumn_Board_Workspace_IdOrderByPositionAsc(workspace.getId());

        Map<Long, String> roleByUserId = memberships.stream().collect(Collectors.toMap(
                member -> member.getUser().getId(),
                member -> normalizeRole(member.getRole()),
                (left, right) -> left,
                LinkedHashMap::new
        ));

        List<WorkspaceTimelineResponse.MemberItem> members = memberships.stream()
                .map(member -> {
                    User user = member.getUser();
                    return new WorkspaceTimelineResponse.MemberItem(
                            user.getId(),
                            safe(user.getFullname()),
                            normalizeRole(member.getRole()),
                            initials(user.getFullname(), user.getEmail()),
                            colorForUser(user.getId())
                    );
                })
                .toList();

        List<WorkspaceTimelineResponse.TaskItem> timelineTasks = tasks.stream().map(task -> {
            WorkspaceTimelineResponse.AssigneeItem assignee = null;
            if (task.getAssignee() != null) {
                User assigned = task.getAssignee();
                assignee = new WorkspaceTimelineResponse.AssigneeItem(
                        assigned.getId(),
                        safe(assigned.getFullname()),
                        roleByUserId.getOrDefault(assigned.getId(), "Member"),
                        initials(assigned.getFullname(), assigned.getEmail()),
                        colorForUser(assigned.getId())
                );
            }

            return new WorkspaceTimelineResponse.TaskItem(
                    task.getId(),
                    task.getTitle(),
                    assignee,
                    formatDateOnly(task.getStartDate()),
                    formatDateOnly(task.getDueDate()),
                    task.getColor() == null || task.getColor().isBlank() ? "#5051F9" : task.getColor(),
                    progress(task)
            );
        }).toList();

        return new WorkspaceTimelineResponse(members, timelineTasks);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeeklyOutputPointResponse> getWeeklyOutput(String workspaceId) {
        Workspace workspace = getAccessibleWorkspaceOrThrow(workspaceId);
        List<Task> tasks = taskRepository.findByColumn_Board_Workspace_IdOrderByPositionAsc(workspace.getId());

        LocalDate today = LocalDate.now(ZONE);
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        Map<LocalDate, Integer> completedByDate = new HashMap<>();
        for (Task task : tasks) {
            if (progress(task) < 100 || task.getUpdatedAt() == null) {
                continue;
            }
            LocalDate date = LocalDateTime.ofInstant(task.getUpdatedAt(), ZONE).toLocalDate();
            if (!date.isBefore(monday) && !date.isAfter(monday.plusDays(6))) {
                completedByDate.merge(date, 1, Integer::sum);
            }
        }

        List<WeeklyOutputPointResponse> points = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = monday.plusDays(i);
            int completed = completedByDate.getOrDefault(day, 0);
            points.add(new WeeklyOutputPointResponse(
                    i + 1,
                    day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    completed,
                    20
            ));
        }

        return points;
    }

    private Workspace getAccessibleWorkspaceOrThrow(String workspaceIdValue) {
        Long workspaceId = parseWorkspaceId(workspaceIdValue);
        Long userId = getCurrentUser().getId();

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found."));

        boolean canAccess = workspaceRepository.existsByIdAndOwner_Id(workspaceId, userId)
                || workspaceMemberRepository.existsByUser_IdAndWorkspace_Id(userId, workspaceId);

        if (!canAccess) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found.");
        }

        return workspace;
    }

    private Long parseWorkspaceId(String rawId) {
        if (rawId == null || rawId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found.");
        }

        String normalized = rawId.startsWith("workspace-") ? rawId.substring("workspace-".length()) : rawId;
        try {
            return Long.parseLong(normalized);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found.");
        }
    }

    private Long parseBoardId(String rawId) {
        if (rawId == null || rawId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found.");
        }

        String normalized = rawId.startsWith("board-") ? rawId.substring("board-".length()) : rawId;
        try {
            return Long.parseLong(normalized);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found.");
        }
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

    private int progress(Task task) {
        return task.getProgress() == null ? 0 : task.getProgress();
    }

    private String mapStatus(int progress) {
        if (progress >= 100) {
            return "done";
        }
        if (progress <= 0) {
            return "todo";
        }
        return "inProgress";
    }

    private String normalizePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return "Medium";
        }
        String normalized = priority.trim().toLowerCase(Locale.ENGLISH);
        if (Set.of("high", "medium", "low").contains(normalized)) {
            return Character.toUpperCase(normalized.charAt(0)) + normalized.substring(1);
        }
        return priority;
    }

    private String formatDueDate(Instant dueDate) {
        if (dueDate == null) {
            return "";
        }
        LocalDateTime due = LocalDateTime.ofInstant(dueDate, ZONE);
        LocalDate today = LocalDate.now(ZONE);
        if (due.toLocalDate().isEqual(today)) {
            return "Today, " + due.toLocalTime().format(DUE_TIME_FORMAT);
        }
        return due.format(DateTimeFormatter.ofPattern("dd MMM, hh:mm a", Locale.ENGLISH));
    }

    private String formatDateOnly(Instant dateTime) {
        if (dateTime == null) {
            return "";
        }
        return LocalDateTime.ofInstant(dateTime, ZONE).toLocalDate().format(DATE_ONLY_FORMAT);
    }

    private String formatTaskDueDateShort(Instant dueDate) {
        if (dueDate == null) {
            return "";
        }
        LocalDateTime due = LocalDateTime.ofInstant(dueDate, ZONE);
        LocalDate today = LocalDate.now(ZONE);
        if (due.toLocalDate().isEqual(today)) {
            return "Today";
        }
        return due.format(DateTimeFormatter.ofPattern("dd MMM", Locale.ENGLISH));
    }

    private String toRelativeTime(Instant createdAt) {
        if (createdAt == null) {
            return "just now";
        }
        long minutes = Math.max(0, java.time.Duration.between(createdAt, Instant.now()).toMinutes());
        if (minutes < 1) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes + "m ago";
        }
        long hours = minutes / 60;
        if (hours < 24) {
            return hours + "h ago";
        }
        long days = hours / 24;
        return days + "d ago";
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "Member";
        }
        String lower = role.toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }

    private String initials(String fullName, String email) {
        String source = (fullName != null && !fullName.isBlank()) ? fullName.trim() : email;
        if (source == null || source.isBlank()) {
            return "U";
        }

        String[] parts = source.split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(Locale.ENGLISH);
        }

        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase(Locale.ENGLISH);
    }

    private String colorForUser(Long userId) {
        if (userId == null) {
            return COLORS.get(0);
        }
        int index = Math.floorMod(userId.hashCode(), COLORS.size());
        return COLORS.get(index);
    }

    private String workspaceKey(Long id) {
        return "workspace-" + id;
    }

    private String boardKey(Long id) {
        return "board-" + id;
    }

    private String taskKey(Long id) {
        return "task-" + id;
    }

    private String memberKey(Long id) {
        return "member-" + id;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    @Override
    @Transactional
    public void inviteMembers(String workspaceId, InviteMembersRequest request) {
        User inviter = getCurrentUser();
        Workspace workspace = workspaceRepository.findById(Long.parseLong(workspaceId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found."));

        boolean isMember = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspace.getId(), inviter.getId())
                .isPresent();
        if (!isMember) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a member of this workspace.");

        for (String email : request.emails()) {
            // Skip if already a member (by email)
            if (userRepository.findByEmail(email)
                    .flatMap(u -> workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspace.getId(), u.getId()))
                    .isPresent()) {
                continue;
            }
            // Skip if PENDING invite already exists
            if (workspaceInvitationRepository
                    .findByWorkspace_IdAndEmailAndStatus(workspace.getId(), email, "PENDING")
                    .isPresent()) {
                continue;
            }

            String token = UUID.randomUUID().toString().replace("-", "");
            Instant expiresAt = Instant.now().plus(inviteExpiryHours, ChronoUnit.HOURS);

            WorkspaceInvitation invitation = new WorkspaceInvitation();
            invitation.setWorkspace(workspace);
            invitation.setInviter(inviter);
            invitation.setEmail(email);
            invitation.setToken(token);
            invitation.setStatus("PENDING");
            invitation.setExpiresAt(expiresAt);
            workspaceInvitationRepository.save(invitation);

            String link = inviteBaseUrl + "?token=" + token;
            HashMap<String, String> vars = new HashMap<>();
            vars.put("inviterName", inviter.getFullname() != null ? inviter.getFullname() : inviter.getEmail());
            vars.put("workspaceName", workspace.getName());
            vars.put("inviteLink", link);
            vars.put("expiryTime", String.valueOf(inviteExpiryHours));
            emailService.sendEmailWithTemplate(email, "You're invited to " + workspace.getName() + " on DevQuest", "WorkspaceInvite", vars);
        }
    }

    @Override
    @Transactional
    public InvitationAcceptResponse acceptInvitation(String token) {
        WorkspaceInvitation invitation = workspaceInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found or already used."));

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.GONE, "Invitation has already been accepted.");
        }
        if (Instant.now().isAfter(invitation.getExpiresAt())) {
            invitation.setStatus("EXPIRED");
            workspaceInvitationRepository.save(invitation);
            throw new ResponseStatusException(HttpStatus.GONE, "Invitation has expired.");
        }

        User user = getCurrentUser();
        Workspace workspace = invitation.getWorkspace();

        boolean alreadyMember = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspace.getId(), user.getId())
                .isPresent();

        if (!alreadyMember) {
            WorkspaceMemberId memberId = new WorkspaceMemberId();
            memberId.setWorkspaceId(workspace.getId());
            memberId.setUserId(user.getId());

            WorkspaceMember member = new WorkspaceMember();
            member.setId(memberId);
            member.setWorkspace(workspace);
            member.setUser(user);
            member.setRole("MEMBER");
            member.setJoinedAt(Instant.now());
            workspaceMemberRepository.save(member);
        }

        invitation.setStatus("ACCEPTED");
        workspaceInvitationRepository.save(invitation);

        String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());
        return new InvitationAcceptResponse(jwt, String.valueOf(workspace.getId()), workspace.getName(),
                alreadyMember ? "Already a member" : "Joined successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInvitationResponse> getUserInvitations() {
        User user = getCurrentUser();
        List<WorkspaceInvitation> invitations = workspaceInvitationRepository
                .findByEmailAndStatusOrderByCreatedAtDesc(user.getEmail(), "PENDING");

        return invitations.stream().map(inv -> new UserInvitationResponse(
                inv.getId(),
                inv.getWorkspace().getId(),
                inv.getWorkspace().getName(),
                inv.getInviter().getFullname() != null ? inv.getInviter().getFullname() : inv.getInviter().getEmail(),
                inv.getToken(),
                inv.getStatus(),
                inv.getExpiresAt(),
                inv.getCreatedAt()
        )).toList();
    }
}
