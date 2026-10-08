# API Integrations

This file tracks all the API routes integrated into the Luminous-Backend project.

## Base URL
`/` (or API version prefix like `/api/v1` if configured in `app.ts`)

## 1. Health 
**Base path:** `/health`
- `GET /health` - Health check endpoint to verify if the server is running.

## 2. Authentication
**Base path:** `/auth`
- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Authenticate an existing user and get a token.
- `PATCH /auth/profile` - Complete or update the profile of the authenticated user (Requires Auth).
- `GET /auth/profile` - Retrieve the profile of the authenticated user (Requires Auth).

## 3. Chat
**Base path:** `/chats`
- `POST /chats/messages` - Send a chat message (likely processed by the AI integration).
