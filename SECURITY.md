# Security Policy

Supported branches

- main, dev, and hardening feature branches

Reporting a Vulnerability

- Use private channels. Do not open public issues for sensitive reports.

Operational Baselines

- Secrets via environment only; never commit secrets. Provide .env.sample only.
- JWT: short-lived access tokens, refresh rotation, strong secrets.
- Rate limiting on all public endpoints.
- GraphQL: depth/complexity limits, body size limit, disable introspection in prod if needed.
- Uploads: validate mimetype and magic number, sanitize filenames, max size, block SVG scripts.
- Mail: validate inputs, throttle, prevent header injection.
- DB: unique constraints, indexes, soft-delete defaults.
- Logging: structured logs; no secrets in logs.
- Headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP.

Change Management

- No direct commits to main/dev; use feature branches with CI.
