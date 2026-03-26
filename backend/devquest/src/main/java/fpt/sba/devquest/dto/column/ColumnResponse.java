package fpt.sba.devquest.dto.column;

public record ColumnResponse(
        Long id,
        Long boardId,
        String name,
        int position
) {
}
