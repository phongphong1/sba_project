# WebSocket Contract

## 1) Connect

- Endpoint: `/ws`
- Protocol: STOMP over WebSocket
- Required header on CONNECT:

```text
Authorization: Bearer <jwt-token>
```

If token is missing/invalid, server rejects websocket connection.

## 2) Subscribe destinations

### Personal notification channel

- Destination: `/user/queue/notifications`
- Event type: `NOTIFICATION_CREATED`

Sample event:

```json
{
  "eventId": "9cd7f6bc-3e9b-4c9f-93f8-6b0bb6534b4d",
  "type": "NOTIFICATION_CREATED",
  "channel": "/user/queue/notifications",
  "timestamp": "2026-03-26T15:00:00Z",
  "payload": {
    "id": 1,
    "title": "Mia left feedback on Timeline view",
    "time": "5m ago",
    "unread": true
  }
}
```

### Conversation message channel

- Destination: `/topic/conversations/{conversationId}/messages`
- Event type: `MESSAGE_CREATED`

Sample event:

```json
{
  "eventId": "ab7d75c0-c620-4d6f-b8e3-35749f165cb5",
  "type": "MESSAGE_CREATED",
  "channel": "/topic/conversations/15/messages",
  "timestamp": "2026-03-26T15:01:00Z",
  "payload": {
    "conversationId": 15,
    "senderId": 7,
    "content": "Hello team"
  }
}
```

### Workspace task movement channel

- Destination: `/topic/workspaces/{workspaceId}/tasks`
- Event type: `TASK_MOVED`

Sample event:

```json
{
  "eventId": "d9ec1ed6-08a9-4d44-ab89-f4a96a784f07",
  "type": "TASK_MOVED",
  "channel": "/topic/workspaces/3/tasks",
  "timestamp": "2026-03-26T15:02:00Z",
  "payload": {
    "workspaceId": 3,
    "taskId": 42,
    "fromColumnId": 10,
    "toColumnId": 12,
    "position": 1200.0,
    "movedByUserId": 7
  }
}
```

## 3) Send commands

### Send message command

- Destination: `/app/messages/send`

```json
{
  "conversationId": 15,
  "content": "Hello team"
}
```

### Move task command

- Destination: `/app/tasks/move`

```json
{
  "workspaceId": 3,
  "taskId": 42,
  "fromColumnId": 10,
  "toColumnId": 12,
  "position": 1200.0
}
```

## 4) Authorization rules

- `tasks/move`: user must be owner or member of target workspace.
- `messages/send`: user must pass conversation authorization hook.

## 5) REST + realtime integration for notifications

- API creates notification: `POST /api/notifications`
- On successful creation, backend publishes realtime event to recipient channel `/user/queue/notifications`.
