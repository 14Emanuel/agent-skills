---
name: antigravity-2.0-koding-workflow
description: End-to-end coding workflow for Antigravity 2.0, emphasizing agentic orchestration, planning mode, atomic commits, background task execution, and subagent delegation across all workspaces.
---

# Antigravity 2.0 Koding Workflow

This skill outlines the standard operating workflow for software development in Antigravity 2.0 across all projects and workspaces.

> [!IMPORTANT]
> **Core Principle**: Antigravity 2.0 relies on proactive planning, strict atomic committing, autonomous background execution, dynamic subagent delegation, and continuous runtime verification.

---

## 1. Request Triage & Planning Mode

- **Investigatory / Minor Requests:** Proceed directly with targeted lookups and edits.
- **Complex / Architectural Requests:** Switch to Planning Mode before making changes:
  1. **Research & Audit:** Inspect code structures, dependencies, and configuration. Do NOT guess file paths, schemas, or function signatures.
  2. **Implementation Plan:** Create/update `implementation_plan.md` in the conversation artifact directory.
  3. **User Approval:** Present plan and wait for user sign-off before modifying source files.

---

## 2. Multi-Agent & Task Execution Strategy

- **Subagent Delegation (`invoke_subagent`):**
  - Delegate long-running, research-heavy, or isolated domain tasks to specialized subagents (e.g., `research`, `self`, or custom defined subagents).
  - Do NOT poll subagent status in a loop; wait for reactive notifications.
- **Background Commands (`run_command`):**
  - Launch dev servers, build tasks, and tests as background commands.
  - Inform the user and continue work or stop tool calls—the system will reactively wake up on completion or log events.
- **Artifact Management:**
  - Save reports, walkthroughs, diagrams, and execution plans in the conversation artifact directory.

---

## 3. Strict Code Modification & Debugging Rules

- **Zero Guesses:** Always view source files (`view_file`, `grep_search`) before consuming APIs or editing functions.
- **Log-Driven Diagnosis:** Fetch full un-truncated stack traces (`view_file` on log paths) before forming diagnostic hypotheses. Never mask symptoms or swallow exceptions.
- **Strict Control Flow & Scoping:** Ensure modifications handle all conditional paths cleanly without breaking existing public API contracts.

---

## 4. Atomic Committing Standard (MANDATORY)

> [!CAUTION]
> **NEVER** commit multiple files together in a single `git commit`.

1. **Pre-Commit Plan:** Before running Git commands, create a step-by-step **Atomic Commits Plan** table mapping each target file to its scope-specific commit message.
2. **File Isolation:** Stage and commit each file individually (`git add <file>` + `git commit -m "..."`).
3. **Conventional Commit Format:**
   - Format: `<type>(<scope>): <description>`
   - Example sequence:
     ```markdown
     | Step | Target File | Commit Message |
     | 1 | `src/api/auth.js` | `fix(auth): sanitize user input in token refresh` |
     | 2 | `src/components/Login.jsx` | `fix(auth): update button state on login failure` |
     ```

---

## 5. Verification & Walkthrough

- **Automated Verification:** Run unit tests, linting, or build checks to verify code correctness before declaring completion.
- **Walkthrough Artifact:** Create or update `walkthrough.md` summarizing changed files, test results, and visual/functional verification.
