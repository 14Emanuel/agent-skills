# Development Lifecycle

This document serves as the single source of truth for canonical phase definitions, per-command phase sets, and catalog skill mappings across development workflows in `14Emanuel/agent-skills`.

## Canonical Phases

The 7 lifecycle phases provide a standardized progression from initial concept to verified production delivery:

| # | Phase | Command / Trigger | Scope & Deliverable |
|---|-------|-------------------|---------------------|
| 1 | **SPEC** | `/spec` | Define requirements, user problem, constraints, and acceptance criteria. |
| 2 | **PLAN** | `/plan` | Deconstruct specifications into ordered, verifiable atomic tasks. |
| 3 | **BUILD** | `/build` | Incrementally implement features and fixes using atomic commits. |
| 4 | **TEST** | `/test` | Execute automated test suites, browser verification, and validation gates. |
| 5 | **REVIEW** | `/review` | Perform quality audits, code review triage, and security/performance checks. |
| 6 | **SIMPLIFY** | `/code-simplify` | Streamline code, remove extraneous complexity, and ensure readability. |
| 7 | **SHIP** | `/ship` | Finalize commits, push branches, open PRs, verify CI, and deploy safely. |

## Per-Command Phase Sets

When initiating work from a specific phase or slash command, initialize only the phases from that entry point forward:

| Command Invoked | Active Phase Sequence |
|-----------------|-----------------------|
| `/spec` | SPEC → PLAN → BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/plan` | PLAN → BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/build` | BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/test` | TEST → REVIEW → SIMPLIFY → SHIP |
| `/review` | REVIEW → SIMPLIFY → SHIP |
| `/code-simplify` | SIMPLIFY → SHIP |
| `/ship` | SHIP |

## Phase Regression Handling

Workflows are non-linear when defects or unexpected edge cases arise. When a verification step fails (e.g. `TEST` fails and requires modifications to `BUILD`):
- Reopen the affected phase by setting its status back to `in_progress`.
- Update the existing phase item in-place without generating redundant or duplicate entries.
- Re-run phase exit gate verification before advancing forward again.

## Catalog Skill Mapping

Each phase is supported by specialized skills available in the `14Emanuel/agent-skills` catalog:

| Phase | Catalog Skills in `14Emanuel/agent-skills` | Primary Role & Capability |
|-------|--------------------------------------------|---------------------------|
| **SPEC** | [`resolve-github-issue`](../../resolve-github-issue/SKILL.md)<br>[`github-issues`](../../github-issues/SKILL.md)<br>[`sort-issues`](../../sort-issues/SKILL.md)<br>[`antigravity-2.0-koding-workflow`](../../antigravity-2.0-koding-workflow/SKILL.md) | Problem analysis, issue scoping, requirements extraction, and planning mode initiation. |
| **PLAN** | [`antigravity-2.0-koding-workflow`](../../antigravity-2.0-koding-workflow/SKILL.md)<br>[`sort-issues`](../../sort-issues/SKILL.md)<br>[`create-skill`](../../create-skill/SKILL.md) | Structured implementation plans, architectural partitioning, and task sequencing. |
| **BUILD** | [`atomic-committing`](../../atomic-committing/SKILL.md)<br>[`ui-ux-pro-max`](../../ui-ux-pro-max/SKILL.md)<br>[`frontend-design`](../../frontend-design/SKILL.md)<br>[`shadcn`](../../shadcn/SKILL.md)<br>[`tailwind-design-system`](../../tailwind-design-system/SKILL.md)<br>[`vercel-composition-patterns`](../../vercel-composition-patterns/SKILL.md)<br>[`vercel-react-best-practices`](../../vercel-react-best-practices/SKILL.md) | Single-file atomic implementation, modern UI/UX design systems, component patterns, and resilient coding. |
| **TEST** | [`ui-automated-testing`](../../ui-automated-testing/SKILL.md)<br>[`webapp-testing`](../../webapp-testing/SKILL.md)<br>[`agent-browser`](../../agent-browser/SKILL.md)<br>[`browser-use`](../../browser-use/SKILL.md)<br>[`playwright-automation-fill-in-form`](../../playwright-automation-fill-in-form/SKILL.md) | E2E browser automation, visual testing, regression test execution, and contract validation. |
| **REVIEW** | [`review-pull-request`](../../review-pull-request/SKILL.md)<br>[`coderabbit-pr-loop`](../../coderabbit-pr-loop/SKILL.md)<br>[`sort-pr-changes`](../../sort-pr-changes/SKILL.md)<br>[`pr-dashboard`](../../pr-dashboard/SKILL.md)<br>[`copilot-pr-autopilot`](../../copilot-pr-autopilot/SKILL.md) | Automated review triage (4-tier matrix), PR inspection, AI review loops, and quality gates. |
| **SIMPLIFY** | [`caveman`](../../caveman/SKILL.md)<br>[`sort-pr-changes`](../../sort-pr-changes/SKILL.md)<br>[`vercel-composition-patterns`](../../vercel-composition-patterns/SKILL.md) | Eliminating unnecessary complexity, refactoring component hierarchies, and concise phrasing. |
| **SHIP** | [`commit-frequency-best-practise`](../../commit-frequency-best-practise/SKILL.md)<br>[`versioning-best-practise`](../../versioning-best-practise/SKILL.md)<br>[`deploy-to-vercel`](../../deploy-to-vercel/SKILL.md)<br>[`using-git-worktrees`](../../using-git-worktrees/SKILL.md)<br>[`zone01-git-operations`](../../zone01-git-operations/SKILL.md) | Git release management, SemVer tagging, deployment pipelines, isolated worktrees, and repository handoff. |
