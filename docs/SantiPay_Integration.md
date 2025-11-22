# SantiPay Integration Module

Located at `src/modules/payments/santipay`, this package mirrors the same MVC layout used for other providers while speaking SantiPay’s API dialect.

## Connection Requirements

- **Headers:** `X-API-Key` is injected automatically from `SANTIPAY_API_KEY`.
- **Transport:** Base URL defaults to `https://api.santipay.et/v1` but can be overridden in `.env`.

## Supported Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/payments/santipay` | Initiate a transfer |
| `GET` | `/payments/santipay` | List transactions for authenticated user |
| `GET` | `/payments/santipay/:reference` | Fetch latest status from SantiPay API |

## Request Schema

`validators/request.schema.js` enforces:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `amount` | Number | ✅ | Positive |
| `currency` | String(3) |  | Defaults to ETB |
| `description` | String | ✅ | Narrative shown to payer |
| `customerPhone` | String | ✅ | MSISDN registered with SantiPay |
| `metadata` | Object |  | Stored in MySQL+Mongo |

Example payload:

```json
{
  "amount": 250,
  "currency": "ETB",
  "description": "Wallet top-up",
  "customerPhone": "+251911234567",
  "metadata": {
    "invoice": "INV-1099"
  }
}
```

## Repository Behavior

- On initiation, records are inserted into `santipay_transactions` (MySQL) and mirrored to Mongo with `rawRequest`/`rawResponse` for debugging.
- `updateStatusByReference()` hydrates the SQL record when `/payments/:reference` is called.

## Reuse in Other Projects

```js
const initSantiPay = require('./modules/payments/santipay');
const { router } = initSantiPay({ mysqlConnection, mongoConnection, authGuard });
app.use('/payments/santipay', router);
```

No additional wiring required—the module exposes ready-to-use controllers and routes.
