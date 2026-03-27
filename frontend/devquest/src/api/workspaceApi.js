import axiosClient from './axiosClient'

const workspaceApi = {
  create(payload) {
    const url = '/workspaces'
    return axiosClient.post(url, payload)
  },

  getById(workspaceId) {
    const url = `/workspaces/${workspaceId}`
    return axiosClient.get(url)
  },

  getBoards(workspaceId) {
    const url = `/workspaces/${workspaceId}/boards`
    return axiosClient.get(url)
  },

  createBoard(workspaceId, payload) {
    const url = `/workspaces/${workspaceId}/boards`
    return axiosClient.post(url, payload)
  },

  createColumn(workspaceId, boardId, payload) {
    const url = `/workspaces/${workspaceId}/boards/${boardId}/columns`
    return axiosClient.post(url, payload)
  },

  updateColumn(columnId, payload) {
    const url = `/columns/${columnId}`
    return axiosClient.patch(url, payload)
  },

  deleteColumn(columnId) {
    const url = `/columns/${columnId}`
    return axiosClient.delete(url)
  },

  createTask(payload) {
    const url = '/tasks'
    return axiosClient.post(url, payload)
  },

  updateTask(taskId, payload) {
    const url = `/tasks/${taskId}`
    return axiosClient.patch(url, payload)
  },
 
  deleteTask(taskId) {
    const url = `/tasks/${taskId}`
    return axiosClient.delete(url)
  },
 
  getSubtasks(taskId, config = {}) {
    const url = `/tasks/${taskId}/checklist`
    return axiosClient.get(url, config)
  },

  createSubtask(taskId, payload) {
    const url = `/tasks/${taskId}/checklist`
    return axiosClient.post(url, payload)
  },

  updateSubtask(taskId, subtaskId, payload) {
    const url = `/tasks/${taskId}/checklist/${subtaskId}`
    return axiosClient.patch(url, payload)
  },

  deleteSubtask(taskId, subtaskId) {
    const url = `/tasks/${taskId}/checklist/${subtaskId}`
    return axiosClient.delete(url)
  },

  getTaskSummary(workspaceId) {
    const url = `/workspaces/${workspaceId}/tasks/summary`
    return axiosClient.get(url)
  },

  getSchedule(workspaceId) {
    const url = `/workspaces/${workspaceId}/schedule`
    return axiosClient.get(url)
  },

  getWeeklyOutput(workspaceId) {
    const url = `/workspaces/${workspaceId}/analytics/weekly-output`
    return axiosClient.get(url)
  },

  getBoard(workspaceId, boardId) {
    const url = `/workspaces/${workspaceId}/boards/${boardId}`
    return axiosClient.get(url)
  },

  getTimeline(workspaceId) {
    const url = `/workspaces/${workspaceId}/timeline`
    return axiosClient.get(url)
  },

  inviteMembers(workspaceId, emails) {
    const url = `/workspaces/${workspaceId}/invitations`
    return axiosClient.post(url, { emails })
  },

  acceptInvitation(token) {
    const url = `/workspaces/invitations/accept?token=${token}`
    return axiosClient.get(url)
  },

  getInvitations() {
    const url = '/workspaces/invitations'
    return axiosClient.get(url)
  },
}

export default workspaceApi
