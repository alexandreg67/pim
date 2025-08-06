# Hardening & Performance Plan

Branch: feat/hardening-phase1
Owner: Alex / Crush

Phases

Sprint 1: Security + Validation + Limits

- GraphQL: input validation, depth/complexity limits, rate limiting, DataLoader
- Auth: strengthen rate limiting, token TTL/rotation checks
- Upload/Mail: strict validation, size limits, magic number, sanitize names, throttle
- Nginx: security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, basic CSP)
- Tests: integration for upload/mail, DataLoader units, GraphQL limit tests
- Docs: SECURITY.md, env samples

Sprint 2: Performance + Cache + DB

- Cache strategy (TTL, keys, invalidation), metrics hit rate
- DB indexes (filters, partial indexes, uniques), migrations in CI
- GraphQL pagination everywhere, N+1 cleanup
- Frontend code-splitting, image optimizations, Apollo policies
- Observability: structured logs, metrics endpoints
- Perf tests: k6 scripts

Sprint 3: Contracts + DX + Hardening

- Schema diff checks, client codegen in CI, shared enums/roles package
- Error policy, soft delete defaults
- CI: e2e Playwright on ephemeral env, dependency/image scans
- Nginx static caching (immutable, ETag, gzip/br)
- Docs: Architecture, Caching, Indexing, Runbooks
- Optional: CSP per page, GraphQL introspection off in prod, captcha on brute-force

Workflow Rules

- No changes on main/dev directly
- Small PRs per feature within this branch merged into dev later
- Keep app functional; gated features behind configs
- Each step: lint, typecheck, tests green

Changelog

- CI: added service workflows (client, graphql, upload, mail)
- GraphQL: complexity + body limit + rate limiting plugins wired; DataLoaders per-request
- GraphQL: enabled class-validator; Product DTOs and tests added
- Nginx: security headers (HSTS, CSP, Referrer-Policy, Permissions-Policy)
- Upload: magic number verification, stricter filename sanitization
