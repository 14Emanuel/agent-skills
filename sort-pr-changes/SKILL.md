---
name: sort-pr-changes
description: Automates inspecting GitHub PRs for newly requested changes after the last push, creating implementation plans and atomic tasklists, executing fixes with atomic commits, running local CI, resolving PR threads, pushing to production, and generating plain-language walkthroughs.
---

# Sort PR Changes (`sort-pr-changes`)

Automated workflow for identifying post-push PR review changes via GitHub CLI, planning atomic fixes, running local CI, resolving review threads, pushing verified changes, and producing a plain-language walkthrough artifact.

## Core Workflow Steps

1. **Conflict & Sync Audit**
   - Fetch remote changes (`git fetch origin`) and verify mergeability against the target branch (`main`/`dev`).
   - Rebase or resolve base branch conflicts before starting PR fixes.

2. **Post-Push Review Change Inspection (`gh pr` & `gh api`)**
   - Retrieve latest commit/push timestamp:
     `gh pr view <PR_NUMBER> --json commits --jq '.commits[-1].committedDate'`
   - Extract review comments and feedback submitted *after* the last push timestamp.

3. **Automated Triage Matrix**
   - Classify feedback into 4 tiers:
     - **Tier 1: Actionable Code/Doc Fixes** (Added to task checklist)
     - **Tier 2: Nitpicks / Refactors** (Addressed inline)
     - **Tier 3: Clarifications / Questions** (Answered via PR thread)
     - **Tier 4: Out-of-Scope Requests** (Logged & deferred)

4. **Implementation Plan & Checklist Creation**
   - Generate `implementation_plan.md` with structured tasks, target files, and reviewer tags.
   - Attach `/atomic-committing` rules (1 file modification = 1 isolated commit).

5. **Atomic Task Execution & Subagent Delegation**
   - For simple tasks: Execute directly with atomic commits (`git commit -m "fix(<scope>): <msg>"`).
   - For complex tasks: Dispatch parallel `self` subagents while tracking progress on the master checklist.
   - Iteratively check off tasks and log 7-character commit SHAs in the tasklist.

6. **Local CI Verification Gate (`dam-local-ci`)**
   - Run complete local test suite (`pytest`, `manage.py test`, `flake8`, `isort`, `bandit`).
   - Stop and resolve any failures locally. Zero failing tests allowed before pushing.

7. **Production Push & Thread Resolution**
   - Push verified atomic commits to remote/production branch:
     `git push origin <branch_name>`
   - Reply to and resolve inline PR review threads via `gh api` citing exact commit SHAs.

8. **Plain-Language Walkthrough Artifact**
   - Generate `walkthrough.md` summarizing what the reviewers requested in clear, human-understandable terms, followed by the commit resolution table, test results, and push status.

## Recommended Tools & Slash Commands

- Recommend `/goal` when initiating multi-task PR resolution for autonomous end-to-end completion.
- Reference `atomic-committing` skill for commit standards.

## Detailed References

- `references/pr-inspection-workflow.md`: GH CLI queries, thread resolution, and comment replies.
- `references/atomic-tasklist-template.md`: Checklist format & atomic commit SHA logging.
- `references/local-ci-verification.md`: CI commands, push protocol, and plain-language walkthrough layout.
- `references/subagent-delegation-and-triage.md`: Triage matrix & parallel subagent dispatch guidelines.
