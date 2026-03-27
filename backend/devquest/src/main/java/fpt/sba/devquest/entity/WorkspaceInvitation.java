package fpt.sba.devquest.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "workspace_invitations", schema = "devquest")
public class WorkspaceInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @jakarta.persistence.Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;

    @jakarta.persistence.Column(name = "email", nullable = false)
    private String email;

    @jakarta.persistence.Column(name = "token", nullable = false, unique = true)
    private String token;

    @jakarta.persistence.Column(name = "status", nullable = false)
    private String status; // PENDING, ACCEPTED

    @jakarta.persistence.Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @jakarta.persistence.Column(name = "created_at")
    private Instant createdAt;
}
