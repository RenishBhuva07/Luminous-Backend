```text
Luminous-Backend
├── src
│   ├── config
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   └── health.controller.ts
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── models
│   │   ├── password.service.ts
│   │   ├── session.model.ts
│   │   ├── token.service.ts
│   │   └── user.model.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   ├── schemas
│   │   ├── auth.schema.ts
│   │   └── chat.schema.ts
│   ├── services
│   │   ├── ai
│   │   │   ├── gemini.client.ts
│   │   │   └── gemini.service.ts
│   │   ├── auth
│   │   │   └── auth.service.ts
│   │   └── chat
│   │       └── chat.service.ts
│   ├── utils
│   │   └── app-error.ts
│   ├── app.ts
│   ├── list-models.ts
│   └── server.ts
├── .env
├── .env.example
├── package-lock.json
├── package.json
└── tsconfig.json
```
