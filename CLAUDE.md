# CLAUDE.md — Iron Protocol

AI assistant context file for Claude Code CLI.
Read this before touching anything.

---

## Project Overview

**Iron Protocol** is an AI-powered gym training companion built as a React PWA.
Single-page app, no routing library, no state management library — all state lives
in `localStorage` via a thin `load()`/`save()` wrapper.

- **Repo:** `iron-protocol/` (monorepo root contains agent workspace files)
- **App root:** `iron-protocol/iron-protocol/`
- **Deployed on:** Vercel (auto-deploy on push to `main`)
- **Backend:** Single Vercel serverless function at `api/chat.js` — proxies to Gemini API

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI Framework | React 18 (JSX, no TypeScript) |
| Build tool | Vite 5 |
| Styling | Inline styles only — no CSS framework, no Tailwind |
| Font | Google Fonts — Syne (400/600/700/800) |
| Backend | Vercel serverless function (`api/chat.js`) |
| AI API | Google Gemini (`gemini-2.5-flash-lite` default, env-configurable) |
| Deployment | Vercel |
| PWA | Manual `manifest.json` + `sw.js` in `public/` |
| Storage | `localStorage` only — no database |
| Icons | Custom inline SVG components (`<Icon name="..." />`) |

**No external UI libraries. No CSS-in-JS. No router. No Redux.**

---

## Commands

All commands run from `iron-protocol/iron-protocol/` (the Vite project root).

```powershell
# Dev server
cd "iron-protocol\iron-protocol"; npm run dev

# Production build
cd "iron-protocol\iron-protocol"; npm run build

# Preview production build locally
cd "iron-protocol\iron-protocol"; npm run preview
```

> **Note:** This is Windows / PowerShell. Use `;` to chain commands, not `&&`.

**Deploy:** Push to `main` — Vercel auto-deploys. No manual deploy step.

**Environment variables** (set in Vercel dashboard, not `.env`):
- `GEMINI_API_KEY` — required
- `GEMINI_MODEL` — optional, defaults to `gemini-2.5-flash-lite`
- `DAILY_LIMIT` — optional, defaults to `10`

---

## File Structure

```
iron-protocol/iron-protocol/
├── src/
│   ├── App.jsx          ← entire app (single file, ~3500 lines)
│   └── main.jsx         ← React root mount
├── api/
│   └── chat.js          ← Vercel serverless function (Gemini proxy + rate limiting)
├── public/
│   ├── manifest.json    ← PWA manifest
│   ├── sw.js            ← Service worker
│   └── .well-known/     ← assetlinks.json for TWA / Play Store
├── index.html
├── vite.config.js
└── vercel.json
```

Everything lives in `App.jsx`. Don't split into separate component files without
discussing it first — the single-file approach is intentional for this project size.

---

## UI / Vibe

**Dark, minimal, premium gym aesthetic.** Think sports performance app, not fitness diary.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0f` | App shell, page backgrounds |
| Surface | `#111111` | Cards, inputs, modals |
| Surface elevated | `#1a1a24` | Button backgrounds, chips |
| Border | `#1a1a24` / `#2a2a3a` | Card borders, input borders |
| Accent / primary | `#e63c2f` | CTAs, highlights, progress indicators |
| Accent muted | `#e63c2f1a` | Soft backgrounds for accent areas |
| Accent border | `#e63c2f33` | Soft borders for accent areas |
| Success | `#4ade80` | Accepted changes, completed sets |
| Warning | `#f5a623` | Calories, carbs, secondary accents |
| Info | `#60a5fa` | Fat macros, info chips |
| Text primary | `#e8e4dc` | Main text (warm off-white, not pure white) |
| Text secondary | `#888888` | Subtitles, metadata |
| Text muted | `#555555` / `#444444` | Placeholder text, disabled states |

### Typography

- Font: **Syne** — used at 400/600/700/800
- Labels/tags: 9–11px, `letterSpacing: 1–2`, `textTransform: "uppercase"`, `fontWeight: 700`
- Body: 13–15px
- Headings: 17–22px, `fontWeight: 800`
- Numbers/stats: large (22–30px), `fontWeight: 800`, colored in accent

