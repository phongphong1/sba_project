import axiosClient from './axiosClient';

const notificationApi = {
  getNotifications() {
    const url = '/notifications';
    return axiosClient.get(url);
  },

  readAll() {
    const url = '/notifications/read-all';
    return axiosClient.patch(url);
  },

  readById(notificationId) {
    const url = `/notifications/${notificationId}/read`;
    return axiosClient.patch(url);
  },
};

export default notificationApi;
