# Rate Limit Sandbox POC

Local-only Docker environment for testing IP + email rate limiting on all four form handlers. Uses placeholder config (`@example.test` addresses) and Mailpit — no production SMTP or SharePoint.

## Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- PowerShell (for smoke tests on Windows)

## Quick start

From the repository root:

```powershell
# JSON storage (default)
$env:RATE_LIMIT_STORAGE = 'json'
docker compose up --build
```

```powershell
# SQLite storage (restart web after switching)
$env:RATE_LIMIT_STORAGE = 'sqlite'
docker compose up --build
```

- Site: http://localhost:8080
- Mailpit UI: http://localhost:8025 (SMTP on port 1025 inside the compose network)

## Rate limit settings (sandbox)

| Constant | Value |
|----------|-------|
| `RATE_LIMIT_IP_MAX` | 3 |
| `RATE_LIMIT_EMAIL_MAX` | 2 |
| `RATE_LIMIT_WINDOW_SEC` | 300 (5 minutes) |
| `RATE_LIMIT_RETENTION_DAYS` | 7 |

Storage driver is selected via the `RATE_LIMIT_STORAGE` environment variable (`json` or `sqlite`).

## Reset storage between runs

```powershell
Remove-Item -Recurse -Force sandbox/data/rate-limits -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force sandbox/data/rate-limits/json | Out-Null
```

## Smoke tests

```powershell
# With Docker running:
.\sandbox\tests\rate_limit_smoke.ps1

# Explicit storage mode label in output:
$env:RATE_LIMIT_STORAGE = 'json'; .\sandbox\tests\rate_limit_smoke.ps1
$env:RATE_LIMIT_STORAGE = 'sqlite'; .\sandbox\tests\rate_limit_smoke.ps1
```

The script POSTs minimal valid payloads to all four handlers, exercises IP/email limits, and exits non-zero on failure.

## Branch policy

All POC work stays on `feature/rate-limit-sandbox-poc` locally. Do not push, open PRs, or merge to `main`.
