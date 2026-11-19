---
name: coderabbit-pr-loop
description: Autonomous end-to-end GitHub Issue to Draft PR to CodeRabbit AI Review to Atomic Fix & Reply to Human Handoff loop. Integrates sort-issues, resolve-github-issue, sort-pr-changes, and atomic-committing skills with scripts/cr-loop.mjs.
---

# CodeRabbit PR Loop (`coderabbit-pr-loop`)

Autonomous multi-round workflow that resolves GitHub issues, opens a Draft PR targeting `dev`, waits in the background for `@coderabbitai` via `scripts/cr-loop.mjs`, iteratively triages and resolves CodeRabbit review threads using **strict single-file atomic commits**, and hands off a clean, verified PR to the human reviewer.

## Composed Skills (Mandatory Integration)

This skill orchestrates and strictly enforces your existing workflow skills at each phase:

| Phase | Integrated Skill(s) | How It Is Applied |
| :--- | :--- | :--- |
| **Phase 1: Issue Triage & Branching** | [`sort-issues`](../sort-issues/SKILL.md) + [`resolve-github-issue`](../resolve-github-issue/SKILL.md) | Inspect issue(s) via `gh issue view`, prioritize queue, checkout `fix/issue-<id>-<slug>` from `dev`, implement fix + tests, and post initial explanatory PR comment. |
| **Phase 2: All Git Commits (Round 1 & Round 2..N)** | [`atomic-committing`](../atomic-committing/SKILL.md) + [`commit-frequency-best-practise`](../commit-frequency-best-practise/SKILL.md) | **STRICT RULE: 1 File Per Commit.** Before committing any files, generate an **Atomic Commits Plan** table (`Step | Target File | Commit Message`) and commit each modified file in its own isolated `git add <file> && git commit -m "<type>(<scope>): <desc>"` step. |
| **Phase 3: CodeRabbit Feedback Triage & Resolution** | [`sort-pr-changes`](../sort-pr-changes/SKILL.md) | Classify every CodeRabbit review thread & nitpick using the **4-Tier Triage Matrix** (Tier 1: Actionable Fix, Tier 2: Nitpick, Tier 3: Clarification/False Positive, Tier 4: Out-of-Scope), track 7-character commit SHAs in `implementation_plan.md`, run local CI gate, reply to threads with exact commit SHAs, and generate plain-language `walkthrough.md`. |
| **Phase 4: Optional Deep Self-Audit** | [`review-pull-request`](../review-pull-request/SKILL.md) | Can be invoked when a standalone multi-dimension audit is requested prior to human handoff. |

---

## End-to-End Autonomous Loop

### Round 1 — Issue to Draft PR (`sort-issues` + `resolve-github-issue` + `atomic-committing`)

1. **Sync Base Branch (`dev`)**:
   ```bash
   git fetch origin
   git checkout -B dev origin/dev
   ```
2. **Inspect Issue (`sort-issues`)**:
   ```bash
   gh issue view <ISSUE_NUMBER> --json number,title,body,labels,assignees,comments
   ```
3. **Create Feature/Fix Branch**:
   ```bash
   git checkout -b fix/issue-<ISSUE_NUMBER>-<slug>
   ```
4. **Implement & Run Local CI Gate**:
   - Implement the code changes and unit tests.
   - Run local CI verification (zero errors allowed before committing/pushing):
     ```bash
     npm run format:check && npm run lint && npm run typecheck && npm run test:ci
     ```
5. **Present Atomic Commits Plan & Commit One File Per Commit (`atomic-committing`)**:
   - Output the **Atomic Commits Plan** table mapping each modified file to its conventional commit message.
   - Stage and commit **one file at a time**:
     ```bash
     git add <single_file_path>
     git commit -m "fix(<scope>): <concise description>"
     ```
6. **Push & Open Draft PR Against `dev` (`resolve-github-issue`)**:
   ```bash
   git push -u origin fix/issue-<ISSUE_NUMBER>-<slug>
   gh pr create --draft --base dev --title "fix(<scope>): <title>" --body "Resolves #<ISSUE_NUMBER>"
   ```
   - Immediately add the initial explanatory reviewer comment (`gh pr comment <PR_NUMBER> --body "..."`) summarizing the issue context and technical approach, and include `@coderabbitai review` if auto-review hasn't started.

---

### The "Webhook" Wait State (Background Polling via `cr-loop.mjs`)

