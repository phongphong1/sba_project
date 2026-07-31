# DevQuest Frontend

DevQuest frontend is a React + Vite application for workspace collaboration, including dashboard, board (kanban), timeline, messaging, profile, and realtime notifications.

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Axios
- STOMP WebSocket (`@stomp/stompjs`)
- UI primitives: Radix UI + shadcn-style components

## Requirements

- Node.js 20+
- npm 10+

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the required variables:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

3. Start development server:

```bash
npm run dev
```

App runs on the default Vite port (usually `http://localhost:5173`).

## Environment Variables

The app reads values from `.env` in the project root.

Notes:
- `VITE_API_URL` is required and used by Axios client.
- `VITE_WS_URL` is optional. If missing, websocket URL is derived from `VITE_API_URL` or current browser host.

## Available Scripts

- `npm run dev`: start local development server.
- `npm run build`: create production build.
- `npm run preview`: preview production build locally.
- `npm run lint`: run ESLint.

## Project Structure

```text
src/
	api/              # API clients (axios-based)
	components/       # Shared and feature UI components
	constants/        # App constants and UI maps
	contexts/         # React context providers
	data/             # Mock data and local fixtures
	hooks/            # Custom hooks
	layouts/          # Layout components
	lib/              # Utilities and realtime client
	pages/            # Route-level pages
	routes/           # Router and protected route setup
```

## Routing Overview

Main route groups:
- Public: `/`, `/login`, `/signup`, `/forgot-password`, `/verify`, `/invite`
- Protected workspace routes:
	- `/dashboard` (redirects to selected workspace)
	- `/tasks` and `/projects` (redirect to board)
	- `/timeline`
	- `/messages`
	- `/w/:workspaceId/*` for workspace-scoped pages

## Realtime

Realtime features use STOMP over WebSocket in `src/lib/realtime/stompClient.js`.
Authentication token is attached in connect headers.
If websocket auth fails, token is cleared and user is redirected to `/login`.

## Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

## Linting

```bash
npm run lint
```

## Notes for Contributors

- Use `@` alias for imports from `src`.
- Keep feature logic inside feature-specific folders (`pages`, `components`, `hooks`).
- Prefer existing UI components from `src/components/ui` before adding new primitives.
