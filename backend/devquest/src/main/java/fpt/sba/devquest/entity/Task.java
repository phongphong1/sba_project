package fpt.sba.devquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tasks", schema = "devquest")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @jakarta.persistence.Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @jakarta.persistence.Column(name = "title", nullable = false)
    private String title;

    @Lob
    @jakarta.persistence.Column(name = "description")
    private String description;

    @ColumnDefault("'MEDIUM'")
    @Lob
    @jakarta.persistence.Column(name = "priority")
    private String priority;

    @ColumnDefault("0")
    @jakarta.persistence.Column(name = "progress")
    private Integer progress;

    @ColumnDefault("0")
    @jakarta.persistence.Column(name = "estimate_hours")
    private Integer estimateHours;

    @ColumnDefault("0")
    @jakarta.persistence.Column(name = "reminder_enabled")
    private Boolean reminderEnabled;

    @Size(max = 20)
    @ColumnDefault("'#5051F9'")
    @jakarta.persistence.Column(name = "color", length = 20)
    private String color;

    @jakarta.persistence.Column(name = "start_date")
    private Instant startDate;

    @jakarta.persistence.Column(name = "due_date")
    private Instant dueDate;

    @NotNull
    @jakarta.persistence.Column(name = "position", nullable = false)
    private Double position;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "column_id", nullable = false)
    private Column column;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @CreationTimestamp
    @jakarta.persistence.Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @jakarta.persistence.Column(name = "updated_at")
    private Instant updatedAt;


}