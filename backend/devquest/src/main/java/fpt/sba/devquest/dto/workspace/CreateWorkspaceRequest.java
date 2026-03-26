package fpt.sba.devquest.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWorkspaceRequest(
        @NotBlank(message = "Workspace name is required.")
        @Size(max = 100, message = "Workspace name must be at most 100 characters.")
        String name,
        String description
) {
}
