package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.column.ColumnResponse;
import fpt.sba.devquest.dto.column.CreateColumnRequest;
import fpt.sba.devquest.dto.column.ReorderColumnsRequest;
import fpt.sba.devquest.dto.column.UpdateColumnRequest;

public interface ColumnService {

    ColumnResponse createColumn(String workspaceId, String boardId, CreateColumnRequest request);

    void reorderColumns(ReorderColumnsRequest request);

    ColumnResponse updateColumn(Long id, UpdateColumnRequest request);

    void deleteColumn(Long id);
}
