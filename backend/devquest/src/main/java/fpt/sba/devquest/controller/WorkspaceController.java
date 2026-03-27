package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.workspace.InviteMembersRequest;
import fpt.sba.devquest.dto.workspace.InvitationAcceptResponse;
import fpt.sba.devquest.dto.workspace.UserInvitationResponse;
import fpt.sba.devquest.dto.workspace.WeeklyOutputPointResponse;
import fpt.sba.devquest.dto.column.ColumnResponse;
import fpt.sba.devquest.dto.column.CreateColumnRequest;
import fpt.sba.devquest.dto.workspace.CreateBoardRequest;
import fpt.sba.devquest.dto.workspace.CreateBoardResponse;
import fpt.sba.devquest.dto.workspace.CreateWorkspaceRequest;
import fpt.sba.devquest.dto.workspace.CreateWorkspaceResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceBoardSummaryResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceBoardDetailResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceDetailResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceScheduleItemResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceTaskSummaryResponse;
import fpt.sba.devquest.dto.workspace.WorkspaceTimelineResponse;
import fpt.sba.devquest.service.ColumnService;
import fpt.sba.devquest.service.WorkspaceDashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceDashboardService workspaceDashboardService;
    private final ColumnService columnService;

    @PostMapping
    public CreateWorkspaceResponse createWorkspace(@Valid @RequestBody CreateWorkspaceRequest request) {
        return workspaceDashboardService.createWorkspace(request);
    }

    @PostMapping("/{workspaceId}/boards")
    public CreateBoardResponse createBoard(
            @PathVariable String workspaceId,
            @Valid @RequestBody CreateBoardRequest request
    ) {
        return workspaceDashboardService.createBoard(workspaceId, request);
    }

    @PostMapping("/{workspaceId}/boards/{boardId}/columns")
    public ColumnResponse createColumn(
            @PathVariable String workspaceId,
            @PathVariable String boardId,
            @Valid @RequestBody CreateColumnRequest request
    ) {
        return columnService.createColumn(workspaceId, boardId, request);
    }

    @GetMapping("/{workspaceId}")
    public WorkspaceDetailResponse getWorkspace(@PathVariable String workspaceId) {
        return workspaceDashboardService.getWorkspace(workspaceId);
    }

    @GetMapping("/{workspaceId}/boards/{boardId}")
    public WorkspaceBoardDetailResponse getBoardDetail(@PathVariable String workspaceId, @PathVariable String boardId) {
        return workspaceDashboardService.getBoardDetail(workspaceId, boardId);
    }

    @GetMapping("/{workspaceId}/boards")
    public List<WorkspaceBoardSummaryResponse> getBoards(@PathVariable String workspaceId) {
        return workspaceDashboardService.getBoards(workspaceId);
    }

    @GetMapping("/{workspaceId}/tasks/summary")
    public WorkspaceTaskSummaryResponse getTaskSummary(@PathVariable String workspaceId) {
        return workspaceDashboardService.getTaskSummary(workspaceId);
    }

    @GetMapping("/{workspaceId}/schedule")
    public List<WorkspaceScheduleItemResponse> getSchedule(@PathVariable String workspaceId) {
        return workspaceDashboardService.getSchedule(workspaceId);
    }

    @GetMapping("/{workspaceId}/timeline")
    public WorkspaceTimelineResponse getTimeline(@PathVariable String workspaceId) {
        return workspaceDashboardService.getTimeline(workspaceId);
    }

    @GetMapping("/{workspaceId}/analytics/weekly-output")
    public List<WeeklyOutputPointResponse> getWeeklyOutput(@PathVariable String workspaceId) {
        return workspaceDashboardService.getWeeklyOutput(workspaceId);
    }

    @PostMapping("/{workspaceId}/invitations")
    public org.springframework.http.ResponseEntity<Void> inviteMembers(
            @PathVariable String workspaceId,
            @Valid @RequestBody InviteMembersRequest request
    ) {
        workspaceDashboardService.inviteMembers(workspaceId, request);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    @GetMapping("/invitations/accept")
    public InvitationAcceptResponse acceptInvitation(@RequestParam String token) {
        return workspaceDashboardService.acceptInvitation(token);
    }

    @GetMapping("/invitations")
    public List<UserInvitationResponse> getInvitations() {
        return workspaceDashboardService.getUserInvitations();
    }
}
