# API Integrations

This file tracks all the API routes integrated into the Luminous-Backend project.

## Base URL
`/` (or API version prefix like `/api/v1` if configured in `app.ts`)

## 1. Health 
**Base path:** `/health`

```text
HEALTH
│
└── GET    /health
```

- `GET /health` - Health check endpoint to verify if the server is running.

## 2. Authentication
**Base path:** `/auth`

```text
AUTH
│
├── POST   /auth/register
├── POST   /auth/login
├── POST   /auth/refresh
├── POST   /auth/logout
│
├── GET    /auth/profile
├── PATCH  /auth/profile
│
├── PATCH  /auth/password
└── DELETE /auth/account
```

- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Authenticate an existing user and get a token.
- `POST /auth/refresh` - Refresh the user's access token.
- `POST /auth/logout` - Logout the authenticated user.
- `GET /auth/profile` - Retrieve the profile of the authenticated user (Requires Auth).
- `PATCH /auth/profile` - Complete or update the profile of the authenticated user (Requires Auth).
- `PATCH /auth/password` - Change the user's password (Requires Auth).
- `DELETE /auth/account` - Delete the user's account (Requires Auth).

## 3. Chat
**Base path:** `/chats`

```text
CHAT
│
└── POST   /chats/messages
```

- `POST /chats/messages` - Send a chat message (likely processed by the AI integration).
