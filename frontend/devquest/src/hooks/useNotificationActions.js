import { useMemo } from 'react'
import notificationApi from '@/api/notificationApi'

const resolveMessage = (payload, fallbackMessage) =>
  payload?.message ?? payload?.data?.message ?? fallbackMessage

export function useNotificationActions() {
  return useMemo(
    () => ({
      handleGetNotifications: async () => {
        const data = await notificationApi.getNotifications()

        return {
          success: true,
          data,
        }
      },
      handleReadAllNotifications: async () => {
        const data = await notificationApi.readAll()

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Notifications marked as read.'),
        }
      },
      handleReadNotification: async (notificationId) => {
        const data = await notificationApi.readById(notificationId)

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Notification marked as read.'),
        }
      },
    }),
    [],
  )
}

export default useNotificationActions
