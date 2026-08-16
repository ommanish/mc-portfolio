# Handwritten Accent Responsive v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the preferred handwritten-accent portfolio direction with a responsive A2 vocabulary: rich desktop accents, reduced tablet accents, and mostly inline underline + short-note treatment on mobile.

**Architecture:** Continue from the preserved handwritten checkpoint `fix/handwritten-accent-alignment-v1` at `67fd681`. Extend the existing `HandwrittenAccent` primitive so it owns breakpoint simplification, while parent sections position only the complete accent wrapper. Build all A2 work on the new local branch `feat/handwritten-accent-responsive-v2`; preserve the sketch-icon experiment separately.

**Tech Stack:** React 19, Vite 8, Vitest 4, Testing Library, CSS, inline SVG, Playwright with installed Chrome, Git.

## Global Constraints

- Source handwritten checkpoint: `fix/handwritten-accent-alignment-v1` at commit `67fd681`.
- New branch: `feat/handwritten-accent-responsive-v2`.
- Preserve `feat/sketch-icon-system-v1` as a separate experiment.
- No push, PR, merge, deployment, or branch deletion.
- Do not modify the classic production route.
- Do not rewrite canonical portfolio content or section order.
- Do not change Lens personalization behavior.
- Existing Web Delivery and Career/Skills infographics remain the primary information graphics.
- Core UI typography remains unchanged.
- Handwritten notes use the existing system cursive stack; no external font dependency.
- Mobile handwritten note size must remain at least approximately 13px.
- Motion is one-time only and honors `prefers-reduced-motion`.
- Responsive browser validation: 375×812, 768×900, 1280×900 in both dark and light mode.
- Full-page screenshots and a geometry report are required before a local-review-ready status.

---

### Task 1: Preserve the sketch experiment and create the A2 branch

**Files:**
- No production files are changed by this task.
- Possible local sketch checkpoint files are explicitly staged only when already modified on `feat/sketch-icon-system-v1`.

**Interfaces:**
- Consumes: current local Git state.
- Produces: clean `feat/handwritten-accent-responsive-v2` branch rooted at handwritten checkpoint `67fd681`.

- [ ] **Step 1: Inspect the current branch and tracked changes**

```bash
git branch --show-current
git diff --name-only
git diff --cached --name-only
```

- [ ] **Step 2: If the current branch is the sketch experiment, checkpoint only known sketch files**

Allowed paths are the sketch component/tests/styles/package/layout-report files created by that experiment. Any unrelated tracked path stops execution.

```bash
git add <explicit-known-sketch-paths>
git commit -m "Checkpoint sketch icon experiment before returning to handwritten direction"
```

- [ ] **Step 3: Switch to the handwritten checkpoint and verify its exact commit**

```bash
git switch fix/handwritten-accent-alignment-v1
git rev-parse --short HEAD
```

Expected: `67fd681`.

- [ ] **Step 4: Run the checkpoint baseline**

```bash
npm test
npm run build
node --test src/lib/personalization.test.js src/lib/hybridPersonalization.test.js
node --test worker/src/index.test.js
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 5: Create the isolated local experiment branch**

```bash
git switch -c feat/handwritten-accent-responsive-v2
```

### Task 2: Add the responsive contract to HandwrittenAccent

**Files:**
- Modify: `src/components/HandwrittenAccent.jsx`
- Modify: `src/styles/redesign.css`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: existing props `type`, `label`, `className`, `notePosition`.
- Produces:

```jsx
<HandwrittenAccent
  type="circle"
  label="validate here"
  notePosition="below"
  mobileType="underline"
  mobileNotePosition="inline"
  hideOnMobile={false}
