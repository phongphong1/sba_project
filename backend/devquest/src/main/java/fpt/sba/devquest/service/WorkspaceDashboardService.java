package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.workspace.WeeklyOutputPointResponse;
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
import fpt.sba.devquest.dto.workspace.InviteMembersRequest;
import fpt.sba.devquest.dto.workspace.InvitationAcceptResponse;
import fpt.sba.devquest.dto.workspace.UserInvitationResponse;

import java.util.List;

public interface WorkspaceDashboardService {

    CreateWorkspaceResponse createWorkspace(CreateWorkspaceRequest request);

    CreateBoardResponse createBoard(String workspaceId, CreateBoardRequest request);

    WorkspaceDetailResponse getWorkspace(String workspaceId);

    WorkspaceBoardDetailResponse getBoardDetail(String workspaceId, String boardId);

    List<WorkspaceBoardSummaryResponse> getBoards(String workspaceId);

    WorkspaceTaskSummaryResponse getTaskSummary(String workspaceId);

    List<WorkspaceScheduleItemResponse> getSchedule(String workspaceId);

    WorkspaceTimelineResponse getTimeline(String workspaceId);

    List<WeeklyOutputPointResponse> getWeeklyOutput(String workspaceId);

    void inviteMembers(String workspaceId, InviteMembersRequest request);

    InvitationAcceptResponse acceptInvitation(String token);

    List<UserInvitationResponse> getUserInvitations();
}
