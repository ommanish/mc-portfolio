# AI Command Center Motion Lab — Design Spec

## Goal

Create a standalone, accessible, motion-rich Lab experience that demonstrates advanced frontend interaction design without risking regressions to the existing portfolio.

The experience is a fictional AI Workspace / Command Center concept. It must be clearly presented as a concept/lab project, not client work.

## Isolation

The Lab must be operationally independent from the portfolio.

- Portfolio only links to the Lab.
- Lab must not import portfolio React components, styles, or runtime code.
- Lab CSS/JS must not load on the portfolio homepage.
- A Lab failure must not break the portfolio.
- Production target: `/labs/ai-command-center/`.

## Experience Structure

Use a hybrid cinematic + modular architecture: one seamless story for visitors, but independent internal motion chapters.

1. **Welcome / Product Introduction** — light theme, calm motion, clear hierarchy.
2. **Ask the AI** — prompt interface assembles around user intent.
3. **AI Processing** — transition into dark mode; data streams, agents, workflow paths.
4. **Workspace Expansion** — panels slide, resize, and reorganize into a responsive command center.
5. **Human + AI Collaboration** — tasks, approvals, comments, decision points.
6. **Live Intelligence** — metrics, graphs, activity, recommendations, scroll-synced motion.
7. **Final Command Center** — hybrid composition where the full interface comes together.
8. **Accessibility / Experience Controls** — theme, reduced motion, contrast, pause/resume, and an explanation of how the experience adapts.

Each chapter should own its motion timeline and degrade independently.

## Visual Direction

Use a premium hybrid light/dark system rather than a generic sci-fi aesthetic.

### Light sections

- off-white / neutral backgrounds
- high-contrast dark text
- subtle borders and layered surfaces
- restrained gradients
- generous spacing and product-focused composition

### Dark sections

- deep charcoal / navy rather than pure black
- luminous but controlled data accents
- subtle glass surfaces
- restrained glow around active AI states
- increased visual depth for cinematic moments

The same component language, typography, spacing, and interaction patterns must survive both themes so the product feels continuous.

## Motion Language

Motion must communicate hierarchy, change, context, attention, or system state. Avoid decorative movement with no UX purpose.

### Functional motion

- hover/focus feedback
- state transitions
- button/input response

### Expressive motion

- card transitions
- panel reveals
- theme transitions
- staggered UI assembly

### Cinematic motion

- pinned storytelling scenes
- interface transformation
- AI orchestration
- scroll-linked progress

Signature transition: the light workspace accepts a prompt, the interface dims, AI processing begins, the experience transitions into a dark orchestration scene, and the panels expand into the final command center.

## Interaction Model

- native scrolling by default
- limited pinning only where it strengthens the story
- no aggressive scroll-jacking
- keyboard-operable controls
- user can pause/resume non-essential motion
- user can manually choose light/dark theme
- user can enable reduced motion
- user can enable high contrast
- manual user preference overrides automatic story-driven theme changes

Suggested persistent settings:

- Theme: Auto / Light / Dark
- Motion: Full / Reduced
- Contrast: Standard / High
- Animation: Pause / Resume

Settings should persist for the session.

## Accessibility Requirements

Accessibility is a first-class requirement.

- respect `prefers-reduced-motion`
- provide explicit reduced-motion control
- full keyboard navigation
- visible focus states
- semantic landmarks and heading hierarchy
- strong contrast in light and dark modes
- no information conveyed by motion alone
- no flashing/strobing effects
- decorative motion hidden from assistive technology
- live regions only for meaningful dynamic status changes
- logical DOM/tab order independent of visual transforms
- no hover-only interactions
- mobile/touch targets sized appropriately
- content remains usable at browser zoom
- reduced-motion mode removes parallax, scrubbed transforms, and unnecessary pinning

When motion is reduced, content must remain in the same logical reading order and the full story must still be understandable.

## Mobile Behavior

Mobile is a purpose-built adaptation, not a scaled desktop scene.

- fewer simultaneous moving layers
- shorter pin durations
- less lateral movement
- simplified command-center composition
- larger touch targets
- no hover dependency
- lower animation density for performance and usability

## Technical Architecture

Use standalone HTML, CSS, and JavaScript with GSAP + ScrollTrigger.

No React dependency is required for the Lab itself.

Proposed source structure:

```text
labs/
└── ai-command-center/
    ├── index.html
    ├── css/
    │   ├── base.css
    │   ├── components.css
    │   └── motion.css
    ├── js/
    │   ├── app.js
    │   ├── motion.js
    │   ├── accessibility.js
    │   └── theme.js
    └── assets/
        ├── images/
        ├── icons/
        └── video/
```

No Lab file may import from `src/`.

## Deployment

The portfolio build must explicitly include the standalone Lab in production output:

```text
dist/
├── index.html
├── assets/
└── labs/
    └── ai-command-center/
        └── index.html
```

Production URL:

`https://manishchawla.com/labs/ai-command-center/`

The existing portfolio remains unchanged except for a deliberate Lab link added after the standalone experience is verified locally.

## Progressive Enhancement

The Lab must remain understandable if advanced motion is unavailable.

- GSAP unavailable: content still renders and remains navigable.
- JavaScript disabled: static reading order remains usable.
- reduced motion: cinematic transforms collapse to simpler transitions or static states.
- slower devices: expensive effects are reduced.
- heavy assets: lazy-load where possible.

## Testing Strategy

### Functional

- Lab URL loads independently.
- all controls work.
- theme and motion preferences behave as specified.
- no broken assets.
- Lab can fail without affecting portfolio homepage.

### Accessibility

- keyboard-only navigation
- visible focus states
- reduced-motion verification
- high-contrast verification
- semantic heading structure
- accessible labels
- no motion-only information

### Responsive

- desktop
- tablet
- mobile
- landscape mobile
- zoomed layouts

### Performance

- lazy-load heavy assets
- keep GSAP timelines scoped by chapter
- avoid unnecessary layout thrashing
- reduce animation complexity on constrained devices
- verify static fallback

## Branch and Delivery Workflow

Development branch:

`feature/motion-storytelling-lab`

Workflow:

`branch → local build → accessibility checks → responsive checks → performance checks → portfolio link → PR → CI → merge`

No direct changes to `main`.

## Out of Scope for First Version

- real AI/API calls
- authentication
- persistent user accounts
- backend services
- shared runtime with the portfolio
- abstract UI/design-system motion lab (planned as a separate follow-up project)

## Success Criteria

The first version is successful when:

1. it feels like a premium, cinematic AI product experience rather than a collection of unrelated animation demos;
2. the motion remains purposeful and understandable;
3. accessibility controls can meaningfully reduce or pause motion and preserve usability;
4. light and dark scenes feel like one coherent product system;
5. the Lab works independently at `/labs/ai-command-center/`;
6. the existing portfolio remains stable and unaffected except for the intentional link to the Lab.
