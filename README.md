# Agent Skills Catalog

A centralized, curated repository of specialized AI agent skills compatible with Antigravity, Gemini, OpenCode, Claude Code, and Codex.

## Overview

This repository contains 43 production-ready agent skills organized into modular directories. Each skill includes a standardized `SKILL.md` specification file defining system capabilities, operational triggers, reference scripts, and structured workflows.

---

## Skills Directory

### 🚀 Agent & Coding Workflows
- **[`antigravity-2.0-koding-workflow`](antigravity-2.0-koding-workflow/SKILL.md)**: End-to-end coding workflow for Antigravity 2.0 with planning mode, atomic commits, background execution, and subagent orchestration.
- **[`atomic-committing`](atomic-committing/SKILL.md)**: Strict standards for isolated, single-file atomic commits.
- **[`caveman`](caveman/SKILL.md)**: Terse voice mode that strips fluff while preserving 100% technical accuracy.
- **[`create-skill`](create-skill/SKILL.md)**: Framework and guide for authoring high-performing agent skills.
- **[`find-skills`](find-skills/SKILL.md)**: Skill discovery and installation helper.
- **[`skill-creator`](skill-creator/SKILL.md)**: Template scaffolding and guideline enforcement for new skills.
- **[`commit-frequency-best-practise`](commit-frequency-best-practise/SKILL.md)**: Guidelines for committing frequently to maintain clean history and contribution momentum.
- **[`versioning-best-practise`](versioning-best-practise/SKILL.md)**: Semantic Versioning (SemVer) guide for tags and releases.
- **[`using-git-worktrees`](using-git-worktrees/SKILL.md)**: Isolated branch development using Git worktrees.
- **[`zone01-git-operations`](zone01-git-operations/SKILL.md)**: Git operations and credential handling for Zone01 Gitea repositories.

### 🎨 Frontend & Design Architecture
- **[`ui-ux-pro-max`](ui-ux-pro-max/SKILL.md)**: Comprehensive design intelligence library covering styles, palettes, typography, components, and UX rules.
- **[`frontend-design`](frontend-design/SKILL.md)**: Modern aesthetic web development standards and responsive design patterns.
- **[`design-taste-frontend`](design-taste-frontend/SKILL.md)**: Polished design taste and visual styling best practices.
- **[`tailwind-design-system`](tailwind-design-system/SKILL.md)**: Scalable Tailwind CSS design tokens and component architecture.
- **[`shadcn`](shadcn/SKILL.md)**: Patterns and implementation guidelines for shadcn/ui components.
- **[`web-design-guidelines`](web-design-guidelines/SKILL.md)**: Modern web design principles and accessibility standards.
- **[`deploy-to-vercel`](deploy-to-vercel/SKILL.md)**: Production deployment automation and configuration on Vercel.
- **[`vercel-composition-patterns`](vercel-composition-patterns/SKILL.md)**: Clean component composition patterns for React and Next.js applications.
- **[`vercel-react-best-practices`](vercel-react-best-practices/SKILL.md)**: Performance, caching, and layout optimizations for React on Vercel.

### 🐙 Git & GitHub Management
- **[`github-issues`](github-issues/SKILL.md)**: GitHub issue lifecycle management via CLI (create, triage, label, milestones, relations).
- **[`sort-issues`](sort-issues/SKILL.md)**: Systematically organize, prioritize, and structure GitHub issue backlogs.
- **[`resolve-github-issue`](resolve-github-issue/SKILL.md)**: Autonomous issue checkout, implementation, verification, and PR creation.
- **[`review-pull-request`](review-pull-request/SKILL.md)**: Progressive PR auditing, line-by-line review comments, and feedback loops.
- **[`sort-pr-changes`](sort-pr-changes/SKILL.md)**: Change inspection, atomic task breakdown, fixes, and PR thread resolution.
- **[`pr-dashboard`](pr-dashboard/SKILL.md)**: GitHub pull request dashboard inspection and status tracking.
- **[`copilot-pr-autopilot`](copilot-pr-autopilot/SKILL.md)**: Automated PR workflows and Copilot collaboration loops.
- **[`coderabbit-pr-loop`](coderabbit-pr-loop/SKILL.md)**: Autonomous GitHub Issue to Draft PR loop with CodeRabbit AI review, triage, atomic fixes, and human handoff.

