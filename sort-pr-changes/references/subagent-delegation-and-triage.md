# Triage Matrix & Subagent Delegation Architecture

This reference outlines the triage classification matrix and rules for subagent dispatch.

## 1. Automated Feedback Triage Matrix

Every review item found after the last push must be assigned to a triage tier:

| Tier | Category | Description | Workflow Action |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Actionable Code/Doc Fix** | Direct change to code, schema, logic, or docs | Added to checklist & assigned atomic commit |
| **Tier 2** | **Nitpick / Preference** | Formatting, style, minor variable naming | Addressed in quick atomic commit |
| **Tier 3** | **Clarification / Rationale** | Reviewer asking "Why was X done this way?" | Reply via PR thread with explanation (no code edit) |
| **Tier 4** | **Out-of-Scope Request** | New feature request outside PR scope | Log in plan, reply asking to defer to new PR |

## 2. Parallel Subagent Delegation Strategy

For complex or multi-component PR changes:

1. **Master Agent Role**:
   - Maintains `implementation_plan.md` and master checklist.
   - Monitors subagent completions and tracks commit SHAs.
   - Executes local CI and production push.

2. **Subagent Invocation (`invoke_subagent`)**:
   - Dispatch `self` subagent per major isolated task component (e.g. backend serializer fix, UI validator update, doc update).
   - Prompt format:
     ```text
     "Fix issue in [filename] requested by @reviewer: [feedback]. Create single atomic commit `fix(<scope>): <message>`. Return commit SHA."
     ```

3. **Atomic Commit Aggregation**:
   - As subagents complete, master agent checks off checklist items and logs returned SHAs.
