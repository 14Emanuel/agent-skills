---
name: commit frequency best practise
description: Provides guidance on committing code frequently to maintain a healthy Git history and an active GitHub contribution graph.
---

# Commit Frequency Best Practices

When a user asks for advice on their commit workflow or mentions wanting a "green" GitHub contribution graph, use this skill to encourage frequent, smaller commits rather than massive weekly dumps.

## Core Guidelines

1. **Commit Often & Strictly Atomically (MANDATORY RULE):**
   - **MUST:** Adhere strictly to atomic commits where **no two files are committed in the same commit**. Each modified file must be committed individually in its own step.
   - **Why:** Isolated commits ensure pinpoint bug tracking, clean git bisect capability, clear review history, and safe reverts without collateral changes.
   - **When:** Create an Atomic Commits Plan step-by-step table prior to committing, mapping each file to its scope-specific conventional commit message.

2. **Descriptive Commit Messages:**
   - Standard format: `<type>(<scope>): <short description>`.
   - Explain *why* a change was made in the target file.
   - Example: `fix(coop): exclude file inputs from generic clearError in productAdd.js`.

3. **The "End of Day" Rule:**
   - Even if a feature isn't 100% complete, commit completed logical changes atomically to remote branches.

## How to Assist the User
- Strictly plan and commit files **one by one** (one file per commit).
- Present an **Atomic Commits Plan** table before committing.
- Write precise conventional commit messages matching each file's exact scope.
