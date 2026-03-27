package fpt.sba.devquest.dto.task;

public record SubtaskResponse(
        Long id,
        Long taskId,
        String text,
        boolean done
) {
}