### Spacing & Shape

- Border radius: `8px` (small), `10–12px` (inputs/buttons), `13–16px` (cards), `18px` (modals)
- Card padding: `14–18px`
- Bottom nav: fixed, blurs behind content, respects safe-area-inset-bottom
- All interactive elements: `minHeight: 44px` (touch target minimum)

### Component Patterns

- **Cards:** `background: "#111"`, `border: "1px solid #1a1a24"`, `borderRadius: 13–15px`
- **Primary buttons:** `background: "#e63c2f"`, no border, `borderRadius: 12px`, `fontWeight: 800`
- **Ghost buttons:** `background: "#e63c2f1a"`, `border: "1px solid #e63c2f33"`, `color: "#e63c2f"`
- **Subtle buttons:** `background: "#1a1a24"`, `border: "1px solid #2a2a3a"`, `color: "#888"`
- **Section labels:** 10px uppercase, letter-spaced, `color: "#e63c2f"` — used above every section
- **Stat pills:** small coloured chips, `fontSize: 10–11`, `borderRadius: 5–6px`

### Safari / iOS Rules (critical)

- All full-screen overlays use `position: fixed; inset: 0; display: flex; flexDirection: column`
- Headers in overlays: use individual padding properties (`paddingTop`, `paddingLeft`…),
  never the shorthand — shorthand overwrites `env(safe-area-inset-top)`
- Header `paddingTop`: `"max(16px, env(safe-area-inset-top, 16px))"`
- Scroll containers: always `WebkitOverflowScrolling: "touch"`
- Fixed bottom nav: `paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))"`
- Main content area: `paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))"`
- Overlay headers need explicit `background` colour — content scrolls underneath them

---

## AI Coach Architecture

The AI coach routes requests through two paths:

1. **Plan requests** (`isPlanRequest()` check) → structured SESSION format prompt → `parsePlanFromText()` → accept/reject UI (`PlanPreview`)
2. **General questions** → conversational response

**If plan parsing fails:** automatic retry with a stricter prompt before falling back to plain text.

The `SESSION:` / pipe format is the contract between the AI and the parser:

```
SESSION: Push Day
- Bench Press | barbell | chest, triceps, shoulders | 4x8-10 | 60kg
```

Don't change this format without also updating `parsePlanFromText()`.

---

## Git Style

```
type: short imperative description

# Types:
feat:     new feature
fix:      bug fix
refactor: code change with no behaviour change
style:    UI/visual changes only
perf:     performance improvement
chore:    build, deps, config
```

**Examples:**
```
feat: add rest timer to workout logging
fix: Safari header buttons disappearing in overlay modals
fix: AI coach plan parsing fallback on prose response
style: tighten card spacing on nutrition tab
chore: bump vite to 5.4.2
```

Rules:
- All lowercase after the colon
- No period at the end
- Present tense, imperative mood ("add" not "added")
- Keep the subject line under 72 characters
- No ticket numbers or emoji in commit messages

---

## Key Constraints & Gotchas

- **Single `.jsx` file** — `App.jsx` is intentionally monolithic. Don't refactor into separate files without explicit instruction.
- **No TypeScript** — keep it plain JSX.
- **No external component libraries** — all UI is hand-rolled inline styles.
- **Exercise names are exact strings** — `EXERCISE_DB` and `AVAILABLE_EXERCISES` must stay in sync. AI prompts reference `AVAILABLE_EXERCISES`; the parser uses `KNOWN_EXERCISES` (built from `EXERCISE_DB`). Adding a new exercise requires updating both.
- **i18n** — all user-facing strings live in the `T` object (`en` and `fr`). Add new strings to both languages.
- **Rate limiting** — in-memory in `api/chat.js`, resets on cold start. Controlled by `DAILY_LIMIT` env var.
- **localStorage only** — no backend persistence. Don't add a DB without a full architecture discussion.
- **Git identity** — set at repo level: `Jad Salameh / jbsalameh@gmail.com`