### 🧪 QA & Browser Automation
- **[`ui-automated-testing`](ui-automated-testing/SKILL.md)**: End-to-end visual testing and QA with Chrome DevTools MCP and visual reports.
- **[`webapp-testing`](webapp-testing/SKILL.md)**: Playwright-powered automated verification, screenshot capture, and test execution.
- **[`playwright-automation-fill-in-form`](playwright-automation-fill-in-form/SKILL.md)**: Resilient automated form filling and validation with Playwright.
- **[`browser-use`](browser-use/SKILL.md)**: Web agent automation and browser interaction skills.
- **[`agent-browser`](agent-browser/SKILL.md)**: Autonomous web browsing, DOM parsing, and information extraction.

### ✍️ Content & Growth Marketing
- **[`content-strategy`](content-strategy/SKILL.md)**: Omnichannel developer content marketing strategy and content pillars.
- **[`content-marketing-strategist`](content-marketing-strategist/SKILL.md)**: Content ideation, audience positioning, and distribution roadmaps.
- **[`marketing-psychology`](marketing-psychology/SKILL.md)**: Behavioral psychology, persuasion frameworks, and copy conversion techniques.
- **[`linkedin-post-formatter`](linkedin-post-formatter/SKILL.md)**: Formats engineering topics into viral LinkedIn posts and carousels.
- **[`linkedin-post-writer`](linkedin-post-writer/SKILL.md)**: High-impact LinkedIn thought leadership copywriting for tech founders and engineers.
- **[`technical-blog-formatter`](technical-blog-formatter/SKILL.md)**: Structures long-form technical tutorials and deep dives.
- **[`technical-blog-writer`](technical-blog-writer/SKILL.md)**: End-to-end technical blog authoring with SEO, diagrams, and code snippets.
- **[`x-thread-formatter`](x-thread-formatter/SKILL.md)**: Converts topics into high-engagement X (Twitter) threads.
- **[`x-thread-writer`](x-thread-writer/SKILL.md)**: Punchy, hook-driven X thread copy for tech and AI releases.
- **[`blog-post`](blog-post/SKILL.md)**: Outlining and writing high-clarity developer blog articles.

### 📈 Finance & Trading
- **[`longbridge`](longbridge/SKILL.md)**: Live financial market data, trading, quotes, and portfolio analysis for US, HK, A-share, and Singapore markets via Longbridge CLI.

---

## Installation

### ⚡ One-Command Install (All Skills to All Agents)

Install all 43 skills from this catalog directly into your agent environment in one command:

```bash
# Install globally to all detected agents (Gemini, Claude Code, Cursor, OpenCode, etc.):
npx skills add 14Emanuel/agent-skills --all -g

# Or install into the current project scope:
npx skills add 14Emanuel/agent-skills --all
```

### 🎯 Selective Installation

```bash
# Browse skills interactively:
npx skills add 14Emanuel/agent-skills -g

# Install specific skills:
npx skills add 14Emanuel/agent-skills --skill ui-ux-pro-max frontend-design -g

# List all available skills in this catalog:
npx skills add 14Emanuel/agent-skills --list
```

### 📁 Manual Clone & Sync Fallback

```bash
# Clone to the default agents directory:
git clone https://github.com/14Emanuel/agent-skills.git ~/.agents/skills

# For Gemini / Antigravity CLI:
# Windows (PowerShell):
New-Item -ItemType SymbolicLink -Path "$HOME\.gemini\config\skills" -Target "$HOME\.agents\skills"
```

