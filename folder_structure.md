```text
Luminous-Backend
├── src
│   ├── config
│   │   └── env.ts
│   ├── controllers
│   │   ├── chat.controller.ts
│   │   └── health.controller.ts
│   ├── middleware
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── routes
│   │   ├── chat.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   ├── schemas
│   │   └── chat.schema.ts
│   ├── services
│   │   ├── ai
│   │   │   ├── gemini.client.ts
│   │   │   └── gemini.service.ts
│   │   └── chat
│   │       └── chat.service.ts
│   ├── types
│   ├── utils
│   ├── app.ts
│   ├── list-models.ts
│   └── server.ts
├── .env.example
├── package-lock.json
├── package.json
└── tsconfig.json
```
