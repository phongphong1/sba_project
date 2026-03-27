# DevQuest - Fullstack Workspace Collaboration Platform

DevQuest la du an fullstack cho quan ly cong viec theo workspace, bao gom board/task, timeline, messaging, notification realtime, va quan ly tai khoan.

Monorepo gom 2 phan:
- Backend: Spring Boot + MySQL + Redis + WebSocket STOMP
- Frontend: React + Vite + Tailwind

## 1. Cau truc thu muc

```text
sba_project/
|- backend/devquest/      # Spring Boot API + WebSocket
|- frontend/devquest/     # React client app
`- docs/                  # Tai lieu bo sung
```

## 2. Cong nghe chinh

### Backend
- Java 17
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Redis
- WebSocket (STOMP)
- Thymeleaf + Mail

### Frontend
- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Axios
- STOMP client (`@stomp/stompjs`)

## 3. Yeu cau moi truong

- Java 17+
- Node.js 20+
- npm 10+
- MySQL 8+
- Redis 6+

## 4. Huong dan chay nhanh

### Buoc 1: Clone va di chuyen vao du an

```bash
git clone <your-repo-url>
cd sba_project
```

### Buoc 2: Cau hinh bien moi truong backend

Backend doc bien moi truong tu `backend/devquest/src/main/resources/application.properties`.

Tao file env cho he dieu hanh cua ban (hoac set qua IDE) voi cac bien toi thieu sau:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=devquest
DB_USER=root
DB_PASSWORD=your_password

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

VERIFY_EXPIRY_MINUTES=15
VERIFY_BASE_URL=http://localhost:5173/verify
RESET_PASSWORD_EXPIRY_MINUTES=15
RESET_PASSWORD_BASE_URL=http://localhost:5173/reset-password

R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket
R2_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
```

Luu y:
- Co the de `REDIS_PASSWORD` rong neu Redis local khong bat auth.
- Cac bien `R2_*` can khi su dung upload file len Cloudflare R2.

### Buoc 3: Chay backend

Tu thu muc goc du an:

```bash
cd backend/devquest
./mvnw spring-boot:run
```

Tren Windows PowerShell:

```powershell
cd backend/devquest
.\mvnw.cmd spring-boot:run
```

Mac dinh backend chay o `http://localhost:8080`.

### Buoc 4: Cau hinh frontend

Tao file `frontend/devquest/.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_PUBLIC_FILE_BASE_PATH=https://dq.fithub.page/
```

`VITE_WS_URL` co the bo qua. Khi do frontend tu suy ra websocket endpoint tu `VITE_API_URL`.

### Buoc 5: Chay frontend

```bash
cd frontend/devquest
npm install
npm run dev
```

Frontend mac dinh chay o `http://localhost:5173`.

## 5. API va Realtime overview

- API base URL: `http://localhost:8080/api`
- Auth endpoints: `/api/auth/*`
- User endpoints: `/api/users/*`
- Workspace endpoints: `/api/workspaces/*`
- Task endpoints: `/api/tasks/*`
- WebSocket endpoint: `/ws`
- STOMP app prefix: `/app`
- STOMP broker prefixes: `/topic`, `/queue`

Tai lieu WebSocket chi tiet: `backend/devquest/docs/websocket-contract.md`

## 6. Script huu ich

### Frontend (`frontend/devquest`)
- `npm run dev`: Chay local development server
- `npm run build`: Build production
- `npm run preview`: Preview ban build
- `npm run lint`: Kiem tra lint

### Backend (`backend/devquest`)
- `./mvnw spring-boot:run`: Chay ung dung
- `./mvnw test`: Chay test
- `./mvnw clean package`: Build jar

## 7. CORS va local origins

Backend dang cho phep CORS voi:
- `http://localhost:3000`
- `http://localhost:5173`

Neu frontend chay port khac, can cap nhat cau hinh CORS trong backend.

## 8. Troubleshooting nhanh

- Loi ket noi database: kiem tra MySQL da chay, dung ten DB va credential.
- Loi ket noi Redis: dam bao Redis service dang chay dung host/port.
- Frontend goi API loi CORS/401: kiem tra `VITE_API_URL` va token JWT trong localStorage.
- WebSocket khong connect duoc: kiem tra backend dang chay, endpoint `/ws`, va token hop le.

