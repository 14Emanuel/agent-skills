# Atomic Tasklist & Implementation Plan Template

Use this structure when creating `implementation_plan.md` and tracking task execution for PR changes.

## Tasklist Checklist Format

Every task must map to a specific file modification and track its isolated atomic commit SHA.

```markdown
### PR #[PR_NUMBER] Fix Checklist

- [ ] **Task 1**: Update `[filename]](file:///path/to/filename)` to resolve [feedback summary]
  - **Target File**: `path/to/file`
  - **Reviewer**: @username
  - **Commit SHA**: `pending`

- [ ] **Task 2**: Fix `[filename2]](file:///path/to/filename2)` for [feedback summary]
  - **Target File**: `path/to/file2`
  - **Reviewer**: @username
  - **Commit SHA**: `pending`
```

## Atomic Commit Enforcer Rules

1. **One File Per Commit**: Never stage or commit multiple files together unless strictly coupled (e.g. `views.py` and its direct test).
2. **Clear Commit Message**:
   - `fix(<component>): short description of fix`
   - Example: `fix(auth): update Swahili translation for ID validator`
3. **Iterative Update**: As soon as a commit is created:
   - Check off the task `[x]`
   - Fill in the 7-character commit SHA in the checklist item.

## Iterative Tasklist Update Pattern

Example after Task 1 completion:
```markdown
- [x] **Task 1**: Update `[django.po](file:///locale/sw/LC_MESSAGES/django.po)` to fix Swahili ID validation message
  - **Target File**: `locale/sw/LC_MESSAGES/django.po`
  - **Reviewer**: @AlpherOmondi
  - **Commit SHA**: `a1b2c3d`
```
