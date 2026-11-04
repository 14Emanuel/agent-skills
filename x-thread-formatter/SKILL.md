---
name: x-thread-formatter
description: Transforms a day's content marketing topic into a high-engagement X (Twitter) thread. Use this after the daily content strategy has been drafted to produce a platform-optimized X thread for Yaya AI.
---

# X Thread Formatter — Yaya AI

This skill takes the day's content marketing topic and transforms it into a viral, high-engagement X (Twitter) thread optimized for maximum reach and follower growth.

## When to Use This Skill

Use this skill after the daily content topic has been determined (either from the content strategy or from a `day_N_content.md` file). It produces a ready-to-post X thread.

## Thread Formatting Rules

A great X thread for Yaya AI must follow these rules:

### Structure
1. **Hook Tweet (Tweet 1):** The most important tweet. Must stop the scroll. Use a bold claim, a surprising stat, or a provocative question. Max 220 characters. No hashtags here.
2. **Body Tweets (Tweets 2–7):** Each tweet expands one idea. Use short punchy sentences. Each tweet must end with a reason to read the next.
3. **Value Tweet (Tweet 8):** The "meat" — a concrete tip, framework, or insight the reader can use immediately.
4. **CTA Tweet (Tweet 9):** A clear, single call to action. Direct them to try Yaya AI, follow, or share.
5. **Engagement Tweet (Tweet 10):** A question that invites replies to boost the algorithm.

### Style Rules
- Each tweet is max 280 characters
- Use line breaks within tweets for readability (short sentences on separate lines)
- No walls of text
- Use numbers and emojis sparingly but strategically (1–2 emojis max per tweet)
- Do NOT use generic hashtags (#AI, #jobs). Use none, or 1 highly specific one at the end.
- Write in first person, conversational tone (like a smart friend sharing insider knowledge)
- Every tweet must be able to stand alone AND flow as part of the thread

### Yaya AI Brand Voice
- Empathetic: acknowledge the job hunt pain
- Confident: Yaya AI is the cure, not just a tool
- Data-driven: reference real numbers where possible (60 seconds, 18 minutes saved, etc.)
- Anti-hustle-porn: We automate the friction so humans can focus on what matters

## How to Execute This Skill

### Step 1: Read the Day's Content
Read the current day's content file (e.g., `day_4_content.md`) from the artifacts directory:
`C:\Users\emm14\.gemini\antigravity\brain\de19a8e1-e7ed-4139-b660-bd7e0f7c8339\`

Or use the topic/theme provided directly by the user.

### Step 2: Extract the Core Insight
Identify:
- The single biggest "aha" moment from the content
- The most surprising or counterintuitive fact
- The emotional hook (what pain does this solve?)

### Step 3: Draft the Thread
Write all 10 tweets following the structure above. Number each tweet (1/, 2/, etc.).

### Step 4: Output the Thread
Output in this exact format:

```
🧵 THREAD: [One-line description of what this thread is about]

1/
[Hook tweet — the scroll-stopper]

2/
[Context or problem setup]

3/
[Deepen the problem]

4/
[Introduce the insight or shift]

5/
[Evidence, data, or example]

6/
[How Yaya AI solves this]

7/
[Specific feature or result]

8/
[The actionable value — what they can do RIGHT NOW]

9/
[CTA — try Yaya AI / link in bio / follow for more]

10/
[Engagement question — invites replies]

---
📊 Thread Stats:
- Estimated reach: [Low/Medium/High — based on hook strength]
- Best posting time: [Weekday morning 8–10 AM or lunchtime 12–1 PM local]
- Suggested media: [What image/video would make tweet 1 pop]
```

### Step 5: Save the Output
Save the thread to the artifacts directory as `day_N_x_thread.md` where N is the current day number.

Update `task.md` to mark the X thread for that day as complete.
