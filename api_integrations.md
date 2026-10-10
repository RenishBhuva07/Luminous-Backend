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
├── DELETE /auth/account
│
├── GET    /auth/sessions
├── DELETE /auth/sessions/:id
│
├── POST   /auth/forgot-password
├── POST   /auth/verify-reset-otp
└── POST   /auth/reset-password
```

- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Authenticate an existing user and get a token.
- `POST /auth/refresh` - Refresh the user's access token.
- `POST /auth/logout` - Logout the authenticated user.
- `GET /auth/profile` - Retrieve the profile of the authenticated user (Requires Auth).
- `PATCH /auth/profile` - Complete or update the profile of the authenticated user (Requires Auth).
- `PATCH /auth/password` - Change the user's password (Requires Auth).
- `DELETE /auth/account` - Delete the user's account (Requires Auth).
- `GET /auth/sessions` - Retrieve all active sessions for the user (Requires Auth).
- `DELETE /auth/sessions/:id` - Revoke a specific active session (Requires Auth).
- `POST /auth/forgot-password` - Request an OTP for password reset.
- `POST /auth/verify-reset-otp` - Verify the OTP for password reset.
- `POST /auth/reset-password` - Reset the user's password.

## 3. Chat

**Base path:** `/chats`

```text
CHAT
│
├── POST   /chats/messages
├── GET    /chats/
│
├── GET    /chats/:chatId/messages
├── POST   /chats/:chatId/messages
│
├── PATCH  /chats/:chatId
└── DELETE /chats/:chatId
```

- `POST /chats/messages` - Create a chat automatically when the first message is sent (Requires Auth).
- `GET /chats/` - List all conversations for the user (Requires Auth).
- `GET /chats/:chatId/messages` - Retrieve message history for an existing conversation (Requires Auth).
- `POST /chats/:chatId/messages` - Send a reply/continue an existing conversation (Requires Auth).
- `PATCH /chats/:chatId` - Update chat details (e.g., title) (Requires Auth).
- `DELETE /chats/:chatId` - Delete a chat conversation (Requires Auth).
