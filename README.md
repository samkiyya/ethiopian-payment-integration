# Ethiopian Payment Integration

Enterprise-grade Express 5 boilerplate for Ethiopian PSPs (**Chapa**, **SantiPay**, **AddisPay**) with:

- Modular MVC folders you can lift into any project (each payment provider ships with its own models, controllers, services, validators, repositories, HTTP client).
- Shared JWT authentication/user module (Sequelize + Argon2) with HTTP-only cookies and bearer support.
- Dual persistence layers per payment module: **MySQL (Sequelize)** for structured records and **MongoDB (Mongoose)** for raw payload archives.
- Modern security middleware (Helmet, CORS, compression) and structured logging via Pino.
- Unit tests proving auth and provider service logic.

> **Drop-in modules**: copy `src/modules/payments/<provider>` into another project and wire it with your own MySQL + Mongo connections and auth guard. No refactoring needed.

## Tech Stack

- Node.js 18+, Express 5 (router-level async/await, fetch-ready).
- Sequelize (MySQL) + Mongoose (MongoDB) running side by side.
- Argon2 password hashing, JWT tokens, Joi validation.
- pnpm for reproducible installs, Jest for unit tests.

## Quick Start

```bash
pnpm install
pnpm approve-builds   # one-time approval for native argon2 build
cp .env.example .env  # update DB URLs + API keys
pnpm dev
```

By default the server listens on `PORT` (4000) and auto-syncs Sequelize models to the configured MySQL database while connecting to Mongo for payload archiving.

## Environment

Key settings defined in `.env`:

| Variable | Description |
| --- | --- |
| `MYSQL_*` | Standard host/port/database/user/password for Sequelize |
| `MONGO_URI` | MongoDB connection string (raw payload store) |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `TOKEN_COOKIE_NAME` | Auth token settings |
| `CHAPA_*`, `SANTIPAY_*`, `ADDISPAY_*` | Provider base URLs + API keys |
| `CORS_ORIGIN` | Comma-separated allowlist for CORS |

## Project Layout

```
src/
   app.js                 # Express factory (injects DB connections + modules)
   server.js              # Bootstraps MySQL + Mongo, starts HTTP server
   core/
      config/env.js        # dotenv loader + typed getters
      database/            # mysql + mongo connection helpers
      errors/appError.js   # shared operational error
      http/response.js     # JSON response helpers
      middleware/          # error/notFound + Joi validator
      security/            # password hashing + JWT helpers
      utils/httpClient.js  # axios factory with sane defaults
   modules/
      auth/                # shared user/JWT flows
      payments/
         chapa/             # full MVC for Chapa (MySQL + Mongo models)
         santipay/          # ditto for SantiPay
         addispay/          # ditto for AddisPay
tests/
   auth.service.test.js   # unit tests for auth service logic
   chapa.service.test.js  # unit tests for Chapa payment service
```

## API Surface (v1)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Create user (Argon2 hashing) | Public |
| POST | `/api/v1/auth/login` | Issue JWT + HTTP-only cookie | Public |
| GET | `/api/v1/auth/profile` | Fetch authenticated profile | JWT (header/cookie) |
| POST | `/api/v1/auth/logout` | Clear auth cookie | JWT |
| POST | `/api/v1/payments/chapa` | Initialize Chapa checkout | JWT |
| GET | `/api/v1/payments/chapa/:reference` | Verify Chapa payment | JWT |
| POST | `/api/v1/payments/santipay` | Initialize SantiPay transfer | JWT |
| POST | `/api/v1/payments/addispay` | Initialize AddisPay transfer | JWT |
| GET | `/api/v1/payments/<provider>` | List provider transactions for user | JWT |

### Sample Calls

```http
POST /api/v1/auth/login
Content-Type: application/json

{
   "email": "user@example.com",
   "password": "Password123!"
}
```

```http
POST /api/v1/payments/chapa
Authorization: Bearer <JWT>
Content-Type: application/json

{
   "amount": 1500,
   "currency": "ETB",
   "callbackUrl": "https://merchant.app/callback",
   "metadata": {
      "orderId": "ORD-1001"
   }
}
```

## Re-using Payment Modules

Each provider folder exposes a small factory:

```js
const initChapa = require('src/modules/payments/chapa');
const { router } = initChapa({ mysqlConnection, mongoConnection, authGuard });
app.use('/payments/chapa', router);
```

When copying `src/modules/payments/<provider>` into another codebase you only need to provide:

1. A Sequelize instance already connected to MySQL.
2. A Mongoose connection (or rely on the default connection).
3. An auth guard middleware (any Express middleware that sets `req.user`).

All other concerns—HTTP client, Joi validators, repositories, controllers—are bundled inside the folder.

## Testing Strategy

`pnpm test`

- `auth.service.test.js`: ensures registration prevents duplicates and login flows produce signed JWTs.
- `chapa.service.test.js`: guarantees HTTP failures bubble up as `AppError`s and successful inits persist to repositories.

Tests mock external APIs and repositories, so they run instantly without touching real gateways or databases.

## Deployment Notes

- Use `pnpm start` in production (no nodemon) after setting `NODE_ENV=production`.
- Configure a read/write MySQL user with SSL when running in the cloud.
- Mongo is only used for payload journaling; you may point it to Shared Cluster tier for cheaper storage.

## Further Reading

Provider-specific onboarding docs live in `docs/*.md`. Keep them synchronized with any contract changes from Chapa, SantiPay, or AddisPay.

## Author

Built and maintained by Samuel. Contributions are welcome via pull requests.

## License

Released under the [MIT License](LICENSE).
