# AddisPay Integration Module

`src/modules/payments/addispay` targets AddisPay’s REST interface and follows the same self-contained structure as the other gateways.

## Module Anatomy

- `clients/addispay.client.js` – Axios client with bearer token header.
- `validators/request.schema.js` – Joi validation for initiation payloads.
- `services/addispay.service.js` – Initiates and verifies payments.
- `repositories/transaction.repository.js` – Persists data to MySQL/Mongo.
- `http/` – Express controller + router definitions.

## API Usage

### Initiate Payment

`POST /payments/addispay`

```json
{
  "amount": 999.99,
  "currency": "ETB",
  "customerId": "CUS-5001",
  "description": "Enterprise license",
  "metadata": {
    "contract": "CNT-2025-04"
  }
}
```

### Verify Payment

`GET /payments/addispay/:reference`

- Calls AddisPay `/payments/{reference}` and updates the SQL record.

### List Payments

`GET /payments/addispay`

- Returns the authenticated user’s AddisPay transactions ordered by `created_at DESC`.

## Validation Rules

| Field | Type | Description |
| --- | --- | --- |
| `amount` | Number | Required, positive |
| `currency` | String(3) | Defaults to ETB |
| `customerId` | String | Required – AddisPay customer handle |
| `description` | String | Required |
| `metadata` | Object | Optional, stored verbatim |

## Plug-and-Play Example

```js
const initAddisPay = require('./modules/payments/addispay');
const { router } = initAddisPay({ mysqlConnection, mongoConnection, authGuard });
app.use('/payments/addispay', router);
```

Ensure the following environment variables are set:

- `ADDISPAY_API_KEY`
- `ADDISPAY_BASE_URL`

The module automatically injects both into outbound requests.
