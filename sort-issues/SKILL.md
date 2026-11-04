---
name: sort-issues
description: Autonomous issue resolver agent. Triages and resolves one or multiple GitHub issues (e.g. #24, #48, #47) using GitHub CLI and the /resolve-github-issue workflow under /goal autonomous execution.
---

# Sort Issues Agent (`sort-issues`)

Autonomous agent workflow to inspect, prioritize, and resolve targeted GitHub issues using the GitHub CLI (`gh`) and `/resolve-github-issue`.

## Key Directives
- **Autonomous Execution**: Runs under `/goal` mode until all targeted issues are addressed, verified with tests, and submitted as PRs.
- **Workflow Re-use**: Applies `/resolve-github-issue` procedures for each issue `'x'` (e.g. #24, #48, #47).
- **Atomic Commits**: Preserves clean git history with isolated commits per file modification.

## Workflow

### 1. Issue Inspection (`gh` CLI)
For each target issue number `'x'`:
- View issue metadata, requirements, and comments:
  ```powershell
  gh issue view <issue_number> --json number,title,body,labels,assignees,comments
  ```
- Establish priority order if multiple issues are specified (e.g., bug fixes or blocking dependencies first).

### 2. Systematic Resolution Loop
For each issue `'x'`:
1. **Branch Checkout**:
   ```powershell
   git checkout -b fix/issue-<issue_number>-<slug>
   ```
2. **Implementation & Tests**:
   - Apply code changes to satisfy the issue requirements.
   - Run local test suite and linter checks to ensure no regressions.
3. **Atomic Commits**:
   - Stage and commit changes atomically:
     ```powershell
     git commit -m "fix(<scope>): resolve issue #<issue_number> description"
     ```
4. **Push & Pull Request**:
   - Push branch to remote:
     ```powershell
     git push -u origin fix/issue-<issue_number>-<slug>
     ```
   - Create PR linking the issue:
     ```powershell
     gh pr create --title "fix: resolve issue #<issue_number>" --body "Resolves #<issue_number>"
     ```
   - Add initial explanatory comment on the PR explaining the fix.

### 3. Verification & Checklist Update
- Confirm PR creation and link.
- Track completed issues in a Markdown checklist.
- Return to base branch before resolving the next issue in the queue.
