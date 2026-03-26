import axiosClient from './axiosClient';

const userApi = {
  getMe() {
    const url = '/users/me';
    return axiosClient.get(url);
  },

  updateProfile(data) {
    const url = '/users/profile';
    return axiosClient.put(url, data);
  },

  changePassword(data) {
    const url = '/users/profile/password';
    return axiosClient.put(url, data);
  },

  uploadAvatar({ avatarUrl }) {
    const url = '/users/avatar';

    if (!avatarUrl) {
      return Promise.reject(new Error('Avatar URL is required.'));
    }

    return axiosClient.post(url, { avatarUrl });
  },

  getWorkspaces() {
    const url = '/users/me/workspaces';
    return axiosClient.get(url);
  },
};

export default userApi;
