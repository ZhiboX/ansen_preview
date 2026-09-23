# Contact form handover

Emmeet connects the email backend and deploys the website on Vultr. AWS provides email delivery. The frontend does not contain AWS credentials or a confirmed recipient address.

## Enable sending

After implementing and testing the same-origin endpoint, update `assets/contact-config.js`:

```js
window.ANSEN_CONTACT = Object.freeze({
  enabled: true,
  endpoint: '/api/contact'
});
```

The endpoint above is the agreed integration path, not an existing service supplied by this package. Sending is disabled in the delivered configuration. Until enabled, visitors see a short availability message. That message disappears automatically when a valid endpoint is configured.

## API contract

`POST /api/contact`, JSON request and JSON response.

| Field | Validation |
| --- | --- |
| `name` | Required; trim whitespace; maximum 100 characters |
| `email` | Required; valid email; maximum 254 characters |
| `organisation` | Optional; maximum 180 characters |
| `topic` | One of the values in the page's select element |
| `message` | Required; trim whitespace; 10–5000 characters |
| `website` | Honeypot field; should be empty |

The AI for Care option retains the value `Care Sector Collaboration`.

Use a fixed recipient and a verified company sender. Put the visitor's email in Reply-To. Validate on the server, escape email content, check Origin, limit request size and rate, and add bot protection as needed. Keep all credentials on the server.

- Accepted by SES or a reliable queue: HTTP 200/202, `Content-Type: application/json`, `{"ok":true}`.
- Invalid input: HTTP 400, `{"ok":false}`.
- Rate limit: HTTP 429, `{"ok":false}`.
- Delivery service failure: HTTP 5xx, `{"ok":false}`. Log and monitor failures; do not return success.

The frontend accepts success only from a successful JSON response containing `ok: true`. It keeps input after failures and clears it after success. Requests time out after 15 seconds without automatic retries. Acceptance does not guarantee inbox delivery; monitor SES bounces and failures.

## Before launch

Confirm the company recipient, AWS account/region, verified sender and DNS access. Route `/api/contact` to the backend, outside the static fallback. Test actual receipt, Reply-To, validation, rate limiting, backend failures and mobile use. Then enable sending and refresh the cached configuration.
