package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.user.MyProfileResponse;
import fpt.sba.devquest.dto.user.MyWorkspaceResponse;
import fpt.sba.devquest.dto.user.MessageResponse;
import fpt.sba.devquest.dto.user.UpdateAvatarRequest;
import fpt.sba.devquest.dto.user.UpdateAvatarResponse;
import fpt.sba.devquest.dto.user.UpdatePasswordRequest;
import fpt.sba.devquest.dto.user.UpdateProfileRequest;
import fpt.sba.devquest.dto.user.UpdateProfileResponse;
import fpt.sba.devquest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public MyProfileResponse me() {
        return userService.me();
    }

    @GetMapping("/me/workspaces")
    public List<MyWorkspaceResponse> myWorkspaces() {
        return userService.myWorkspaces();
    }

    @PutMapping("/profile")
    public UpdateProfileResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(request);
    }

    @PutMapping("/profile/password")
    public MessageResponse updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        return userService.updatePassword(request);
    }

    @PostMapping("/avatar")
    public UpdateAvatarResponse updateAvatar(@Valid @RequestBody UpdateAvatarRequest request) {
        return userService.updateAvatar(request);
    }
}
