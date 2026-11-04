# Local CI Verification, Production Push & Walkthrough Delivery

Protocol for verifying code quality locally, pushing clean commits to production, and delivering a clear, plain-language walkthrough artifact.

## 1. Local CI Verification Protocol

Run all local linters, security audits, and unit test suites before pushing:

```bash
# 1. Code Style & Formatting
flake8 .
isort --check-only .
black --check .

# 2. Security Audit
bandit -r .

# 3. Unit & Integration Tests
python manage.py test
# or
pytest
```

**Rule**: Zero failures permitted. If any test fails, resolve locally and create fix commit before proceeding.

## 2. Production Push Protocol

Once local CI passes 100%:

```bash
git push origin <branch_name>
```

Verify push succeeded:
```bash
gh pr view <PR_NUMBER> --json statusCheckRollup,url
```

## 3. Walkthrough Artifact Requirements (Plain-Language Summary Mandate)

Create `walkthrough.md` in the brain artifacts directory. The walkthrough MUST begin with a clear, plain-language breakdown explaining what the PR reviewers asked for and how the changes resolve their feedback.

```markdown
# Walkthrough: PR #[PR_NUMBER] Post-Push Review Fixes

## 🗣️ Plain-Language Review Summary
*Provide a clear, human-understandable explanation of the feedback received after the last push:*
- **What was requested?** (Explain the reviewer's feedback in simple terms, e.g., "The reviewer requested that we fix a translation error in the Swahili registration form message and expand our test plan to cover Somali and Turkana languages.")
- **Why it mattered**: (Brief rationale, e.g., "This prevents users from seeing incorrect language strings during signup.")
- **How we fixed it**: (Summary of the solution implemented.)

## 📋 Triage & Feedback Resolution Table
| Item | Target File | Feedback Requested | Plain-English Solution | Commit SHA | Thread Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `django.po` | Swahili error message typo | Updated string to "Kitambulisho cha taifa lazima kiwe na tarakimu 7-10." | `a1b2c3d` | Resolved |

## 🧪 Local CI Verification Results
- **Linters**: Passed (Flake8 / Black / Isort)
- **Security Audit**: Passed (Bandit)
- **Unit Tests**: Passed (XX tests executed, 0 failures)

## 🚀 Remote Production Push Status
- **Branch**: `origin/<branch_name>`
- **Push Status**: Success (Clean HEAD)
- **PR Link**: [PR #[PR_NUMBER]](url)
```
