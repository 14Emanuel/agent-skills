---
name: ui-automated-testing
description: Mandatory rule: Use /goal for comprehensive, long-running UI automated testing. Automates UI testing, adversarial QA, and visual verification using Chrome DevTools MCP with diff-driven testing, 3-round QA planning, form edge cases, console/network audits, failure screenshots, carousels, and HTML reports.
---

# UI Automated Testing & Adversarial Visual Verification

Automate comprehensive browser UI testing—from simple happy-path checks to complex adversarial QA workflows—using Chrome DevTools MCP.

Your primary objective is **adversarial verification**: try to catch edge cases, console errors, layout breaks, and uncaught exceptions, rather than just confirming basic page loads.

> [!IMPORTANT]
> **Mandatory Rule: `/goal` Slash Command for Comprehensive & Long-Running UI Testing**
> For comprehensive, complex, or long-running UI automated testing, using the `/goal` slash command is a mandatory rule. The `/goal` command ensures UI automated testing execution continues uninterrupted for as long as needed until all 3-round QA test objectives, adversarial scenarios, and visual assertions are completely satisfied.

---

## Mandatory Execution Rule: `/goal` Slash Command

When undertaking comprehensive, multi-round, or complex UI automated testing suites:
- **Mandatory Requirement**: Invoking or recommending the `/goal` slash command is a mandatory rule for comprehensive, complex, or long-running UI testing tasks.
- **Uninterrupted Persistence**: The `/goal` mode ensures that UI automated testing continues relentlessly for as long as needed until all 3-round QA test objectives, adversarial scenarios, and visual assertions are completely satisfied.
- **Completion Criteria**: Execution under `/goal` must not conclude until all test cases pass, console/network logs are audited clean, and visual proof artifacts are generated.

---

## Key Capabilities & Tools

- **Page Navigation & Emulation**: `navigate_page`, `resize_page`, `emulate`
- **Form Automation & File Upload**: `fill`, `fill_form`, `click`, `press_key`, `upload_file`
- **Console & Network Inspection**: `list_console_messages`, `list_network_requests`
- **Visual & DOM Snapshots**: `take_screenshot`, `take_snapshot`

---

## Core Testing Workflows

Select the workflow that matches the task scope:

### Workflow A: Diff-Driven QA (For PRs & Feature Edits)
1. **Analyze Diff**: Run `git diff --name-only` (or `git diff main...HEAD`).
2. **Map Impacted UI**: Map changed templates, components, JS scripts, or routes to target web URLs.
3. **Plan 3-Round Matrix**: Generate functional, adversarial, and coverage gap tests.
4. **Execute & Assert**: Perform actions using Chrome DevTools MCP, auditing console and network logs at every step.

### Workflow B: Feature / Story QA (Targeted Flow Testing)
1. **Define Flow**: Identify primary user goals and edge interaction paths.
2. **Execute Interactive Steps**: Fill forms, trigger modals, upload files, navigate states.
3. **Audit & Capture**: Verify console/network logs, capture before/after screenshots.

### Workflow C: Exploratory Adversarial QA (Finding Unexpected Bugs)
1. **Roam App Routes**: Visit primary navigation hubs and detail views.
2. **Apply Stress Testing**: Submit empty forms, double-click action buttons, enter long strings, test mobile viewports (`390 x 844`).
3. **Audit Exceptions**: Log any unhandled JS errors or failed API requests (`4xx`/`5xx`).

---

## 3-Round QA Planning Methodology

Before executing complex UI tests, construct a 3-round testing strategy:

1. **Round 1 — Functional (Happy Path)**: What are the core user flows? (Action → Expected Outcome).
2. **Round 2 — Adversarial (Edge Cases)**: Form validation errors, empty inputs, duplicate clicks, rapid submissions, boundary inputs (>5MB file uploads, special characters, max string lengths).
3. **Round 3 — Coverage Gaps**: Keyboard-only accessibility, mobile viewports (`390 x 844`), JavaScript console exceptions, network failures, empty data states.

Merge these into a single numbered test checklist prior to browser execution.

---

## Standard Automated Verification Protocol

### Step 1: Dev Server Verification
Ensure local development server is running (e.g. Django `http://127.0.0.1:8000`, Vite/Next.js `http://localhost:5173`, Node `3000`). Launch if necessary using non-blocking background commands.

### Step 2: Snapshot Strategy (Before vs. After)
- **Fix In Progress**: If reproducing an active bug prior to making code edits, capture a **Before-Fix** screenshot (`take_screenshot`) and save to `<appDataDir>\brain\<conversation-id>/before_fix_<scenario>.png`.
- **Already Fixed / Verified State**: If the bug is already resolved or testing a completed feature, proceed directly to capturing the verified state.

### Step 3: Execution & Assertion Loop
For each test step:
1. **Navigate**: Open the route via `navigate_page`.
2. **Interact**: Execute UI actions using `fill_form`, `fill`, `click`, `press_key`, or `upload_file`.
3. **Console Audit**: Call `list_console_messages`. Assert **zero unhandled JavaScript console exceptions** (`type: "error"`).
4. **Network Audit**: Call `list_network_requests`. Verify API/form requests return valid HTTP status codes (`200 OK`, `201 Created`, `302 Found`).
5. **Emit Step Markers**:
   - `STEP_PASS|<step_id>|<evidence>` (e.g., status message rendered, redirect completed).
   - `STEP_FAIL|<step_id>|<expected → actual>|<screenshot_path>` (capture screenshot immediately on failure).

### Step 4: Visual Evidence & Artifact Integration
Generate or update `walkthrough.md` and HTML test reports with visual proof.

#### 1. Walkthrough Artifact (`walkthrough.md`)
For Before vs. After comparisons, use GFM carousels with absolute `file:///` links:
```carousel
![Before Fix - Issue State](file:///C:/path/to/before_fix_scenario.png)
<!-- slide -->
![After Fix - Resolved State](file:///C:/path/to/after_fix_scenario.png)
```

For Single Verified State:
```markdown
![Verified UI State](file:///C:/path/to/after_fix_scenario.png)
```

#### 2. Standalone HTML QA Report (Optional / Full QA Runs)
Save standalone HTML reports to `<appDataDir>\brain\<conversation-id>/ui-test-report.html` embedding screenshots as base64 data URIs so reviewers can view test results offline.

---

## Detailed Reference Guides

- **Chrome DevTools MCP Tool Usage**: [`references/browser-devtools-guide.md`](file:///C:/Users/emm14/.gemini/config/skills/ui-automated-testing/references/browser-devtools-guide.md)
- **Adversarial Testing Patterns**: [`references/adversarial-patterns.md`](file:///C:/Users/emm14/.gemini/config/skills/ui-automated-testing/references/adversarial-patterns.md)
