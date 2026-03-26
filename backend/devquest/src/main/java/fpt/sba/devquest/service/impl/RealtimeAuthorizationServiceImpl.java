package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.repository.WorkspaceMemberRepository;
import fpt.sba.devquest.repository.WorkspaceRepository;
import fpt.sba.devquest.service.RealtimeAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RealtimeAuthorizationServiceImpl implements RealtimeAuthorizationService {

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceRepository workspaceRepository;

    @Override
    public void assertWorkspaceAccess(Long userId, Long workspaceId) {
        if (userId == null || workspaceId == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied.");
        }

        boolean isMember = workspaceMemberRepository.existsByUser_IdAndWorkspace_Id(userId, workspaceId);
        boolean isOwner = workspaceRepository.existsByIdAndOwner_Id(workspaceId, userId);
        if (!isMember && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this workspace.");
        }
    }

    @Override
    public void assertConversationAccess(Long userId, Long conversationId) {
        if (userId == null || conversationId == null || conversationId <= 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this conversation.");
        }
        // TODO: enforce conversation membership once conversation entities are available.
    }
}
