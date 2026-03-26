package fpt.sba.devquest.service.impl;

import fpt.sba.devquest.dto.user.MyProfileResponse;
import fpt.sba.devquest.dto.user.MyWorkspaceResponse;
import fpt.sba.devquest.dto.user.MessageResponse;
import fpt.sba.devquest.dto.user.UpdateAvatarRequest;
import fpt.sba.devquest.dto.user.UpdateAvatarResponse;
import fpt.sba.devquest.dto.user.UpdatePasswordRequest;
import fpt.sba.devquest.dto.user.UpdateProfileRequest;
import fpt.sba.devquest.dto.user.UpdateProfileResponse;
import fpt.sba.devquest.entity.User;
import fpt.sba.devquest.entity.WorkspaceMember;
import fpt.sba.devquest.repository.BoardRepository;
import fpt.sba.devquest.repository.CommentRepository;
import fpt.sba.devquest.repository.TaskRepository;
import fpt.sba.devquest.repository.UserRepository;
import fpt.sba.devquest.repository.WorkspaceMemberRepository;
import fpt.sba.devquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final DateTimeFormatter ACTIVE_SINCE_FORMATTER =
            DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
        private final BoardRepository boardRepository;
        private final PasswordEncoder passwordEncoder;

    @Override
    public MyProfileResponse me() {
                User user = getCurrentUser();

        long workspacesCount = workspaceMemberRepository.countByUser_Id(user.getId());
        long tasksCompleted = taskRepository.countCompletedByAssigneeId(user.getId());
        long totalComments = commentRepository.countByUser_Id(user.getId());
        String activeSince = user.getCreatedAt() == null ? "" : ACTIVE_SINCE_FORMATTER.format(user.getCreatedAt());

        MyProfileResponse.UserPayload userPayload = toUserPayload(user);

        MyProfileResponse.StatsPayload statsPayload = new MyProfileResponse.StatsPayload(
                workspacesCount,
                tasksCompleted,
                totalComments,
                activeSince
        );

        return new MyProfileResponse(userPayload, statsPayload);
    }

        @Override
        @Transactional(readOnly = true)
        public List<MyWorkspaceResponse> myWorkspaces() {
                User user = getCurrentUser();
                List<WorkspaceMember> memberships = workspaceMemberRepository.findByUser_Id(user.getId());

                return memberships.stream().map(member -> {
                        Long workspaceId = member.getWorkspace().getId();
                        Long boardCount = boardRepository.countByWorkspace_Id(workspaceId);
                        Instant activeFrom = member.getJoinedAt() != null ? member.getJoinedAt() : member.getWorkspace().getCreatedAt();

                        return new MyWorkspaceResponse(
                                        "workspace-" + workspaceId,
                                        member.getWorkspace().getName(),
                                        member.getWorkspace().getDescription(),
                                        normalizeRole(member.getRole()),
                                        boardCount,
                                        activeFrom == null ? "" : ACTIVE_SINCE_FORMATTER.format(activeFrom)
                        );
                }).toList();
        }

        @Override
        @Transactional
        public UpdateProfileResponse updateProfile(UpdateProfileRequest request) {
                User user = getCurrentUser();
                user.setFullname(request.fullName());
                user.setBio(request.bio());
                user.setEmailNotifications(request.emailNotifications());

                User savedUser = userRepository.save(user);
                return new UpdateProfileResponse("Profile updated", toUserPayload(savedUser));
        }

        @Override
        @Transactional
        public MessageResponse updatePassword(UpdatePasswordRequest request) {
                User user = getCurrentUser();

                if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
                }

                if (!request.newPassword().equals(request.confirmPassword())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirm password do not match.");
                }

                user.setPassword(passwordEncoder.encode(request.newPassword()));
                userRepository.save(user);
                return new MessageResponse("Password updated");
        }

        @Override
        @Transactional
        public UpdateAvatarResponse updateAvatar(UpdateAvatarRequest request) {
                User user = getCurrentUser();
                user.setAvatarUrl(request.avatarUrl());
                User savedUser = userRepository.save(user);

                return new UpdateAvatarResponse("Avatar uploaded", savedUser.getAvatarUrl());
        }

        private User getCurrentUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication != null ? authentication.getName() : null;

                if (email == null || email.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized.");
                }

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized."));
        }

        private String normalizeRole(String role) {
                if (role == null || role.isBlank()) {
                        return "Member";
                }
                String lower = role.toLowerCase(Locale.ENGLISH);
                return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
        }

        private MyProfileResponse.UserPayload toUserPayload(User user) {
                return new MyProfileResponse.UserPayload(
                                user.getId(),
                                user.getFullname(),
                                user.getEmail(),
                                user.getAvatarUrl(),
                                user.getSystemRole(),
                                user.getBio(),
                                user.getEmailNotifications()
                );
        }
}
