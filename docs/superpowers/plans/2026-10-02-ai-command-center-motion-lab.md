# AI Command Center Motion Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, accessible, cinematic AI Command Center motion experience at `/labs/ai-command-center/` and link it from the portfolio only after the Lab is independently verified.

**Architecture:** Keep all Lab source under `labs/ai-command-center/` with standalone HTML/CSS/JS and no imports from `src/`. A small post-build copier places the Lab unchanged under `dist/labs/ai-command-center/`; GSAP/ScrollTrigger are loaded only by the Lab page, so portfolio runtime and styles remain isolated.

**Tech Stack:** Semantic HTML, modern CSS, vanilla JavaScript, GSAP 3 + ScrollTrigger, Node test scripts, Playwright for browser verification, existing Vite portfolio build.

**Spec:** `docs/superpowers/specs/2026-10-02-ai-command-center-motion-lab-design.md`

## Global Constraints

- Fictional AI Workspace / Command Center concept; never present it as client work.
- Production URL: `/labs/ai-command-center/`.
- No Lab file may import from `src/`.
- Portfolio CSS/JS must not be loaded by the Lab, and Lab CSS/JS must not be loaded by the portfolio homepage.
- Native scrolling by default; limited pinning only where it strengthens the story.
- Respect `prefers-reduced-motion` and provide explicit Theme, Motion, Contrast, and Pause/Resume controls.
- Manual user preferences override story-driven theme/motion behavior for the session.
- The experience must remain readable if GSAP fails or JavaScript is disabled.
- No direct changes to `main`; work remains on `feature/motion-storytelling-lab` until PR review.

## Review Focus

- GSAP/CDN unavailable: page content and navigation must remain readable and usable without motion.
- `prefers-reduced-motion: reduce`: pinning, parallax, scrubbed transforms, and non-essential continuous animation must not run.
- Manual Light/Dark selection during an automatic story transition: the manual theme must win for the rest of the session.
- Mobile/zoomed layouts: no horizontal content loss, inaccessible controls, or hover-only interactions.
- Portfolio isolation: production build must include the Lab while the portfolio homepage contains no Lab runtime imports or styles.

---

### Task 1: Standalone Lab shell and production-copy contract

**Files:**
- Create: `labs/ai-command-center/index.html`
- Create: `labs/ai-command-center/css/base.css`
- Create: `labs/ai-command-center/css/components.css`
- Create: `labs/ai-command-center/css/motion.css`
- Create: `labs/ai-command-center/js/app.js`
- Create: `labs/ai-command-center/js/theme.js`
- Create: `labs/ai-command-center/js/accessibility.js`
- Create: `labs/ai-command-center/js/motion.js`
- Create: `scripts/build-motion-lab.mjs`
- Create: `scripts/motion-lab-build.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run build:motion-lab`, which copies `labs/ai-command-center/**` to `dist/labs/ai-command-center/**` after the normal Vite build.
- Produces: standalone page root `[data-lab="ai-command-center"]` and chapter elements `[data-chapter]` consumed by later tasks.

- [ ] **Step 1: Write the failing build-contract test**

