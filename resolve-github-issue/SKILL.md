---
name: resolve-github-issue
description: Automates resolving GitHub issues. Reads issue context, checks out a branch, implements the code fix, and opens a PR that auto-closes the issue.
---

# Resolve GitHub Issue

This skill automates the end-to-end workflow of resolving a GitHub issue by writing the code and opening a linked pull request.

## When to use
Use this skill when the user asks to "resolve an issue", "fix issue #123", or provides a GitHub issue link and asks to implement a fix.

## Workflow Instructions

1. **Understand the Issue**
   - Gather context about the issue. Use MCP tools from `github-issues` (if available) or the standard `gh` CLI to read the issue title, body, and comments.
   - Example command: `gh issue view <issue_id> --json title,body,comments`

2. **Branching Strategy**
   - Checkout a new branch from `main` or the primary branch. Name it based on the issue number and a brief title.
   - Command: `git checkout -b fix/issue-<issue_id>-<short_description>`

3. **Implementation & Testing**
   - Formulate an implementation plan based on the issue requirements.
   - Modify the codebase to resolve the issue.
   - Make sure to test your changes using the project's build or test commands.
   - **Crucial**: Make isolated, atomic commits (e.g., following `atomic-committing` best practices).

4. **Pull Request Creation**
   - Push the branch to the remote repository: `git push -u origin <branch_name>`
   - Open a Pull Request using `gh pr create` or the appropriate MCP tool.
   - **Important**: The PR body MUST contain the exact text `Resolves #<issue_id>` or `Fixes #<issue_id>` so GitHub automatically links the PR to the issue and closes it upon merge.

5. **Initial Reviewer Comment**
   - Immediately after creating the PR, add a comment to the PR (using `gh pr comment <url> --body "..."` or MCP tools).
   - This comment MUST clearly explain the context of the issue, what the PR solves, and a summary of the technical approach so that the reviewer can easily understand the work.

6. **Final Review**
   - Provide the user with the link to the opened Pull Request.
   - Summarize what was changed and ask the user if they'd like to review it locally.
