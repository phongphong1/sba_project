package fpt.sba.devquest.dto.workspace;

public record WorkspaceScheduleItemResponse(
        String id,
        String title,
        int position,
        String startTime,
        String endTime,
        String location,
        String type
) {
}
