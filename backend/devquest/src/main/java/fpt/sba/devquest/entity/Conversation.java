package fpt.sba.devquest.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "conversations", schema = "devquest")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 100)
    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "workspace_id")
    private Long workspaceId;

    @ColumnDefault("'DIRECT'")
    @Lob
    @Column(name = "type")
    private String type;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;


}