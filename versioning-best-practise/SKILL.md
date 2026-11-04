---
name: versioning best practise
description: Provides guidance on Semantic Versioning (SemVer) best practices and helps developers determine when to create patch, minor, or major tags for their project.
---

# Versioning Best Practices

When a user asks for advice on versioning or tagging their project, use this skill to guide them on Semantic Versioning (SemVer) and proper Git tagging workflows.

## SemVer Guidelines

Always explain the three components of a version tag (`v[Major].[Minor].[Patch]`):

1. **Patch Releases (`v1.0.1`, `v1.0.2`):**
   - **When:** Bug fixes, minor UI tweaks, typos, or performance improvements.
   - **Frequency:** High (every few days to weekly).

2. **Minor Releases (`v1.1.0`, `v1.2.0`):**
   - **When:** New features or significant enhancements that do not break backward compatibility.
   - **Frequency:** Medium (every 1 to 4 weeks, often at the end of a sprint).

3. **Major Releases (`v2.0.0`, `v3.0.0`):**
   - **When:** Massive architectural changes, major UI overhauls, or breaking changes.
   - **Frequency:** Low (every 6+ months or for huge milestones).

## Practical Workflow Advice
1. **Commit First:** Always remind the user that they must commit their changes *before* creating a tag, otherwise the tag will only point to the old commit.
2. **Tagging Commands:** Provide the specific Git commands to tag and push:
   - `git tag v1.X.X`
   - `git push origin v1.X.X` (or `git push --tags`)
3. **Consistency:** Encourage the user to tie their versioning to their deployments or weekly milestones rather than waiting months to do a massive version bump.
