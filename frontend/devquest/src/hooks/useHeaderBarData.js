import { useEffect, useMemo, useState } from 'react'
import { useNotificationActions } from '@/hooks/useNotificationActions'
import { useUserActions } from '@/hooks/useUserActions'
import { subscribeToNotifications } from '@/lib/realtime/stompClient'

function createEmptyUser() {
  return {
    fullName: 'Account',
    email: '',
    avatarUrl: '',
  }
}

function normalizeUser(payload) {
  const resolvedUser =
    payload?.user && typeof payload.user === 'object'
      ? payload.user
      : payload && typeof payload === 'object'
        ? payload
        : null

  if (!resolvedUser) {
    return createEmptyUser()
  }

  return {
    id: resolvedUser.id ?? resolvedUser.userId ?? null,
    fullName: resolvedUser.fullName ?? 'Account',
    email: resolvedUser.email ?? '',
    avatarUrl: resolvedUser.avatarUrl ?? '',
  }
}

function normalizeWorkspaceList(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.workspaces)
      ? payload.workspaces
      : []

  return source.map((workspace, index) => ({
    id: String(workspace.id ?? workspace.workspaceId ?? index + 1),
    name: workspace.name ?? 'Untitled workspace',
    description: workspace.description ?? 'No description yet.',
    boardCount: workspace.boardCount ?? workspace.boards?.length ?? 0,
  }))
}

function normalizeNotifications(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.notifications)
      ? payload.notifications
      : []

  return source.map((notification, index) => ({
    id: String(notification.id ?? notification.notificationId ?? index + 1),
    title: notification.title ?? notification.message ?? 'Notification',
    time: notification.time ?? notification.createdAt ?? 'Just now',
    unread: Boolean(notification.unread),
  }))
}

function normalizeNotificationPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  return {
    id: String(payload.id ?? payload.notificationId ?? Date.now()),
    title: payload.title ?? payload.message ?? 'Notification',
    time: payload.time ?? payload.createdAt ?? 'Just now',
    unread: payload.unread ?? true,
  }
}

function mergeIncomingNotification(currentNotifications, incomingNotification) {
  const remainingNotifications = currentNotifications.filter(
    (notification) => notification.id !== incomingNotification.id,
  )

  return [incomingNotification, ...remainingNotifications]
}

export function useHeaderBarData() {
  const { handleGetMe, handleGetWorkspaces } = useUserActions()
  const { handleGetNotifications, handleReadAllNotifications, handleReadNotification } =
    useNotificationActions()
  const [currentUser, setCurrentUser] = useState(createEmptyUser)
  const [workspaceList, setWorkspaceList] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [isMarkingAllNotificationsRead, setIsMarkingAllNotificationsRead] = useState(false)
  const [readingNotificationIds, setReadingNotificationIds] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadHeaderData = async () => {
      setIsLoadingNotifications(true)

      const [userResult, workspaceResult, notificationResult] = await Promise.allSettled([
        handleGetMe(),
        handleGetWorkspaces(),
        handleGetNotifications(),
      ])

      if (!isMounted) {
        return
      }

      if (userResult.status === 'fulfilled') {
        setCurrentUser(normalizeUser(userResult.value.data))
      }

      if (workspaceResult.status === 'fulfilled') {
        setWorkspaceList(normalizeWorkspaceList(workspaceResult.value.data))
      }

      if (notificationResult.status === 'fulfilled') {
        setNotifications(normalizeNotifications(notificationResult.value.data))
      }

      setIsLoadingNotifications(false)
    }

    void loadHeaderData()

    return () => {
      isMounted = false
    }
  }, [handleGetMe, handleGetNotifications, handleGetWorkspaces])

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((event) => {
      if (event?.type !== 'NOTIFICATION_CREATED') {
        return
      }

      const incomingNotification = normalizeNotificationPayload(event.payload)

      if (!incomingNotification) {
        return
      }

      setNotifications((current) =>
        mergeIncomingNotification(current, incomingNotification),
      )
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return useMemo(
    () => ({
      currentUser,
      workspaceList,
      notifications,
      isLoadingNotifications,
      isMarkingAllNotificationsRead,
      readingNotificationIds,
      async markAllNotificationsRead() {
        if (isMarkingAllNotificationsRead || !notifications.some((notification) => notification.unread)) {
          return
        }

        setIsMarkingAllNotificationsRead(true)

        try {
        await handleReadAllNotifications()

        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            unread: false,
          })),
        )
        } finally {
          setIsMarkingAllNotificationsRead(false)
        }
      },
      async markNotificationRead(notificationId) {
        const targetNotification = notifications.find((notification) => notification.id === notificationId)

        if (!targetNotification?.unread || readingNotificationIds.includes(notificationId)) {
          return
        }

        setReadingNotificationIds((current) => [...current, notificationId])

        try {
          await handleReadNotification(notificationId)

          setNotifications((current) =>
            current.map((notification) =>
              notification.id === notificationId
                ? {
                    ...notification,
                    unread: false,
                  }
                : notification,
            ),
          )
        } finally {
          setReadingNotificationIds((current) => current.filter((id) => id !== notificationId))
        }
      },
    }),
    [
      currentUser,
      handleReadAllNotifications,
      handleReadNotification,
      isLoadingNotifications,
      isMarkingAllNotificationsRead,
      notifications,
      readingNotificationIds,
      workspaceList,
    ],
  )
}

export default useHeaderBarData