/>
```

New DOM contract:
- `data-mobile-type`
- `data-mobile-note-position`
- `data-mobile-hidden`
- `.handwritten-accent-art-desktop`
- `.handwritten-accent-art-mobile`

- [ ] **Step 1: Write the failing responsive-contract test**

```jsx
test("handwritten accent supports explicit mobile simplification", () => {
  const { container } = render(
    <HandwrittenAccent
      type="circle"
      label="responsive note"
      notePosition="below"
      mobileType="underline"
      mobileNotePosition="inline"
    />
  );
  const accent = container.querySelector(".handwritten-accent");
  expect(accent).toHaveAttribute("data-mobile-type","underline");
  expect(accent).toHaveAttribute("data-mobile-note-position","inline");
  expect(container.querySelectorAll(".handwritten-accent-art-mobile")).toHaveLength(1);
});
```

- [ ] **Step 2: Run the React suite and verify RED**

```bash
npm test
```

Expected: this new test fails because the checkpoint primitive has no mobile simplification contract.

- [ ] **Step 3: Implement the minimal responsive primitive**

`HandwrittenAccent` renders desktop art plus optional alternate mobile art. It resolves `mobileType || type` and `mobileNotePosition || notePosition`, and hides itself only when `hideOnMobile` is true.

- [ ] **Step 4: Add mobile shared CSS**

At `max-width:760px`, switch to mobile art when present and make `mobileNotePosition="inline"` notes normal-flow with at least 13px text.

- [ ] **Step 5: Verify GREEN**

```bash
npm test
npm run build
git diff --check
```

Expected: all exit 0.

### Task 3: Simplify Hero, section headers, and the 17+ visual by breakpoint

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/SectionHeader.jsx`
- Modify: `src/styles/redesign.css`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Hero underline: mobile stays `underline`, note becomes `inline`.
- Hero arrow: `hideOnMobile={true}`.
- SectionHeader non-underline accent: mobile becomes `underline`.
- Mobile career coordinate: compact `17+` + readable 2×2 UI/WEB/CMS/AI grid.

- [ ] **Step 1: Add the failing Hero/header simplification test**

```jsx
test("handwritten Hero and section headers declare mobile simplification", () => {
  const profile = getAudienceProfile("engineering");
  const heroView = render(
    <Hero audienceProfile={profile} source="preset"
      recommendedSections={["work","cases","skills","timeline"]}
      onChangeLens={() => {}} />
  );
  expect(heroView.container.querySelector(".hero-sketch-underline"))
    .toHaveAttribute("data-mobile-type","underline");
  expect(heroView.container.querySelector(".hero-sketch-arrow"))
    .toHaveAttribute("data-mobile-hidden","true");
  cleanup();

  const headerView = render(
    <SectionHeader kicker="Experience" title="Responsive heading"
      accentType="circle" accentLabel="built over time" />
  );
  expect(headerView.container.querySelector(".section-header-handwritten"))
    .toHaveAttribute("data-mobile-type","underline");
  expect(headerView.container.querySelector(".section-header-handwritten"))
    .toHaveAttribute("data-mobile-note-position","inline");
});
```

- [ ] **Step 2: Verify RED with `npm test`.**

- [ ] **Step 3: Add responsive props and shorten the Hero note to `built to ship`.**

- [ ] **Step 4: Add tablet restraint CSS**

At 761–980px, shorten the Hero arrow and reduce oversized accent widths while keeping richer desktop treatment above 980px.

- [ ] **Step 5: Add mobile normal-flow Hero/header CSS and the compact career coordinate.**

- [ ] **Step 6: Verify**

```bash
npm test
npm run build
git diff --check
```

### Task 4: Keep infographic annotations inside their stages

**Files:**
- Modify: `src/components/WebDeliveryInfographic.jsx`
- Modify: `src/components/CareerCapabilityMap.jsx`
- Modify: `src/styles/redesign.css`
- Modify: `src/App.test.jsx`

**Interfaces:**
- QA: desktop circle; mobile underline + inline `validate here`.
- Launch: desktop/tablet pointer; hidden on mobile when it cannot fit cleanly.
- Career AI note: mobile underline + inline note.
- CMS career accent: may hide on mobile if redundant.

- [ ] **Step 1: Add failing infographic responsive test**

```jsx
test("infographic handwritten accents simplify inside mobile stage rows", () => {
  const delivery = render(<WebDeliveryInfographic />);
  expect(delivery.container.querySelector(".delivery-qa-sketch"))
    .toHaveAttribute("data-mobile-type","underline");
  expect(delivery.container.querySelector(".delivery-qa-sketch"))
    .toHaveAttribute("data-mobile-note-position","inline");
  expect(delivery.container.querySelector(".delivery-launch-sketch"))
    .toHaveAttribute("data-mobile-hidden","true");
  cleanup();

  const career = render(<CareerCapabilityMap />);
  expect(career.container.querySelector(".career-ai-sketch"))
    .toHaveAttribute("data-mobile-type","underline");
});
```

- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement responsive props.**
- [ ] **Step 4: Place QA and AI annotation wrappers in normal content flow on mobile.**
- [ ] **Step 5: Verify tests/build/diff.**

### Task 5: Add restrained A2 accents to Lens, cases, timeline, and Contact

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/CaseStudies.jsx`
- Modify: `src/components/Timeline.jsx`
- Modify: `src/components/Contact.jsx`
- Modify: `src/styles/redesign.css`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Lens: `start here`.
- Cases: maximum one accent per case narrative.
- Timeline milestone notes:
  - Salesforce → `web experience`
  - TechDemocracy / Quantious → `page-builder delivery`
  - Genpact → `enterprise scale`
  - GE Corporate → `frontend foundation`
- Contact: `let’s build something useful`.

All mobile additions use `mobileType="underline"` and `mobileNotePosition="inline"`.

- [ ] **Step 1: Add failing v2 coverage test.**
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Add Lens guidance accent next to the existing recommended-path content.**
- [ ] **Step 4: Add one Case Study accent per article, never changing case content.**
- [ ] **Step 5: Add exactly four evidence-backed Timeline accents.**
- [ ] **Step 6: Add the Contact note inside `.contact-intro` and outside the form.**
- [ ] **Step 7: Add desktop/tablet/mobile placement CSS.**
- [ ] **Step 8: Verify tests/build/diff.**

### Task 6: Run the real responsive A2 visual gate

**Files:**
- Create/replace: `scripts/check-handwritten-layout.mjs`
- Modify if needed: `package.json`, `package-lock.json`
- Create: `docs/experiments/handwritten-accent-responsive-v2/layout-report.json`
- Create: `docs/experiments/handwritten-accent-responsive-v2/screenshots/*.png`

**Interfaces:**
- `npm run test:handwritten-layout -- --report <path> --screenshots <dir>`

- [ ] **Step 1: Ensure Playwright is available and the layout script is registered.**
- [ ] **Step 2: Launch Vite on localhost and Chrome headlessly.**
- [ ] **Step 3: Select the Engineering Lens and scroll the complete portfolio so progressive sections render.**
- [ ] **Step 4: Run 375×812, 768×900, 1280×900 in dark/light.**
- [ ] **Step 5: Assert no page horizontal overflow.**
- [ ] **Step 6: Assert every visible handwritten note stays in the viewport and remains close to its drawing.**
- [ ] **Step 7: Assert note text is at least 12.5px and control overlap is no more than 25%.**
- [ ] **Step 8: On mobile, assert Hero arrow and career cross are hidden, QA uses the mobile underline, and selected annotations are normal-flow rather than absolute.**
- [ ] **Step 9: Capture six full-page screenshots and JSON report.**

### Task 7: Full regression and local experiment checkpoint

**Files:**
- Create: `docs/experiments/handwritten-accent-responsive-v2.md`
- Modify/Create: `docs/experiments/EXPERIMENTS.md`
- Create: responsive evidence files from Task 6.

- [ ] **Step 1: Run all React tests**

```bash
npm test
```

- [ ] **Step 2: Run personalization tests**

```bash
node --test src/lib/personalization.test.js src/lib/hybridPersonalization.test.js
```

- [ ] **Step 3: Run Worker tests**

```bash
node --test worker/src/index.test.js
```

- [ ] **Step 4: Run experiment-shell tests and experiment build**

```bash
npm run test:experiment
npm run build:experiment
```

- [ ] **Step 5: Run production-style build and diff checks**

```bash
npm run build
git diff --check
```

- [ ] **Step 6: Record branch lineage and evidence paths.**
- [ ] **Step 7: Explicitly stage only A2 files and commit locally.**
- [ ] **Step 8: Run fresh post-commit `npm test`, `npm run build`, layout gate to `/tmp`, and `git diff --check`.**
- [ ] **Step 9: Verify current branch is `feat/handwritten-accent-responsive-v2` and tracked working tree is clean.**
