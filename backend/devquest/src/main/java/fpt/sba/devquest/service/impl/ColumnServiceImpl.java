package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.column.ColumnResponse;
import fpt.sba.devquest.dto.column.CreateColumnRequest;
import fpt.sba.devquest.dto.column.ReorderColumnsRequest;
import fpt.sba.devquest.dto.column.UpdateColumnRequest;
import fpt.sba.devquest.entity.Board;
import fpt.sba.devquest.entity.Column;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.repository.BoardRepository;
import fpt.sba.devquest.repository.ColumnRepository;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.service.ColumnService;
import fpt.sba.devquest.service.RealtimeAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColumnServiceImpl implements ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final RealtimeAuthorizationService realtimeAuthorizationService;

    @Override
    @Transactional
    public ColumnResponse createColumn(String workspaceIdRaw, String boardIdRaw, CreateColumnRequest request) {
        Long workspaceId = parseWorkspaceId(workspaceIdRaw);
        Long boardId = parseBoardId(boardIdRaw);
        User user = getCurrentUser();

        realtimeAuthorizationService.assertWorkspaceAccess(user.getId(), workspaceId);

        Board board = boardRepository.findByIdAndWorkspace_Id(boardId, workspaceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found."));

        List<Column> existing = columnRepository.findByBoard_IdOrderByPositionAsc(board.getId());
        int newPosition = existing.isEmpty() ? 1000 : existing.get(existing.size() - 1).getPosition().intValue() + 1000;

        Column column = new Column();
        column.setBoard(board);
        column.setTitle(request.name());
        column.setPosition((double) newPosition);

        Column saved = columnRepository.save(column);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void reorderColumns(ReorderColumnsRequest request) {
        for (ReorderColumnsRequest.Item item : request.columns()) {
            Column column = columnRepository.findById(item.id())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found."));

            Long workspaceId = column.getBoard().getWorkspace().getId();
            User user = getCurrentUser();
            realtimeAuthorizationService.assertWorkspaceAccess(user.getId(), workspaceId);

            column.setPosition(item.position().doubleValue());
            columnRepository.save(column);
        }
    }

    @Override
    @Transactional
    public ColumnResponse updateColumn(Long id, UpdateColumnRequest request) {
        Column column = columnRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found."));

        Long workspaceId = column.getBoard().getWorkspace().getId();
        User user = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(user.getId(), workspaceId);

        if (request.name() != null && !request.name().isBlank()) {
            column.setTitle(request.name());
        }
        if (request.position() != null) {
            column.setPosition(request.position().doubleValue());
        }

        Column saved = columnRepository.save(column);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteColumn(Long id) {
        Column column = columnRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found."));

        Long workspaceId = column.getBoard().getWorkspace().getId();
        User user = getCurrentUser();
        realtimeAuthorizationService.assertWorkspaceAccess(user.getId(), workspaceId);

        columnRepository.delete(column);
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

    private Long parseWorkspaceId(String rawId) {
        String normalized = rawId != null && rawId.startsWith("workspace-") ? rawId.substring("workspace-".length()) : rawId;
        try {
            return Long.parseLong(normalized);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace not found.");
        }
    }

    private Long parseBoardId(String rawId) {
        String normalized = rawId != null && rawId.startsWith("board-") ? rawId.substring("board-".length()) : rawId;
        try {
            return Long.parseLong(normalized);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found.");
        }
    }

    private ColumnResponse toResponse(Column column) {
        return new ColumnResponse(
                column.getId(),
                column.getBoard().getId(),
                column.getTitle(),
                column.getPosition().intValue()
        );
    }
}
