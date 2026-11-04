# Adversarial Testing Patterns Reference Guide

Comprehensive pattern library for stress-testing web applications, forms, modals, navigation, and accessibility using Chrome DevTools MCP.

---

## 1. Form Validation & Edge Inputs

- **Empty Form Submission**: Submit forms without filling required fields. Verify field-level error messages display without JavaScript console errors or server 500 crashes.
- **Max Length & Long Input Overflow**: Paste 500+ character strings into text fields. Check for UI overflow or database truncation errors.
- **Special Characters & XSS**: Input `<script>alert(1)</script>`, `'' OR 1=1 --`, `&nbsp;`, and unicode emojis. Verify sanitize/escape logic.
- **Boundary File Uploads**: Upload oversized files (e.g. >5MB image), invalid file extensions (`.pdf` / `.exe` renamed as `.jpg`), or empty 0-byte files. Verify instant client-side validation and submit button disabling.

---

## 2. Interactive Controls & Modals

- **Rapid Double Clicks**: Click submit/action buttons twice in rapid succession. Verify handlers are debounced or buttons are disabled immediately to prevent duplicate form submissions or orders.
- **Modal Lockouts & Escape Key**: Open modals/dialogs, press `Escape`, or click backdrop. Verify modal closes gracefully and focus returns to triggering element.
- **Tab & Keyboard Navigation**: Use `press_key` (`Tab`, `Enter`, `Space`) to navigate interactively. Verify focus indicators are visible and focus is trapped inside active modals.

---

## 3. Responsive & Viewport Layout Sweeps

- **Desktop Viewport**: `1920 x 1080` — verify full dashboard layouts, data tables, and navigation header alignment.
- **Mobile Viewport**: `390 x 844` (iPhone 14) — verify hamburger navigation, form field wrapping, no horizontal scrollbars, and readable font sizing.

---

## 4. Deterministic Quality Assertions

- **Zero Console Errors**: `list_console_messages` must show 0 unhandled `TypeError`, `ReferenceError`, or missing asset 404s.
- **Successful HTTP Network Responses**: `list_network_requests` must verify status codes are `200`, `201`, or `302`.
