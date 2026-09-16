Airtm payout integration (local setup)

Overview
- This project now supports a configurable Airtm payout flow in `src/routes/payments.js`.
- Airtm calls are gated by `AIRTM_API_KEY`, `AIRTM_API_BASE`, and `AIRTM_PAYOUT_PATH`.
- Express serves the AC Shop landing page at `/` for deployment at `https://saviourwebsite.online`.
- Provider credential and authorization guidance is documented in `PAYMENTS-SETUP.md`.

Local setup
1. Add Airtm keys to your `.env`:

```
AIRTM_API_KEY=your_airtm_api_key
AIRTM_API_BASE=https://api.airtm.com
AIRTM_PAYOUT_PATH=/v1/payouts
AIRTM_RECEIVER_ACCOUNT=igbokwefranksaviour@gmail.com
```

2. Start the server:

```bash
node server.js
```

Notes
- The workspace does not contain Airtm API documentation or sandbox credentials, so the endpoint and payload are configurable placeholders rather than a verified Airtm contract.
- Before live use, confirm Airtm's official endpoint, authentication scheme, recipient field, and payout payload, then set `AIRTM_API_BASE` and `AIRTM_PAYOUT_PATH` accordingly. Do not treat the current generic endpoint as verified.
- The Jest tests validate the local request contract without contacting Airtm or PayPal.
- For safety, use sandbox/test Airtm credentials first.
- Live money transfers require verified Airtm accounts and app credentials; I cannot perform them for you.
