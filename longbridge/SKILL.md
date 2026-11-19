---
name: longbridge
description: Live financial market data, trading, quotes, and portfolio analysis across US, HK, A-share, and Singapore markets via the Longbridge OpenAPI CLI.
---

# Longbridge Financial Markets

Comprehensive financial market data, trading execution, quotes, and portfolio analytics via the Longbridge CLI and OpenAPI platform.

## When to Use

Use this skill when:
- Retrieving real-time stock quotes, candlestick data (K-lines), market depth, or intraday price action.
- Inspecting financial statements, earnings reports, analyst consensus, valuation metrics, or insider transactions.
- Monitoring portfolio performance, asset balances, margin ratios, and account positions.
- Executing, modifying, or reviewing stock trades and historical orders.
- Querying regulatory filings, financial news, sentiment indices, and market discussions.

Detailed installation, authentication, and configuration steps are documented in [references/setup.md](references/setup.md).

---

## Market Coverage & Symbol Formats

Symbols follow the `<SYMBOL>.<MARKET>` format across all commands:

| Market | Suffix | Examples |
|---|---|---|
| United States (NYSE, NASDAQ, AMEX) | `.US` | `AAPL.US`, `TSLA.US`, `NVDA.US` |
| Hong Kong (HKEX) | `.HK` | `700.HK`, `9988.HK`, `0388.HK` |
| China Shanghai (SSE) | `.SH` | `600519.SH`, `601318.SH` |
| China Shenzhen (SZSE) | `.SZ` | `000001.SZ`, `300750.SZ` |
| Singapore (SGX; real-time quotes via desktop/app) | `.SG` | `D05.SG`, `Z74.SG` |
---

## Market Analysis & Data Retrieval Workflow

When analyzing a security or portfolio, follow this structured pattern:

1. **Verify Credentials & Tool Availability**:
   Check if `longbridge` CLI is installed and authenticated (`longbridge auth login`).
2. **Fetch Live Quotes & Price Dynamics**:
   Retrieve real-time quotes, intraday movements, and technical candlestick history.
3. **Inspect Fundamentals & Filings**:
   Examine latest earnings, financial statements, analyst targets, and SEC/HKEX regulatory filings.
4. **Synthesize Findings**:
   Correlate technical price trends with fundamental metrics, valuation ratios, and catalyst events.

### Core Market Commands

```bash
# Real-time quotes and market depth
longbridge quote SYMBOL.US
longbridge depth SYMBOL.US

# Historical candlestick (K-line) data
longbridge kline history SYMBOL.US --start 2026-01-01 --end 2026-05-01 --period day
longbridge intraday SYMBOL.US

# News, corporate filings, and sentiment (defaults to HK; specify US for US equities)
longbridge news SYMBOL.US
longbridge news search "AI revenue"
longbridge filing SYMBOL.US
longbridge market-temp US
```

---

## Fundamentals & Equity Research

Retrieve verified financial statements and valuation rankings directly:

```bash
# Financial statements (defaults to annual; pass --report qf for quarterly statements)
# Valid kinds: IS for Income Statement, BS for Balance Sheet, CF for Cash Flow Statement
longbridge financial-statement SYMBOL.US --kind IS
longbridge financial-statement SYMBOL.US --kind BS
longbridge financial-statement SYMBOL.US --kind CF
longbridge financial-statement SYMBOL.US --kind IS --report qf

# Summary KPI scorecard (Revenue, EPS, ROE; note: --latest is available for AP accounts)
longbridge financial-report SYMBOL.US --latest

# Analyst price targets and rating distributions (Buy/Hold/Sell)
longbridge institution-rating SYMBOL.US

# Analyst consensus KPI forecast metrics (EPS, Revenue estimates)
longbridge consensus SYMBOL.US

# Industry percentile valuation rankings (PE, PB, PS)
longbridge valuation-rank SYMBOL.US

# Institutional holdings (SEC Form 13F) & insider transactions (Form 4)
longbridge investors
longbridge investors <CIK>
longbridge insider-trades SYMBOL.US
```

---

## Portfolio & Account Management

Inspect account balances, purchasing power, and positions:

```bash
# Total assets, cash balances, buying power, margin status
longbridge assets

# Active positions (quantities and cost basis; query portfolio for unrealized P/L)
longbridge positions

# Portfolio allocation, performance, and risk distribution
longbridge portfolio
longbridge portfolio short-margin

# Transaction, dividend settlements, and cash activity history
longbridge cash-flow
longbridge deposits
longbridge withdrawals
```

---

## Order Execution & Trading

Execute trades with strict verification of parameters and limits:

```bash
# View today's orders and historical orders (specify start and end date for historical window)
longbridge order
longbridge order --history --start 2026-01-01 --end 2026-03-31

# Place market or limit orders (preview first, then execute with confirmation)
# 1. Preview order details (outputs estimated cost and execution code; LO default with --price)
longbridge order buy AAPL.US 100 --price 185.00
# 2. Submit order execution after explicit user confirmation with execution code
longbridge order buy AAPL.US 100 --price 185.00 --execute <EXECUTION_CODE>

# Cancel an active order (preview first, then execute with confirmation)
# 1. Preview cancellation (outputs confirmation code)
longbridge order cancel <ORDER_ID>
# 2. Confirm and execute cancellation using the confirmation code
longbridge order cancel <ORDER_ID> --execute <EXECUTION_CODE>
```

Always present the order/cancellation preview to the user and obtain explicit confirmation before running execution commands.
For additional command options, pass the `--help` flag to any command (`longbridge <subcommand> --help`).
