package com.tudope.openapi_server.entities;

import com.tudope.openapi_server.domains.authorities.Permission;
import jakarta.persistence.*;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "authority")
@EntityListeners(AuditingEntityListener.class)
public class Authority {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private AppUser appUser;

    @Column(name = "permission")
    @Enumerated(EnumType.STRING)
    private Permission permission;

    @CreatedDate
    @Column(name = "created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    // MARK: Constructors

    public Authority() {}

    public Authority(Permission permission) {
        this.permission = permission;
    }

    // MARK: Methods

    @Override
    public String toString() {
        return "Authority{" + "id="
                + id + ", permission='"
                + permission + '\'' + ", createdAt="
                + createdAt + ", updatedAt="
                + updatedAt + '}';
    }

    // MARK: Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