Immediately after pushing Round 1 (or any subsequent fix round), launch the watcher in the background (`WaitMsBeforeAsync: 5000` so it moves to a background task and wakes the agent automatically upon exit):

```bash
node scripts/cr-loop.mjs wait --pr <PR_NUMBER> --sha $(git rev-parse HEAD) --since "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

- **Zero Token Waste**: Do NOT poll in a loop. Stop calling tools and let Antigravity's reactive wakeup resume execution when `cr-loop.mjs wait` finishes and prints the structured JSON snapshot.

---

### Round 2..N — Triage, Atomic Fixes & Thread Replies (`sort-pr-changes` + `atomic-committing`)

When `cr-loop.mjs wait` wakes the agent up with `waitStatus: "REVIEW_READY"`:

1. **Triage All Unresolved CodeRabbit Threads & Nitpicks (`sort-pr-changes` 4-Tier Matrix)**:
   - Inspect `threads` (where `awaitingReply: true`) and `embeddedNitpicks` from the JSON output.
   - Classify each item into the **4-Tier Triage Matrix** (`sort-pr-changes/references/subagent-delegation-and-triage.md`):
     - **Tier 1 (Actionable Code/Doc Fix)**: Add to `implementation_plan.md` checklist & assign an isolated single-file atomic commit.
     - **Tier 2 (Nitpick / Preference)**: Address in an isolated single-file atomic commit.
     - **Tier 3 (Clarification / Architectural Rationale / False Positive)**: Do not break project conventions; reply on the thread explaining the rationale (`@coderabbitai We intentionally use X here because...`).
     - **Tier 4 (Out-of-Scope Request)**: Log in plan and reply asking to defer to a follow-up issue/PR.

2. **Execute Fixes with Strict Single-File Atomic Commits (`atomic-committing`)**:
   - Update `implementation_plan.md` using the checklist format from `sort-pr-changes/references/atomic-tasklist-template.md`.
   - Present the **Atomic Commits Plan** table before committing.
   - Commit **one file per commit** (`git add <single_file> && git commit -m "fix(<scope>): ..."`).
   - Record each 7-character commit SHA in the checklist (`Commit SHA: a1b2c3d`).

3. **Run Local CI Verification Gate (`sort-pr-changes/references/local-ci-verification.md`)**:
   ```bash
   npm run format:check && npm run lint && npm run typecheck && npm run test:ci
   ```
   - Zero failing tests or lint errors permitted before pushing.

4. **Push & Reply to Every Thread via `cr-loop.mjs reply`**:
   - Push the atomic commits:
     ```bash
     git push origin <branch_name>
     ```
   - Reply to each CodeRabbit review thread citing the exact 7-character atomic commit SHA (and resolve fixed threads):
     ```bash
     node scripts/cr-loop.mjs reply --pr <PR_NUMBER> --thread <THREAD_NODE_ID> --body "@coderabbitai Addressed in atomic commit \`<7_CHAR_SHA>\`. Verified locally with clean test suite." --resolve
     ```
   - For Tier 3/4 rationale replies, omit `--resolve` so CodeRabbit can evaluate the explanation and resolve its own thread.

5. **Re-Enter Wait State**:
   - Run `node scripts/cr-loop.mjs wait --pr <PR_NUMBER> --sha $(git rev-parse HEAD)` in the background for the next verification round (up to 3 rounds max).

---

### Human Handoff & Walkthrough Artifact (`sort-pr-changes` + `cr-loop.mjs handoff`)

Once `converged: true` (`openThreadsAwaitingReply === 0` and CodeRabbit review on `HEAD` has no `CHANGES_REQUESTED`), or after 3 rounds max:

1. **Generate Plain-Language `walkthrough.md` Artifact (`sort-pr-changes`)**:
   - Follow `sort-pr-changes/references/local-ci-verification.md`:
     - **Plain-Language Review Summary** (what CodeRabbit requested, why it mattered, how we fixed it)
     - **Triage & Feedback Resolution Table** (`Item | Target File | Feedback Requested | Plain-English Solution | Commit SHA | Thread Status`)
     - **Local CI Verification Results**
     - **Remote Push Status & PR Link**
2. **Mark PR Ready & Request Human Review**:
   ```bash
   node scripts/cr-loop.mjs handoff --pr <PR_NUMBER> --reviewer 14Emanuel --ready
   ```
3. **Report Final Summary to User**:
   - Link the PR and `walkthrough.md` artifact (and flag any remaining contested thread if the 3-round cap was reached).
