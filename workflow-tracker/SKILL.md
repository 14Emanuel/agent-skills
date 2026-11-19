---
name: workflow-tracker
description: Companion skill to track progress across the 7 canonical lifecycle phases (SPEC to PLAN to BUILD to TEST to REVIEW to SIMPLIFY to SHIP) using TodoWrite, markdown task lists, or environment plan tools. See references/lifecycle.md for phase details and catalog mappings.
---

# Workflow Tracker

Companion skill — activates alongside lifecycle skills to maintain a live progress tracker mapped to canonical workflow phases so the user and agent always see current status and upcoming steps.

## Tool Execution & Compatibility

This skill adapts dynamically to the tools available in the host agent runtime:

- **TodoWrite Environments (Claude Code, Antigravity)**:
  Use native `TodoWrite` items with status `in_progress`, `pending`, and `completed`.
- **Markdown Task Lists (Gemini, OpenCode, Codex)**:
  When native `TodoWrite` is unavailable, maintain a structured Markdown task list in message responses or tracking artifacts:
  - `- [/]` `in_progress` — active phase currently executing
  - `- [ ]` `pending` — upcoming phase awaiting entry gate
  - `- [x]` `completed` — finished phase whose exit gate passed
- **Plan Management Tools (Antigravity `manage_task`, `update_plan`)**:
  Synchronize lifecycle phases with active task list states.

## Activation

Invoke alongside any lifecycle task, slash command, or workflow transition:

| Command / Context | Phases to Initialize |
|-------------------|----------------------|
| `/spec` | SPEC → PLAN → BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/plan` | PLAN → BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/build` | BUILD → TEST → REVIEW → SIMPLIFY → SHIP |
| `/test` | TEST → REVIEW → SIMPLIFY → SHIP |
| `/review` | REVIEW → SIMPLIFY → SHIP |
| `/code-simplify` | SIMPLIFY → SHIP |
| `/ship` | SHIP |

The canonical phase list, entry/exit criteria, and skill mappings are defined in [references/lifecycle.md](references/lifecycle.md).

## Initialization

When a development task begins, initialize the tracker containing only the phases relevant to the invoked entry point:

**Example: `/review` invoked (TodoWrite format)**
```
[in_progress] REVIEW — code review passed
[pending]     SIMPLIFY — complexity reduced
[pending]     SHIP — branch merged / PR created
```

**Example: `/spec` invoked (Markdown fallback format)**
```markdown
- [/] SPEC — spec written and approved
- [ ] PLAN — plan written and approved
- [ ] BUILD — all tasks complete
- [ ] TEST — verification output shown and passing
- [ ] REVIEW — code review passed
- [ ] SIMPLIFY — complexity reduced
- [ ] SHIP — branch merged / PR created
```

If a formal plan with multiple discrete tasks exists, expand `BUILD` into granular task items:
```
[pending] BUILD — task 1: <task name from plan>
[pending] BUILD — task 2: <task name from plan>
```

## Phase Gates

| Phase | Entry Gate | Exit Gate |
|-------|------------|-----------|
| **SPEC** | Task described | Spec approved by user |
| **PLAN** | Spec approved | Plan approved by user |
| **BUILD** | Plan approved | All implementation tasks verified |
| **TEST** | Tasks complete | Verification output passing locally |
| **REVIEW** | Verification passing | Code review approved / GO decision |
| **SIMPLIFY** | Review GO | Simplification complete or explicitly skipped |
| **SHIP** | Simplify complete | Branch merged / PR created and verified |

## Real-Time Updates

Update tracker items in real time as phase gates are cleared — do not batch updates at the end of the session:
1. Mark current phase `completed` (`[x]`) immediately upon satisfying its exit gate.
2. Advance the next phase to `in_progress` (`[/]`) before initiating its workload.

## Phase Regression

Software development is iterative. When a phase gate fails (for example, a test failure during `TEST` requiring implementation changes in `BUILD`):
1. Set the target phase (e.g. `BUILD`) back to `in_progress`.
2. Do **not** create duplicate phase items — update the existing tracker item in place.
3. Once the regression fix satisfies the exit gate, mark it `completed` again and re-advance.

## Completion

The tracker reaches completion when the `SHIP` phase exit gate is satisfied and marked `completed`.
