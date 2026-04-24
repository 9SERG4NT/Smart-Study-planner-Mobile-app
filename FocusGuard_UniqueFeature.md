# 📵 FocusGuard — Unique Feature

**Module:** Smart Study Planner  
**Version:** v1.0

---

## What It Does

Students say they have no time to study — but spend hours on Instagram, WhatsApp, and Facebook. FocusGuard passively tracks daily social media usage and nudges students back to their study tasks the moment overuse is detected.

---

## How It's Unique

No competitor combines **social media monitoring + pending task awareness + one-tap Pomodoro launch** in a single free student app.

| App | Monitors Social Media | Knows Your Tasks | One-tap to Study |
|---|---|---|---|
| Forest | ❌ | ❌ | ❌ |
| Digital Wellbeing | ✅ | ❌ | ❌ |
| Todoist | ❌ | ✅ | ❌ |
| **FocusGuard** | ✅ | ✅ | ✅ |

---

## Three-Tier Intervention

| Level | Trigger | Action |
|---|---|---|
| 🟡 Yellow | 80% of daily limit used | Gentle reminder notification |
| 🟠 Orange | Limit hit (100%) | Notification with your most urgent task embedded |
| 🔴 Red | 2× limit exceeded | Full-screen nudge — one tap starts Pomodoro |

---

## Key Design Decisions

- **Student sets their own limit** (default: 45 min/day) — app never forces anything
- **All data stays on-device** — nothing uploaded, ever
- **Non-shaming tone** — "You used 1h 23m" not "You wasted 1h 23m"
- **Max 1 notification per tier per day** — no spam
- **Uses Android UsageStatsManager** — no root, no hacks, built into Android 5+

---

## The Nudge

When your limit is hit, you don't just get told to stop scrolling. You get:

> *"You've used 1h 23m on Instagram today.*
> *Your task 'Complete notebook (Maths)' is due tomorrow.*
> *Tap to start a 25-min focus session."*

One tap → Pomodoro starts → task pre-loaded. Zero friction back to studying.

---

## Weekly Reality Report

Every Sunday the app shows:

```
📱 Social Media This Week:  9h 04m
📚 Study Time This Week:    6h 30m

⚠️ You spent 2.5 hrs more scrolling than studying.
🎯 Most neglected subject: Maths
```

---

## Dev Effort

**~3–5 days** on Android. Pure local logic. No backend required.
