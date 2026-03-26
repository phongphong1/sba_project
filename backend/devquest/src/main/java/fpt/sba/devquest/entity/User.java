package fpt.sba.devquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "users", schema = "devquest")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @jakarta.persistence.Column(name = "id", nullable = false)
    private Long id;

    @jakarta.persistence.Column(name = "password", nullable = false)
    private String password;

    @jakarta.persistence.Column(name = "email", nullable = false, length = 100)
    private String email;

    @Lob
    @jakarta.persistence.Column(name = "avatar_url")
    private String avatarUrl;

    @Lob
    @jakarta.persistence.Column(name = "bio")
    private String bio;

    @ColumnDefault("'ROLE_USER'")
    @Lob
    @jakarta.persistence.Column(name = "system_role")
    private String systemRole;

    @ColumnDefault("1")
    @jakarta.persistence.Column(name = "email_notifications")
    private Boolean emailNotifications;

    @ColumnDefault("1")
    @jakarta.persistence.Column(name = "is_active")
    private Boolean isActive;

    @CreationTimestamp
    @jakarta.persistence.Column(name = "created_at")
    private Instant createdAt;

    @Size(max = 100)
    @jakarta.persistence.Column(name = "fullname", length = 100)
    private String fullname;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSystemRole() {
        return systemRole;
    }

    public void setSystemRole(String systemRole) {
        this.systemRole = systemRole;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }


}
