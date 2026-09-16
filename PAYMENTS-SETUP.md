# PayPal and Airtm setup

AC Shop never needs your PayPal or Airtm password. Provider access must use official API credentials or an official authorization flow, stored only in the server environment.

## PayPal

1. Create a PayPal Developer app.
2. Start with sandbox credentials.
3. Put the client ID and secret in `.env`:

```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
PAYPAL_RECEIVER_EMAIL=your_verified_paypal_email
```

The enrollment billing endpoint creates a PayPal Checkout order and returns the provider approval URL. A real production deployment must also implement and verify the PayPal order capture callback before marking an enrollment paid.

## Airtm

Airtm integration requires official Airtm API documentation and credentials for your account. Configure only values supplied by Airtm:

```env
AIRTM_API_KEY=your_airtm_api_key
AIRTM_API_BASE=https://official-airtm-api-host
AIRTM_PAYOUT_PATH=/official/payout/path
AIRTM_RECEIVER_ACCOUNT=your_airtm_account_identifier
```

The current Airtm payout adapter is intentionally disabled until the official endpoint, authentication scheme, recipient field, and response format are confirmed. Do not put a password, PIN, or recovery code in any environment variable or form.

## Security checklist

- Keep `.env` private; it is excluded by `.gitignore`.
- Use a long random `JWT_SECRET` in production.
- Use sandbox/test credentials before live money movement.
- Do not store full card numbers, CVVs, PINs, or passwords.
- Verify provider webhooks before treating a payment as completed.
- Revoke and rotate credentials immediately if they are exposed.
