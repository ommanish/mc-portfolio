# Handwritten Owner-Alignment Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the four reviewed handwritten alignment problems by attaching each accent to an explicit content owner instead of relying on floating viewport-relative geometry.

**Architecture:** Continue from `feat/handwritten-accent-responsive-v2`, checkpointing only known A2 work if necessary. Create `fix/handwritten-accent-owner-alignment-v1`. Change only the Hero accent layer, QA annotation, AI `human in the loop` marker, and Experience `built over time` treatment; then verify those exact relationships in Chrome.

**Tech Stack:** React 19, Vite 8, Vitest 4, Testing Library, CSS, inline SVG, Playwright/Chrome, Git.

## Global Constraints

- Source experiment: `feat/handwritten-accent-responsive-v2`.
- New local branch: `fix/handwritten-accent-owner-alignment-v1`.
- Preserve all existing branches.
- No push, PR, merge, deployment, or branch deletion.
- Alignment-only; no sketch icons or new content.
- Classic production route remains untouched.
- Canonical portfolio copy and Lens personalization remain unchanged.
- Hero note is `built to ship`.
- Hero arrow is desktop-only.
- QA `validate here` is owned by the QA copy and no longer uses an empty floating circle.
- AI `human in the loop` is attached directly to the AI heading area.
- Experience `built over time` is attached to the actual `17+` anchor.
- Browser verification: 375×812, 768×900, 1280×900, dark + light.
- Capture six full-page screenshots and JSON geometry evidence.

---

### Task 1: Preserve A2 and create the fix branch

**Files:** no production changes.

- [ ] Inspect `git branch --show-current`, `git diff --name-only`, and cached diff.
- [ ] If the current A2 branch contains only known A2 experiment changes, explicitly stage and checkpoint them.
- [ ] Switch to `feat/handwritten-accent-responsive-v2` and require a clean tracked tree.
- [ ] Run `npm test`, `npm run build`, personalization tests, Worker tests, and `git diff --check`.
- [ ] Create `fix/handwritten-accent-owner-alignment-v1`.

### Task 2: Record approved design and plan

**Files:**
- Create: `docs/superpowers/specs/2026-08-15-handwritten-owner-alignment-fix-design.md`
- Create: `docs/superpowers/plans/2026-08-15-handwritten-owner-alignment-fix.md`

- [ ] Save the approved spec and this plan.
- [ ] Explicitly stage only those files.
- [ ] Commit `Record handwritten owner-alignment fix design`.

### Task 3: TDD the four owner relationships

**Files:**
- Modify: `src/App.test.jsx`

- [ ] Add a failing test proving:
  - Hero note says `built to ship`.
  - `.delivery-qa-sketch` is inside `.delivery-infographic-copy` and uses underline.
  - AI exposes `.ai-owner-accent`.
  - `.experience-years-accent` is inside `.timeline-anchor-years`.
  - Timeline no longer uses the floating section-header `built over time` accent.
- [ ] Run `npm test` and verify this new test fails for those current relationships.

### Task 4: Implement owner-alignment fixes

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/WebDeliveryInfographic.jsx`
- Modify: `src/components/AISection.jsx`
- Modify: `src/components/Timeline.jsx`
- Modify: `src/styles/redesign.css`

- [ ] Hero: keep underline + note in normal-flow `.hero-handwritten-layer`; normalize note to `built to ship`; hide arrow at <=980px.
- [ ] QA: move the existing annotation inside `.delivery-infographic-copy`; change its drawing from circle to underline; position by margin rather than viewport edges.
- [ ] AI: add `accentClassName="ai-owner-accent"` and make the marker/note a compact normal-flow unit beneath the heading.
- [ ] Experience: remove `built over time` from the section header; create `.timeline-anchor-years` around `17+`; place the local circle around `17+` on desktop and switch it to normal-flow underline on tablet/mobile.
- [ ] Run `npm test`, `npm run build`, and `git diff --check`.

### Task 5: Focused browser geometry test

**Files:**
- Create: `scripts/check-handwritten-owner-alignment.mjs`
- Modify: `package.json`
- Modify if needed: `package-lock.json`
- Create: `docs/experiments/handwritten-owner-alignment-v1/layout-report.json`
- Create: `docs/experiments/handwritten-owner-alignment-v1/screenshots/*.png`

- [ ] At 375×812, 768×900, and 1280×900 in dark/light, select Engineering and render progressive sections.
- [ ] Assert no page horizontal overflow.
- [ ] Hero: handwritten note bottom must remain above Hero paragraph top; arrow must be hidden at 375 and 768.
- [ ] QA: accent must be a descendant of QA copy and must not overlap the process node.
- [ ] AI: marker top must remain close to the AI heading bottom.
- [ ] Experience: accent must be inside the `17+` owner; desktop circle must overlap `17+`; tablet/mobile treatment must not be absolute/fixed.
- [ ] Save six full-page screenshots and report.

### Task 6: Full regression and local checkpoint

**Files:**
- Create: `docs/experiments/handwritten-owner-alignment-v1.md`
- Modify/Create: `docs/experiments/EXPERIMENTS.md`

- [ ] Run React tests, build, personalization tests, Worker tests, experiment tests/build when available, and `git diff --check`.
- [ ] Record the four fixed ownership relationships and evidence paths.
- [ ] Explicitly stage only fix/evidence files.
- [ ] Commit `Fix handwritten accent content ownership`.
- [ ] Fresh post-commit verification: `npm test`, `npm run build`, focused browser gate to `/tmp`, `git diff --check`.
- [ ] Verify branch is `fix/handwritten-accent-owner-alignment-v1` and tracked tree is clean.
