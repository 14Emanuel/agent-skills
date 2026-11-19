# Longbridge Setup, Authentication & Configuration Guide

This guide details environment setup, authentication flows, configuration variables, and platform capabilities for the Longbridge Financial Markets skill.

---

## 1. CLI Installation

Install the official `longbridge` terminal CLI across supported operating systems:

### macOS (Homebrew)
```bash
brew install --cask longbridge/tap/longbridge-terminal
```

### Windows (Scoop)
```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

### Linux & Direct Binary
Download the pre-compiled binary matching your CPU architecture (x86_64 or aarch64) from the official Longbridge releases:
```bash
# Make binary executable and place into system PATH
chmod +x longbridge
sudo mv longbridge /usr/local/bin/
```

Verify installation:
```bash
longbridge --version
```

---

## 2. Authentication & Environment Configuration

All Longbridge CLI and OpenAPI tools use **OAuth 2.0** for secure, authenticated communication.

### Interactive Terminal Login
For interactive environments, initiate the web OAuth flow:
```bash
longbridge auth login
```
This stores session and refresh credentials in the user token path (`~/.longbridge/openapi/cli-auth` on Linux/macOS, `%USERPROFILE%\.longbridge\openapi\cli-auth` on Windows).

### Headless & CI/CD Pipeline Automation
In headless, non-interactive CI/CD containers:
1. Complete `longbridge auth login` directly on the target runner host/container that will execute commands, as CLI tokens are encrypted using machine-derived keys.
2. Ensure the token directory (`~/.longbridge/openapi/`) remains writable and is persisted/cached across pipeline steps so refreshed credentials are retained.
3. For custom automated integrations, register dedicated OAuth clients via `POST https://openapi.longbridge.com/oauth2/register`.

### Environment Variables
Optional runtime settings can be provided via environment variables:

| Variable | Description | Default |
|---|---|---|
| `LONGBRIDGE_HTTP_URL` | Base API endpoint override (honored by CLI in staging/debug builds; release builds route to regional endpoints; SDKs allow direct endpoint configuration) | `https://openapi.longbridge.com` |
| `LONGBRIDGE_ENABLE_OVERNIGHT` | Boolean toggle (`true`/`false`) for US overnight quote streaming | `false` |

---

## 3. Market Capabilities & Supported Asset Classes

Longbridge provides multi-asset market data and trade execution across major global exchanges:

| Market | Asset Classes | Trading Hours (Local) | Features Supported |
|---|---|---|---|
| **United States (US)** | Stocks, ETFs, Options, ADRs | 09:30–16:00 ET (shifts between EST/EDT during daylight saving; Pre-market: 04:00, Post-market: 20:00) | Real-time Level 2 quotes, K-lines, Trade execution, SEC 13F / Form 4 |
| **Hong Kong (HK)** | Stocks, ETFs, Warrants, CBBCs | 09:30–12:00, 13:00–16:00 HKT | Level 2 market depth, IPO subscription tracking, Corporate filings |
| **China A-Shares (SH/SZ)** | SSE & SZSE listed equities (Connect) | 09:30–11:30, 13:00–15:00 CST | Northbound trading, Quotes, Financial statements |
| **Singapore (SG)** | Equities, REITs | 09:00–12:00, 13:00–17:00 SGT | Real-time quotes, Dividends, Company profiles |

---

## 4. Rate Limits & Performance Best Practices

To ensure reliable automation and avoid request throttling:

- **REST API Throughput**: Standard tier permits up to **10 requests per second** per account.
- **WebSocket Streaming**: Used for live quote streaming and order status push notifications. Maintain a persistent heartbeat to prevent socket timeouts.
- **Token Lifecycle**: OAuth access tokens automatically refresh via the CLI/SDK. If using static access tokens, ensure periodic renewal prior to expiration.
- **Error Handling**: Monitor for HTTP `429 Too Many Requests` status codes and implement exponential backoff with jitter.
