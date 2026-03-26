package fpt.sba.devquest.service;

import fpt.sba.devquest.dto.user.MyProfileResponse;
import fpt.sba.devquest.dto.user.MyWorkspaceResponse;
import fpt.sba.devquest.dto.user.MessageResponse;
import fpt.sba.devquest.dto.user.UpdateAvatarRequest;
import fpt.sba.devquest.dto.user.UpdateAvatarResponse;
import fpt.sba.devquest.dto.user.UpdatePasswordRequest;
import fpt.sba.devquest.dto.user.UpdateProfileRequest;
import fpt.sba.devquest.dto.user.UpdateProfileResponse;

import java.util.List;

public interface UserService {

    MyProfileResponse me();

    List<MyWorkspaceResponse> myWorkspaces();

    UpdateProfileResponse updateProfile(UpdateProfileRequest request);

    MessageResponse updatePassword(UpdatePasswordRequest request);

    UpdateAvatarResponse updateAvatar(UpdateAvatarRequest request);
}
