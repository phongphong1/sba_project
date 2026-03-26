import axiosClient from './axiosClient'

const workspaceApi = {
  getById(workspaceId) {
    const url = `/workspaces/${workspaceId}`
    return axiosClient.get(url)
  },

  getBoards(workspaceId) {
    const url = `/workspaces/${workspaceId}/boards`
    return axiosClient.get(url)
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
}

export default workspaceApi
