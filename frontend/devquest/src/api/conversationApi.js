import axiosClient from './axiosClient'

const conversationApi = {
  getConversations() {
    return axiosClient.get('/conversations')
  },

  getMessages(conversationId) {
    return axiosClient.get(`/conversations/${conversationId}/messages`)
  },
}

export default conversationApi
