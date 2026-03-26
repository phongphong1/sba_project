package fpt.sba.devquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "workspaces", schema = "devquest")
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @jakarta.persistence.Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @jakarta.persistence.Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 255)
    @jakarta.persistence.Column(name = "subtitle")
    private String subtitle;

    @Lob
    @jakarta.persistence.Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @jakarta.persistence.Column(name = "created_at")
    private Instant createdAt;


}