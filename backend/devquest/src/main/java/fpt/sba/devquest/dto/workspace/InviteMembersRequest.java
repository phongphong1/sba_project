package fpt.sba.devquest.dto.workspace;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record InviteMembersRequest(
        @NotEmpty List<String> emails
) {}
