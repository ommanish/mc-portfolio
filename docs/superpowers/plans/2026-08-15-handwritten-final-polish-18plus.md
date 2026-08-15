# Handwritten Final Polish + 18+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the approved handwritten treatment by removing the detached Hero arrow, strengthening QA/AI notes, converting the Experience accent to a clean underline attached to `18+`, and updating active portfolio experience copy from `17+` to `18+`.

**Architecture:** Preserve the reviewed owner-alignment state on `fix/handwritten-accent-owner-alignment-v1`, then create `fix/handwritten-accent-final-polish-v1`. Use TDD for visible behavior changes, make only targeted JSX/CSS/content edits, and verify the result in Chrome at 375, 768, and 1280 pixels in dark and light mode.

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS, inline SVG, Playwright/Chrome, Git.

## Global Constraints

- Source branch: `fix/handwritten-accent-owner-alignment-v1`.
- New local branch: `fix/handwritten-accent-final-polish-v1`.
- Preserve every existing branch.
- No push, PR, merge, deployment, or branch deletion.
- Hero arrow is removed completely.
- Hero underline + `built to ship` remains.
- QA `validate here` stays locally owned and becomes slightly more readable.
- AI `human in the loop` stays locally owned, moves closer to its heading, and becomes slightly more readable.
- Experience `built over time` becomes a warm underline attached directly to `18+`; no large circle.
- Active portfolio experience copy changes from `17+` to `18+`; career dates remain unchanged.
- Do not rewrite other canonical portfolio content.
- Do not change Lens behavior.
- Validate 375×812, 768×900, and 1280×900 in dark/light.
- Capture six full-page screenshots and JSON layout evidence.

## Tasks

1. Preserve and checkpoint the reviewed owner-alignment state.
2. Add a failing React test for Hero arrow removal, `18+`, and Experience underline.
3. Remove the Hero arrow, update active `17+` copy to `18+`, convert Experience circle to underline, and add targeted QA/AI/Experience CSS.
4. Run React/build/diff verification.
5. Run a Chrome geometry gate at 375/768/1280 in dark/light.
6. Record evidence, commit locally, and rerun fresh post-commit verification.
