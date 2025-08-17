# Project Structure
│  .env
│  main.js
│  package.json
│  pnpm-lock.yaml
│  readme.md
│  
├─logs
│      combined.log
│      error.log
│
├─public
└─src
    ├─application
    │      app.js
    │
    ├─config
    │      config.default.js
    │      config.development.js
    │      config.production.js
    │      config.test.js
    │      index.js
    │
    ├─constants
    │      error-codes.js
    │      http-status.js
    │      index.js
    │      messages.js
    │      regex.js
    │      roles.js
    │
    ├─controllers
    │      auth.controller.js
    │      index.js
    │      post.controller.js
    │      upload.controller.js
    │      user.controller.js
    │
    ├─database
    │  │  config.js
    │  │  connection.js
    │  │  index.js
    │  │
    │  ├─migrations
    │  └─seeders
    ├─middlewares
    │      auth.js
    │      cors.js
    │      error-handler.js
    │      index.js
    │      rate-limit.js
    │      request-logger.js
    │      response-time.js
    │      validate.js
    │
    ├─models
    ├─routes
    │      index.js
    │
    ├─services
    └─utils
            logger.js
            swagger.js