---
name: technical-blog-formatter
description: Transforms a day's content marketing topic into a well-structured technical article or blog post for Yaya AI. Use this after the daily content strategy has been drafted to produce a long-form, SEO-optimized blog post suitable for Medium, Dev.to, Hashnode, or the Yaya AI website blog.
---

# Technical Blog Formatter — Yaya AI

This skill takes the day's content marketing topic and transforms it into a polished, SEO-optimized technical article or blog post. These posts build authority, drive organic traffic, and position Yaya AI as thought leaders in the AI + job-search space.

## When to Use This Skill

Use this skill after the daily content topic has been determined. It produces a publication-ready blog post (~800–1500 words) with proper structure, SEO metadata, and internal linking opportunities.

## Blog Post Formatting Rules

### Target Publications
- **Yaya AI Blog** (primary)
- **Medium** (with appropriate publication tagging)
- **Dev.to** (for technical deep-dive days)
- **Hashnode** (for developer audience)

### Article Structure

Every article must follow this structure:

```
1. SEO Metadata Block
2. Title (H1)
3. Subtitle / Deck
4. Introduction (Hook + Problem Statement)
5. Section 1 (H2)
6. Section 2 (H2)
7. Section 3 (H2) — optional, for deeper topics
8. The Yaya AI Solution (H2)
9. Conclusion + CTA
10. Author Bio blurb (optional)
```

### SEO Metadata Rules
Every post needs:
- **Title tag**: 50–60 characters, include primary keyword
- **Meta description**: 150–160 characters, include primary keyword + CTA
- **Primary keyword**: 1 main keyword (e.g., "AI resume tailoring", "job search automation")
- **Secondary keywords**: 2–3 related terms woven naturally into the text
- **Slug**: Short, hyphenated, keyword-first (e.g., `ai-resume-tailoring-yaya`)
- **Target word count**: 800–1500 words

### Writing Style Rules
- **Voice:** Authoritative but accessible. Like an expert writing for a smart non-expert.
- **Sentences:** Mix short punchy sentences with longer analytical ones. Aim for Flesch Reading Ease > 60.
- **Paragraphs:** Max 3–4 sentences. Single-sentence paragraphs are fine for emphasis.
- **Headers (H2, H3):** Use descriptive, benefit-driven headers — not generic ("Introduction", "Conclusion"). Good: "Why ATS Systems Are Secretly Hurting Your Job Search"
- **Bold text:** Use for key terms and stats only. Not decorative.
- **Code blocks:** Use for any technical content (API examples, JSON structures, etc.)
- **Internal links:** Note 2–3 places where other Yaya AI blog posts or features could be linked.
- **External links:** 1–2 credible external sources to boost SEO authority (LinkedIn, Forbes, academic research).

### Introduction Formula
The intro must do three things in order:
1. **Hook** — A surprising stat, bold claim, or relatable scenario (2–3 sentences)
2. **Problem** — Articulate the pain precisely (2–3 sentences)
3. **Promise** — What the reader will get from this article (1 sentence)

### Conclusion + CTA Formula
- Summarize the 3 key takeaways in a bullet list
- ONE clear CTA: "Try Yaya AI's Sandbox Mode free — no account needed. [Link]"
- Optional: Tease the next article in the series

### Technical Depth Levels
Adjust depth based on the day's topic:

| Day Theme | Depth Level | Focus |
|---|---|---|
| Technical Deep Dive | High | Architecture, APIs, how it works under the hood |
| HR / Market Shift | Medium | Industry data, trends, expert quotes |
| Usability / Results | Medium | Data, screenshots, user journey |
| Candidate Experience | Low-Medium | Empathetic storytelling + light data |
| Feature Spotlight | High | Step-by-step tutorial with screenshots |
| Industry Integration | Medium | Workflow diagrams, tool comparisons |
| Community / CTA | Low | Story-driven, emotional, accessible |

## How to Execute This Skill

### Step 1: Read the Day's Content
Read the current day's content file from:
`C:\Users\emm14\.gemini\antigravity\brain\de19a8e1-e7ed-4139-b660-bd7e0f7c8339\`

### Step 2: Determine Depth Level
Match the topic to the depth level table above.

### Step 3: Research Keywords
Identify the primary keyword and 2–3 secondary keywords based on the topic. Think: what would a frustrated job seeker Google that this article answers?

### Step 4: Draft the Article
Write the full article following the structure and style rules.

### Step 5: Output in This Format

```markdown
<!-- SEO METADATA -->
Title Tag: [50-60 chars]
Meta Description: [150-160 chars]
Primary Keyword: [keyword]
Secondary Keywords: [kw1], [kw2], [kw3]
Slug: /blog/[slug]
Word Count Target: [800–1500]
Publication: [Yaya AI Blog / Medium / Dev.to]

---

# [Article Title — H1]

**[Subtitle / Deck — one compelling sentence that expands the title]**

---

## Introduction

[Hook paragraph]

[Problem paragraph]

[Promise sentence]

---

## [H2 Section 1 — Benefit-driven header]

[Body...]

---

## [H2 Section 2 — Benefit-driven header]

[Body...]

---

## How Yaya AI Solves This

[Body — introduce Yaya AI naturally as the solution, not as an ad]

---

## [Conclusion Header]

**Key Takeaways:**
→ [Takeaway 1]
→ [Takeaway 2]
→ [Takeaway 3]

[CTA paragraph with link]

---

*[Author bio: 1–2 sentences about the Yaya AI team or the author]*

---
🔗 Internal Link Opportunities:
- [Describe where to add links to other Yaya AI content]

📊 SEO Estimate:
- Keyword difficulty: [Low / Medium / High]
- Traffic potential: [Estimated monthly searches for primary keyword]
- Time to rank: [3–6 months typical for new domain]
```

### Step 6: Save the Output
Save the article to the artifacts directory as `day_N_blog_post.md`.
Update `task.md` to mark the blog post for that day as complete.
