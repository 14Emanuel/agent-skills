---
name: atomic-committing
description: Mandatory rule and standards for atomic commits where no two files are committed in the same commit. Every file modification must have its own isolated commit.
---

# Atomic Committing Standards (MANDATORY RULE)

> [!IMPORTANT]
> **STRICT RULE**: You MUST adhere strictly to atomic commit standards where **NO TWO FILES ARE COMMITTED IN THE SAME COMMIT**. Each individual changed file MUST be committed separately in its own commit step.

## Core Rules & Requirements

1. **One File Per Commit (Strict Isolation):**
   - **MUST:** Never stage or commit multiple files together in a single `git commit`.
   - **MUST:** Stage (`git add <single_file>`) and commit (`git commit -m "..."`) each file individually.

2. **Atomic Commits Plan (Pre-Execution Requirement):**
   - Before executing any commits, generate and present an explicit step-by-step Atomic Commits Plan table mapping each target file to its specific conventional commit message.

3. **Conventional Commit Format:**
   - Standard format: `<type>(<scope>): <short description>`
   - Types: `fix`, `feat`, `refactor`, `docs`, `style`, `test`, `chore`.
   - Scope: Module or area affected (e.g. `coop`, `farmer`, `auth`, `api`).

---

## Example Atomic Commits Plan

To adhere strictly to atomic commit standards where no two files are committed in the same commit, the execution will follow this exact commit sequence on branch `bugfix/image-upload-compression`:

| Step | Target File | Commit Message |
| --- | --- | --- |
| 1 | `theme/static/js/coop/productAdd.js` | `fix(coop): exclude file inputs from generic clearError in productAdd.js` |
| 2 | `coop/templates/coop/product_add.html` | `fix(coop): disable and dim submit button on oversized image upload in product add` |
| 3 | `coop/templates/coop/product_edit.html` | `fix(coop): standardize submit button disabling and image validation in product edit` |
| 4 | `farmer/templates/farmer/product_form.html` | `fix(farmer): align submit button disabled styling with pointer-events-none` |
| 5 | `farmer/templates/farmer/profile.html` | `fix(farmer): add client-side 5MB validation and button disabling to profile photo upload` |
