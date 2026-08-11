# Kinetic AppStudio Academy

A premium, hands-on internal training portal for mastering Epicor **Kinetic Application Studio** —
built with Next.js (App Router) + TypeScript + Tailwind CSS.

## What's inside

- **Home** (`/`) — landing page with the full curriculum overview.
- **Dashboard** (`/dashboard`) — personal progress tracker (lessons completed, quiz scores, certifications), saved to `localStorage`.
- **Training Modules** (`/modules`) — 6 structured modules distilled from the official Kinetic AppStudio 2023.1 & 2023.2 user guides:
  1. Application Studio Fundamentals
  2. Application Map & Page Architecture
  3. Components, Layout & Reusable Building Blocks
  4. Data Rules & Events
  5. DataViews, Widgets & Sliding Panels in Practice
  6. Layers, Publishing, Governance & the SDK
- Each module has expandable lessons with pro tips and version callouts (`2023.1` vs `2023.2` differences), plus a **5-question scored assignment** (`/modules/[slug]/quiz`) with instant feedback and an 80% pass threshold to earn a badge.
- **Hands-On Labs** (`/labs`) — practical labs to apply the concepts, starting with `lab-baq-customer-combo`.

## Content source

Lesson content in `lib/curriculum.ts` is authored from the Epicor **Kinetic Application Studio User Guide** versions 2023.1 and 2023.2, condensed into engaging, scenario-driven lessons instead of raw documentation dumps.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- No backend required — progress is stored client-side in `localStorage` (`lib/progress.ts`)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Extending the curriculum

Add a new module by appending an entry to the `modules` array in `lib/curriculum.ts` — lesson pages, quizzes, dashboard tracking, and navigation all update automatically.
