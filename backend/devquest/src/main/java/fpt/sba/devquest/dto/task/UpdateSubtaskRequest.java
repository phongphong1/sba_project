package fpt.sba.devquest.dto.task;

public record UpdateSubtaskRequest(
        String text,
        Boolean done
) {
}
