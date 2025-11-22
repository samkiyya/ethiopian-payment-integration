# Getting Started

This guide walks you through preparing the dual-database stack, configuring environment variables, and running the modular Express APIs locally.

## 1. Prerequisites

- **Node.js:** v18 or newer (LTS recommended)
- **pnpm:** `corepack enable pnpm` or `npm install -g pnpm`
- **MySQL 8+** (or managed equivalent)
- **MongoDB 6+** (Atlas/free tier works for payload journaling)

## 2. Install Dependencies

```bash
pnpm install
pnpm approve-builds   # first run only; allows argon2 native build
```

## 3. Configure Environment Variables

Copy the template and update secrets for your environment:

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `MYSQL_*` | Host/user/password/db for Sequelize connection |
| `MONGO_URI` | Mongo connection string |
| `JWT_SECRET` | Signing key for access tokens |
| `CORS_ORIGIN` | Comma-separated list of allowed origins |
| `CHAPA_*` / `SANTIPAY_*` / `ADDISPAY_*` | API base URLs + keys per provider |

> **Tip:** Each payment module can point to different sandbox URLs while sharing the same auth core.

## 4. Database Prep

1. **MySQL:** create a database (e.g., `ethiopian_payments`). Grant full privileges to the configured user.
2. **MongoDB:** provision a database/cluster. The application auto-creates collections for raw payloads.

Sequelize will automatically sync tables on boot. For production, lock migrations down by exporting the models into a migration tool of your choice.

## 5. Run the API

```bash
pnpm dev
# or
pnpm start   # production mode (no nodemon)
```

The server binds to `PORT` (default 4000) and exposes routes under `/api/v1`.

## 6. Smoke Test

1. Register a user via `POST /api/v1/auth/register`.
2. Login via `POST /api/v1/auth/login` and capture the returned JWT/cookie.
3. Hit `POST /api/v1/payments/chapa` with a sample payload (see provider docs) to confirm the MySQL + Mongo persistence pipeline.

## 7. Running Tests

Unit tests mock external services and run entirely in-memory:

```bash
pnpm test
```

## 8. Modular Usage

If you only need a specific payment provider in another project:

1. Copy the folder `src/modules/payments/<provider>`.
2. Instantiate it with your own Sequelize + Mongoose connections and an auth guard middleware.
3. Mount the returned Express router under any path (see `src/modules/payments/index.js` for an example).

Refer to the provider-specific docs inside this folder for expected payloads and verification flows.
