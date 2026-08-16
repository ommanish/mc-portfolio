# Final UI Polish — Change Reason + Follow Me Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the last two visible adaptive-portfolio UI details before live review: a clean `↶ Change reason` control and a grouped, aligned `Follow me` footer/social block.

**Architecture:** Preserve the current handwritten final-polish state on `fix/handwritten-accent-final-polish-v1`, then create `fix/final-ui-polish-change-reason-follow-me-v1`. Modify only Contact presentation, Footer social markup, and targeted CSS. A single Chrome gate carries forward the previous 18+/handwritten checks and adds exact Change Reason + Follow Me geometry checks at 375, 768, and 1280 pixels in dark and light mode.

**Tech Stack:** React, Vite, Vitest, Testing Library/user-event, CSS, Playwright/Chrome, Git.

## Global Constraints

- Source branch: `fix/handwritten-accent-final-polish-v1`.
- New local branch: `fix/final-ui-polish-change-reason-follow-me-v1`.
- Preserve every existing branch.
- No push, PR, merge, deployment, or branch deletion during this polish.
- `Change reason` stays an outlined secondary control.
- Change icon is `↶`, approximately 16px.
- Icon/text gap is approximately 8px.
- Control is approximately 44px high, vertically centered, and one line.
- Remove pseudo-element/divider artifacts from the control and its spans.
- No hover movement.
- `Follow me` is not handwritten.
- `Follow me` is a small 12–13px muted medium-weight label above the footer social links.
- Label and social links are one responsive block and remain together on mobile.
- No Hero, handwriting, 18+, infographic, Experience, Lens, Contact reason logic, form behavior, canonical content, section order, or classic-route redesign.
- Validate 375×812, 768×900, and 1280×900 in dark and light mode.
- Capture six full-page screenshots and JSON evidence.
- Carry-forward visual checks: Hero arrow absent, visible `18+`, QA/AI notes readable, Experience accent remains underline.

## Tasks

1. Preserve/checkpoint the handwritten final-polish source branch and run baseline tests/build.
2. Record the approved design and plan on a new local branch.
3. TDD the exact Change Reason and Follow Me markup contract.
4. Change only the Contact icon, Footer social wrapper/label, and targeted CSS.
5. Run the comprehensive six-viewport/theme Chrome gate, including carry-forward checks.
6. Run full regression, save evidence, commit locally, and rerun fresh post-commit verification.