Create `scripts/motion-lab-build.test.mjs` with tests that assert:
- `labs/ai-command-center/index.html` exists;
- Lab HTML references only its own `/labs/ai-command-center/...` CSS/JS plus pinned GSAP CDN URLs;
- no Lab file contains imports/references into `/src/` or `../../src`;
- after the copy script runs, `dist/labs/ai-command-center/index.html` exists.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test scripts/motion-lab-build.test.mjs`

Expected: FAIL because the standalone Lab shell/copy contract does not exist yet.

- [ ] **Step 3: Create the minimal standalone shell and copier**

`index.html` must include:
- `<main id="main-content">`;
- a visible concept/lab label;
- eight semantic chapter sections using `[data-chapter]`;
- an experience-settings control region placeholder;
- local CSS/JS references rooted at `/labs/ai-command-center/`;
- pinned GSAP + ScrollTrigger CDN scripts loaded only on this page.

`scripts/build-motion-lab.mjs` must recursively copy the Lab folder into `dist/labs/ai-command-center/` without importing or bundling portfolio source.

Add `build:motion-lab` and integrate it after `vite build` in the existing build script without changing Vite's portfolio entrypoint.

- [ ] **Step 4: Run the focused build-contract test and verify GREEN**

Run: `node --test scripts/motion-lab-build.test.mjs`

Expected: PASS.

- [ ] **Step 5: Verify the existing portfolio build still succeeds**

Run: `npm run build`

Expected: Vite portfolio build succeeds and `dist/labs/ai-command-center/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add labs/ai-command-center scripts/build-motion-lab.mjs scripts/motion-lab-build.test.mjs package.json
git commit -m "feat: scaffold isolated AI Command Center lab"
```

### Task 2: Accessible experience controls and preference state

**Files:**
- Modify: `labs/ai-command-center/index.html`
- Modify: `labs/ai-command-center/css/base.css`
- Modify: `labs/ai-command-center/css/components.css`
- Modify: `labs/ai-command-center/css/motion.css`
- Modify: `labs/ai-command-center/js/app.js`
- Modify: `labs/ai-command-center/js/theme.js`
- Modify: `labs/ai-command-center/js/accessibility.js`
- Create: `scripts/motion-lab-controls.test.mjs`

**Interfaces:**
- Produces: `window.MotionLabPreferences` with `get()`, `setTheme(value)`, `setMotion(value)`, `setContrast(value)`, `setPaused(boolean)`, and `subscribe(callback)`.
- Valid theme values: `auto | light | dark`.
- Valid motion values: `full | reduced`.
- Valid contrast values: `standard | high`.

- [ ] **Step 1: Write failing preference/control tests**

Test exact controls and state behavior:
- Theme exposes Auto/Light/Dark;
- Motion exposes Full/Reduced;
- Contrast exposes Standard/High;
- Pause/Resume is a real button with state reflected through `aria-pressed` or accessible text;
- `prefers-reduced-motion: reduce` initializes reduced mode unless the user already chose a session preference;
- manual Light/Dark disables automatic story theme changes;
- controls are keyboard-focusable and have visible-label text.

Also pin the review-focus case: a manual Light/Dark choice must remain authoritative if `setStoryTheme()` is later requested by motion code.

- [ ] **Step 2: Run controls tests and verify RED**

Run: `node --test scripts/motion-lab-controls.test.mjs`

Expected: FAIL because preference APIs/controls are not implemented.

- [ ] **Step 3: Implement preference state and semantic controls**

Use session-scoped persistence. Apply document state through `data-theme`, `data-motion`, `data-contrast`, and `data-paused` on the Lab root. Do not remove content from the DOM when modes change.

- [ ] **Step 4: Implement high-contrast, focus, reduced-motion, and pause CSS behavior**

Reduced mode must remove parallax/scrub-dependent transforms and continuous decorative animation while preserving reading order.

- [ ] **Step 5: Run controls tests and verify GREEN**

Run: `node --test scripts/motion-lab-controls.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add labs/ai-command-center scripts/motion-lab-controls.test.mjs
git commit -m "feat: add accessible motion lab controls"
```

### Task 3: Build the eight-chapter AI Command Center visual story

**Files:**
- Modify: `labs/ai-command-center/index.html`
- Modify: `labs/ai-command-center/css/base.css`
- Modify: `labs/ai-command-center/css/components.css`
- Create: `labs/ai-command-center/assets/icons/*.svg` only when the icon cannot be expressed accessibly with CSS/text
- Create: `scripts/motion-lab-structure.test.mjs`

**Interfaces:**
- Produces chapter IDs: `welcome`, `ask`, `processing`, `workspace`, `collaboration`, `intelligence`, `command-center`, `accessibility`.
- Produces stable motion hooks via `data-motion-*` attributes; motion code must not depend on presentation-only CSS class names.

- [ ] **Step 1: Write failing semantic/story tests**

Assert:
- exactly eight chapter regions in the approved order;
- one H1 and logical H2 chapter hierarchy;
- concept/lab disclosure is visible near the H1;
- key interactive objects are buttons/links/inputs rather than clickable divs;
- every decorative visual is either CSS-only or `aria-hidden`;
- no product copy implies a real deployed client system.

Add review-focus checks for mobile/zoom resilience: no fixed pixel page width and no required hover-only control markup.

- [ ] **Step 2: Run structure tests and verify RED**

Run: `node --test scripts/motion-lab-structure.test.mjs`

Expected: FAIL because the final story markup does not exist.

- [ ] **Step 3: Implement chapter markup and static visual states**

Build the complete experience so it is understandable before motion is enabled. The static page must already communicate:
- prompt/context/intention;
- AI orchestration;
- expanding workspace;
- human approval/collaboration;
- live intelligence;
- final command center;
- accessibility controls/explanation.

- [ ] **Step 4: Implement responsive layouts**

Desktop may use layered/pinned-ready compositions. Tablet/mobile must collapse to simpler stacked UI, larger touch targets, and fewer simultaneous layers without changing DOM reading order.

- [ ] **Step 5: Run structure tests and verify GREEN**

Run: `node --test scripts/motion-lab-structure.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add labs/ai-command-center scripts/motion-lab-structure.test.mjs
git commit -m "feat: build AI Command Center story"
```

### Task 4: Purposeful GSAP/ScrollTrigger motion system

**Files:**
- Modify: `labs/ai-command-center/js/motion.js`
- Modify: `labs/ai-command-center/js/app.js`
- Modify: `labs/ai-command-center/css/motion.css`
- Create: `scripts/motion-lab-motion.test.mjs`

**Interfaces:**
- Produces: `window.MotionLabMotion.init()`, `refresh()`, `pause()`, `resume()`, `destroy()`.
- Consumes: `window.MotionLabPreferences.subscribe(callback)` and stable `[data-motion-*]` hooks from Task 3.

- [ ] **Step 1: Write failing motion-system tests**

Assert from source/runtime contracts that:
- initialization exits safely when `window.gsap` or `window.ScrollTrigger` is unavailable;
- reduced-motion mode never initializes scrub/parallax/pinned cinematic timelines;
- pause calls pause on non-essential running timelines and resume restores them only when user requests it;
- each chapter owns/scopes its animations so cleanup can target a chapter;
- manual theme selection is checked before story-driven Light/Dark transitions.

Add the review-focus GSAP-unavailable case explicitly: motion failure must not hide chapter content or navigation.

- [ ] **Step 2: Run motion tests and verify RED**

Run: `node --test scripts/motion-lab-motion.test.mjs`

Expected: FAIL because the motion API/timelines do not exist.

- [ ] **Step 3: Implement functional + expressive motion**

Add focus/hover feedback, masked text reveals, staggered UI assembly, panel transitions, and progressive data/chart drawing. These must reinforce hierarchy/state and remain optional enhancement.

- [ ] **Step 4: Implement cinematic chapter timelines**

Implement the approved signature sequence:
- light workspace receives the prompt;
- interface focus narrows;
- AI processing begins;
- story transitions into dark orchestration;
- panels expand/reorganize into the command center.

Use native scroll. Limit pinning to the processing/workspace/command-center story moments where it adds context.

- [ ] **Step 5: Implement lifecycle cleanup and preference reactions**

On reduced mode, resize/breakpoint changes, pause, or destroy: remove or rebuild only the relevant timelines and leave content visible.

- [ ] **Step 6: Run motion tests and verify GREEN**

Run: `node --test scripts/motion-lab-motion.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add labs/ai-command-center scripts/motion-lab-motion.test.mjs
git commit -m "feat: add accessible cinematic motion system"
```

### Task 5: Browser accessibility, responsive, and fallback verification

**Files:**
- Create: `scripts/motion-lab.e2e.mjs`
- Modify: `package.json`
- Modify Lab files only when a browser test exposes a defect.

**Interfaces:**
- Produces: `npm run test:motion-lab` for Node contract tests + Playwright browser checks.

- [ ] **Step 1: Write failing Playwright checks**

Cover:
- `/labs/ai-command-center/` returns the standalone experience;
- keyboard can reach settings and primary interactive controls in logical order;
- reduced-motion media emulation results in `data-motion="reduced"` and no pinned/scrubbed cinematic state;
- Light/Dark manual selection persists while scrolling across theme-transition chapters;
- pause remains paused until explicit resume;
- 390px mobile viewport has no page-level horizontal overflow;
- 200% zoom equivalent viewport remains usable;
- blocking GSAP CDN requests still leaves all chapter headings and core content visible.

- [ ] **Step 2: Run browser checks and verify RED where required**

Run the local Vite server and then: `node scripts/motion-lab.e2e.mjs`

Expected: any uncovered browser-level defect fails with a targeted assertion.

- [ ] **Step 3: Fix only defects proven by the browser checks**

Do not add new visual features in this task.

- [ ] **Step 4: Add combined test script**

`test:motion-lab` must run build-contract, controls, structure, motion, and browser checks.

- [ ] **Step 5: Run full Lab verification**

Run: `npm run test:motion-lab`

Expected: PASS.

Run: `npm run build`

Expected: PASS and Lab present under `dist/labs/ai-command-center/`.

Run: `npm test`

Expected: existing portfolio tests PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/motion-lab.e2e.mjs package.json labs/ai-command-center
git commit -m "test: verify motion lab experience"
```

### Task 6: Add the verified Lab to the portfolio

**Files:**
- Modify: `src/components/CaseStudies.jsx`
- Modify: `src/styles/case-studies.css` only if the existing Lab card needs a minimal secondary-project treatment
- Modify: `src/components/CaseStudies.lab.test.jsx`

**Interfaces:**
- Consumes: verified production path `/labs/ai-command-center/` from Tasks 1–5.
- Produces: portfolio link to the standalone AI Command Center without loading Lab runtime on the homepage.

- [ ] **Step 1: Write the failing portfolio-link test**

Extend `CaseStudies.lab.test.jsx` to assert:
- `AI Command Center` is presented as a concept/motion Lab;
- its link is exactly `/labs/ai-command-center/`;
- existing CSS Practical Lab links remain unchanged;
- the existing five `.case-study-preview-card` cards remain exactly five.

Add the portfolio-isolation review-focus assertion: rendered portfolio markup must not contain Lab script or stylesheet references.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npx vitest run src/components/CaseStudies.lab.test.jsx`

Expected: FAIL because the new AI Command Center link is not present yet.

- [ ] **Step 3: Add the minimal Lab project link/card**

Keep the existing Lab section structure. Add the AI Command Center as a clearly labeled concept/motion experience alongside the existing CSS Practical Lab without turning it into a sixth case study.

- [ ] **Step 4: Run focused test and verify GREEN**

Run: `npx vitest run src/components/CaseStudies.lab.test.jsx`

Expected: PASS.

- [ ] **Step 5: Final branch verification**

Run: `npm run test:motion-lab`

Run: `npm test`

Run: `git diff --check`

Run: `npm run build`

Expected: all PASS; `dist/labs/ai-command-center/index.html` exists; existing portfolio remains functional.

- [ ] **Step 6: Commit**

```bash
git add src/components/CaseStudies.jsx src/styles/case-studies.css src/components/CaseStudies.lab.test.jsx
git commit -m "feat: link AI Command Center from portfolio lab"
```

### Task 7: Review and PR handoff

**Files:**
- No new production files expected.

**Interfaces:**
- Produces: reviewable `feature/motion-storytelling-lab` branch; does not merge to `main`.

- [ ] **Step 1: Inspect branch scope**

Run: `git diff main...HEAD --stat`

Expected: only design/plan docs, standalone Lab files, narrowly scoped build/test support, and the intentional portfolio Lab link.

- [ ] **Step 2: Run final verification from a clean working tree**

Run: `npm run test:motion-lab && npm test && git diff --check && npm run build`

Expected: all commands PASS.

- [ ] **Step 3: Push branch and create PR**

Push `feature/motion-storytelling-lab` and create a PR against `main`. Do not merge until PR checks, security checks, and human review are complete.
