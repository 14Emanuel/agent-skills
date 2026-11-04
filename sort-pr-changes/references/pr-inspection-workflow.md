# PR Inspection & Thread Resolution Workflow

Detailed GitHub CLI commands for base branch sync, post-push change extraction, comment replies, and thread resolution.

## 1. Base Branch Sync & Merge Conflict Audit

Before reading feedback, verify branch sync with target (`main`/`dev`):
```bash
git fetch origin
git log HEAD..origin/main --oneline
```
If conflicts exist, rebase or merge target branch locally first.

## 2. Extracting Post-Push Review Comments

### Fetch Latest Commit Timestamp
```bash
gh pr view <PR_NUMBER> --json commits --jq '.commits[-1].committedDate'
```

### Fetch Inline Comments After Last Push
```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --jq '.[] | select(.created_at > "<LAST_PUSH_TIMESTAMP>") | {id: .id, path: .path, line: .line, body: .body, user: .user.login, in_reply_to_id: .in_reply_to_id}'
```

### Fetch Review Decision & Body
```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews --jq '.[] | select(.submitted_at > "<LAST_PUSH_TIMESTAMP>") | {id: .id, state: .state, body: .body, user: .user.login}'
```

## 3. Replying & Resolving Review Threads via GH CLI

### Reply to Inline Comment
```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies -f body="Addressed in atomic commit `SHA_HERE`. Verified locally with clean test suite."
```

### Resolve Review Thread (GraphQL API)
```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: {threadId: "THREAD_NODE_ID"}) {
    thread { isResolved }
  }
}'
```

## 4. Production Push Protocol

Once local CI passes with zero errors:
```bash
git push origin <branch_name>
```
