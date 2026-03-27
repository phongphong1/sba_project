import { Client } from '@stomp/stompjs'
import { AUTH_TOKEN_KEY } from '@/constants/auth'

const DEFAULT_WS_PATH = '/ws'
const DEFAULT_RECONNECT_DELAY_MS = 5000
const LOGIN_PATH = '/login'

let stompClient = null
let connectionPromise = null
let pendingConnectionWaiters = []
let activeSubscriptionCount = 0

function getAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

function resolveBaseWsUrl() {
  const configuredWsUrl = import.meta.env.VITE_WS_URL?.trim()

  if (configuredWsUrl) {
    return configuredWsUrl
  }

  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

  if (configuredApiUrl) {
    const resolvedUrl = new URL(configuredApiUrl, window.location.origin)
    const normalizedPath = resolvedUrl.pathname.replace(/\/api\/?$/, '')

    resolvedUrl.protocol = resolvedUrl.protocol === 'https:' ? 'wss:' : 'ws:'
    resolvedUrl.pathname = `${normalizedPath}${DEFAULT_WS_PATH}`.replace(/\/{2,}/g, '/')
    resolvedUrl.search = ''
    resolvedUrl.hash = ''

    return resolvedUrl.toString()
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

  return `${protocol}//${window.location.host}${DEFAULT_WS_PATH}`
}

function resolveRealtimeErrorMessage(frameOrError) {
  if (!frameOrError) {
    return ''
  }

  if (typeof frameOrError === 'string') {
    return frameOrError
  }

  return `${frameOrError.headers?.message ?? ''} ${frameOrError.body ?? ''} ${frameOrError.message ?? ''}`.trim()
}

function isAuthFailure(message) {
  return /(401|403|unauthor|forbidden|invalid token|expired token|jwt|authentication)/i.test(message)
}

function rejectPendingConnections(error) {
  if (!pendingConnectionWaiters.length) {
    connectionPromise = null
    return
  }

  pendingConnectionWaiters.forEach(({ reject }) => reject(error))
  pendingConnectionWaiters = []
  connectionPromise = null
}

function resolvePendingConnections(client) {
  if (!pendingConnectionWaiters.length) {
    connectionPromise = null
    return
  }

  pendingConnectionWaiters.forEach(({ resolve }) => resolve(client))
  pendingConnectionWaiters = []
  connectionPromise = null
}

function redirectToLogin() {
  if (typeof window === 'undefined') {
    return
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (currentPath === LOGIN_PATH) {
    return
  }

  window.location.href = LOGIN_PATH
}

function handleUnauthorizedRealtime(errorMessage) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  void disconnectRealtimeClient()
  redirectToLogin()
  rejectPendingConnections(new Error(errorMessage || 'Realtime authorization failed.'))
}

function createStompClient() {
  const client = new Client({
    brokerURL: resolveBaseWsUrl(),
    reconnectDelay: DEFAULT_RECONNECT_DELAY_MS,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
    async beforeConnect() {
      const accessToken = getAccessToken()

      if (!accessToken) {
        throw new Error('Missing auth token for realtime connection.')
      }

      client.connectHeaders = {
        Authorization: `Bearer ${accessToken}`,
      }
    },
    onConnect() {
      resolvePendingConnections(client)
    },
    onStompError(frame) {
      const errorMessage = resolveRealtimeErrorMessage(frame)
      console.error('🚨 STOMP SERVER ERROR:', errorMessage, frame)

      if (isAuthFailure(errorMessage)) {
        handleUnauthorizedRealtime(errorMessage)
        return
      }

      rejectPendingConnections(new Error(errorMessage || 'Failed to establish realtime connection.'))
    },
    onWebSocketClose(event) {
      if (!client.active) {
        stompClient = null
      }

      if (!event.wasClean && connectionPromise) {
        rejectPendingConnections(new Error(`Realtime connection closed (${event.code}).`))
      }

      if (event.code === 4001 || event.code === 4003) {
        handleUnauthorizedRealtime(`Realtime connection closed (${event.code}).`)
      }
    },
    onWebSocketError(error) {
      if (connectionPromise) {
        rejectPendingConnections(new Error(resolveRealtimeErrorMessage(error) || 'Realtime websocket error.'))
      }
    },
  })

  return client
}

function getOrCreateClient() {
  if (!stompClient) {
    stompClient = createStompClient()
  }

  return stompClient
}

function parseMessageBody(message) {
  if (!message?.body) {
    return null
  }

  try {
    return JSON.parse(message.body)
  } catch {
    return message.body
  }
}

export function getRealtimeWebsocketUrl() {
  return resolveBaseWsUrl()
}

export async function ensureRealtimeConnection() {
  const accessToken = getAccessToken()

  if (!accessToken) {
    await disconnectRealtimeClient()
    return null
  }

  const client = getOrCreateClient()

  if (client.connected) {
    return client
  }

  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = new Promise((resolve, reject) => {
    pendingConnectionWaiters.push({ resolve, reject })
  })

  if (!client.active) {
    client.activate()
  }

  return connectionPromise
}

export function subscribeToDestination(destination, onEvent, options = {}) {
  let isDisposed = false
  let subscription = null
  let countedSubscription = false

  const startSubscription = async () => {
    const client = await ensureRealtimeConnection()

    if (!client || isDisposed) {
      if (activeSubscriptionCount === 0) {
        await disconnectRealtimeClient()
      }

      return
    }

    subscription = client.subscribe(destination, (message) => {
      const payload = parseMessageBody(message)
      console.log('📡 STOMP RAW MESSAGE RECEIVED on', destination, ':', payload)
      onEvent(payload, message)
    }, options)

    activeSubscriptionCount += 1
    countedSubscription = true
  }

  void startSubscription().catch((error) => {
    console.error(`Failed to subscribe to realtime destination "${destination}".`, error)
  })

  return () => {
    isDisposed = true
    subscription?.unsubscribe()

    if (countedSubscription) {
      activeSubscriptionCount = Math.max(activeSubscriptionCount - 1, 0)
      countedSubscription = false
    }

    if (activeSubscriptionCount === 0) {
      void disconnectRealtimeClient()
    }
  }
}

export async function publishToDestination(destination, payload, headers = {}) {
  const client = await ensureRealtimeConnection()

  if (!client) {
    return false
  }

  client.publish({
    destination,
    headers,
    body: JSON.stringify(payload),
  })

  return true
}

export function subscribeToNotifications(onEvent) {
  return subscribeToDestination('/user/queue/notifications', onEvent)
}

export function subscribeToConversationMessages(conversationId, onEvent) {
  return subscribeToDestination(`/topic/conversations/${conversationId}/messages`, onEvent)
}

export function subscribeToWorkspaceTasks(workspaceId, onEvent) {
  return subscribeToDestination(`/topic/workspaces/${workspaceId}/tasks`, onEvent)
}

export function sendMessageCommand(payload) {
  return publishToDestination('/app/messages/send', payload)
}

export function sendTaskMoveCommand(payload) {
  return publishToDestination('/app/tasks/move', payload)
}

export async function disconnectRealtimeClient() {
  const client = stompClient

  stompClient = null
  activeSubscriptionCount = 0

  if (client) {
    await client.deactivate()
  }

  rejectPendingConnections(new Error('Realtime connection has been disconnected.'))
}
