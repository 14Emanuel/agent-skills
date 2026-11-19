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

Longbridge OpenAPI supports both OAuth 2.0 interactive login and programmatic API credentials.

### Interactive CLI Authentication (OAuth 2.0)
For local terminal usage, initiate the browser-based OAuth flow:
```bash
longbridge auth login
```
This stores session credentials securely in the local user profile.

### Headless & Programmatic Configuration (Environment Variables)
For CI/CD pipelines, automated scripts, or headless environments, export the following environment variables:

| Variable | Description | Required |
|---|---|---|
| `LONGBRIDGE_APP_KEY` | OpenAPI Application Key generated from developer portal | Yes |
| `LONGBRIDGE_APP_SECRET` | OpenAPI Application Secret | Yes |
| `LONGBRIDGE_ACCESS_TOKEN` | OAuth Access Token or permanent API key token | Yes |
| `LONGBRIDGE_HTTP_URL` | Base API URL (defaults to `https://openapi.longbridge.com`) | Optional |
| `LONGBRIDGE_ENABLE_OVERNIGHT` | Boolean toggle (`true`/`false`) for US overnight quotes | Optional |

To obtain API credentials:
1. Log in to the [Longbridge Developer Portal](https://open.longbridge.com).
2. Create an Application under **API Management**.
3. Generate and configure App Key, App Secret, and Access Tokens with appropriate permissions (Market Data, Trade Execution, Account Info).

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
