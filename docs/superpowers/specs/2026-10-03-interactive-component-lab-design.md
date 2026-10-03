# Interactive Component Lab — Design Spec

Date: 2026-10-03
Status: Proposed for implementation review

## Summary

Transform the current motion-lab page into a practical **Interactive Component Lab**: one standalone page containing 12 real, working CSS/motion/UI examples that developers can preview, inspect, copy, and recreate with AI-assisted coding tools.

This spec supersedes the earlier fictional AI Command Center product-story framing for the Lab page. The existing working **Stacked Card Scroll Animation** becomes example 01 and is preserved as the first proof of the new system.

The portfolio remains isolated from the Lab implementation. The portfolio only links to the Lab; the Lab continues to own its own HTML, CSS, and JavaScript under `labs/ai-command-center/` during this implementation. A route rename can be handled separately after the new Lab is working.

## Goal

Create a useful public-facing component reference where each example answers four questions immediately:

1. What does this interaction look like?
2. What prompt can I give an AI coding tool to recreate it?
3. What exact HTML/CSS/JS makes this demo work?
4. What accessibility and reduced-motion behavior should be preserved?

The Lab should feel like a curated engineering/design playground rather than a fictional product demo.

## Audience

- Frontend developers
- UI engineers
- Designers who prototype with code
- Developers using ChatGPT, Claude, Gemini, Cursor, Codex, or similar coding assistants
- Portfolio visitors evaluating frontend, interaction-design, and accessibility skills

## Core Experience Pattern

Every component example uses the same presentation contract:

**Title / technique → Live Demo → Vibe-code Prompt → HTML / CSS / JS → Copy Prompt → Copy Code → Accessibility Notes**

The live demo and displayed source must correspond to the same implementation. No pseudo-code should be shown as if it were the running example.

## Technical Direction

Use a **CSS-first** implementation model:

- CSS for layout, visual states, hover effects, sticky behavior, marquees, and simple transitions.
- Vanilla JavaScript only when the interaction requires state, observation, counters, content swapping, controls, or progressive enhancement.
- GSAP only for examples where native CSS/JS would materially reduce the quality or clarity of the demonstration.
- No React dependency inside the Lab.
- No scroll-jacking.
- Each motion-heavy example must provide a `prefers-reduced-motion` behavior that preserves content and interaction.

## Example System Architecture

The current single hard-coded example should evolve into a small reusable example system.

Recommended structure:

```text
labs/ai-command-center/
  index.html
  css/
    base.css
    components.css
    motion.css
    examples.css
  js/
    app.js
    accessibility.js
    theme.js
    motion.js
    examples/
      registry.js
      stacked-cards.js
      text-reveal.js
      word-reveal.js
      horizontal-carousel.js
      marquee.js
      scroll-progress.js
      sticky-content-swap.js
      image-mask-reveal.js
      hover-cards.js
      metric-counter.js
      accordion.js
      parallax-hero.js
```

`registry.js` owns shared example-shell behavior while each example module owns its actual prompt, demo markup, source snippets, initialization logic, teardown if needed, and accessibility notes.

The shared shell owns only repeated presentation concerns:

- example number / title / technology label
- demo container
- prompt panel
- HTML/CSS/JS tabs
- copy buttons
- accessibility notes

It must not hide the actual source of an example behind generic pseudo-code.

## Page Structure

### Hero

Rename visible branding to **Interactive Component Lab**.

Suggested one-line purpose:

> A practical CSS and motion lab where developers can explore live components, inspect real code, and reuse the prompts in their own AI-assisted coding workflow.

The hero should make the page purpose obvious without requiring the visitor to scroll through a fictional product story.

### Example navigation

Add a lightweight jump-navigation/index near the top so visitors can move directly to an example. It should remain keyboard accessible and use normal anchors.

### Component examples

Render the 12 examples as independent sections on one page. Each section should remain understandable if JavaScript enhancement fails.

## Twelve Examples

### 01. Stacked Card Scroll

Technology: CSS

Existing proof-of-concept retained.

Demonstrates:
- sticky stacking
- progressive visual hierarchy
- contained scroll demo
- reduced-motion fallback to normal vertical cards

### 02. Text Reveal on Scroll

Technology: CSS + IntersectionObserver

Demonstrates:
- entry reveal triggered when text enters viewport
- opacity/translate treatment
- conservative replay behavior
- content remains visible without JavaScript

### 03. Word-by-Word Text Reveal

Technology: CSS + vanilla JS

Demonstrates:
- progressively revealed words
- semantic source text preserved for assistive technology
- decorative word wrappers hidden from screen readers if duplication is used

### 04. Horizontal Scroll Carousel

Technology: CSS + vanilla JS

Demonstrates:
- horizontal card track
- next/previous controls
- keyboard operation
- no forced page-scroll hijacking
- responsive overflow behavior

### 05. Infinite Marquee

Technology: CSS

Demonstrates:
- seamless repeated content movement
- duplicate decorative track handling
- pause/reduced-motion fallback
- optional hover/focus pause behavior

### 06. Scroll Progress Story

Technology: CSS + vanilla JS

Demonstrates:
- section reading progress
- progress indicator tied to actual scroll position
- content-first structure when JavaScript is unavailable

### 07. Sticky Content Swap

Technology: CSS + vanilla JS

Demonstrates:
- sticky visual area
- content change based on active section
- normal stacked layout on smaller screens and reduced motion

### 08. Image Mask Reveal

Technology: CSS + GSAP

Demonstrates:
- mask/clip reveal
- sequencing with GSAP
- graceful static image fallback when GSAP is unavailable
- reduced-motion instant reveal

### 09. Interactive Hover Cards

Technology: CSS

Demonstrates:
- pointer hover affordances
- equivalent keyboard-focus state
- layered transforms/depth without making content inaccessible
- touch-safe behavior

### 10. Animated Metric Counter

Technology: vanilla JS

Demonstrates:
- counting values when visible
- semantic final value present in DOM
- reduced motion jumps directly to final value
- formatting support for percentage or compact values

### 11. Accessible Animated Accordion

Technology: CSS + vanilla JS

Demonstrates:
- semantic buttons
- `aria-expanded` / controlled panels
- smooth height animation as enhancement
- keyboard-first interaction
- functional content with animation disabled

### 12. Parallax / Motion Hero

Technology: GSAP

Demonstrates:
- layered hero depth
- restrained parallax
- no essential information placed only in moving decorative layers
- reduced-motion static composition
- safe fallback when GSAP is blocked

## Prompt Contract

Each example includes a high-quality prompt intended to be portable across AI coding tools.

Every prompt should state:

- the desired visual/interaction behavior
- semantic HTML expectations
- technology preference (CSS-first, JS only if needed, GSAP only where specified)
- responsive behavior
- keyboard requirements when interactive
- reduced-motion expectation
- explicit instruction to avoid scroll-jacking when relevant
- enough design intent to reproduce the behavior without coupling to this repository

Prompts should not reference private project context or internal class names unless necessary for the example.

## Code Contract

Each example exposes real working source in HTML, CSS, and JS tabs.

Rules:

- HTML tab contains the markup used by the demo or an exact isolated equivalent.
- CSS tab contains all example-specific styles necessary to reproduce the behavior.
- JS tab contains all example-specific behavior. If JS is not required, say so explicitly.
- GSAP examples identify the dependency and show the initialization code.
- Copy Code copies the active tab.
- Copy Prompt copies the complete example prompt.
- Code output must escape safely and never execute from the code viewer.

## Accessibility Requirements

All examples must meet the following baseline:

- keyboard-operable controls
- visible focus states
- semantic controls instead of clickable `div`s
- accessible names for controls
- logical DOM order
- no information available only on hover
- no information available only through motion
- `prefers-reduced-motion` respected by every motion-heavy demo
- animations must not block reading or navigation
- decorative duplicates hidden from assistive technology
- live regions used only when a status change genuinely needs announcement

The Lab's existing theme, contrast, pause, and motion controls may remain if they continue to behave coherently with the new component examples.

## Responsive Requirements

The Lab must work at approximately:

- 320px mobile width
- 390px common mobile width
- tablet layouts
- standard desktop
- wide desktop

Each demo may simplify on mobile rather than forcing the desktop effect into a narrow viewport.

Examples with sticky or horizontal behavior must provide a natural stacked/scrollable alternative where appropriate.

No page-level horizontal overflow is allowed.

## Performance and Loading

- Example modules should be lightweight.
- Avoid loading GSAP-dependent behavior for examples that do not use GSAP.
- Existing CDN GSAP dependency may be reused initially, with static fallback if unavailable.
- Avoid large image/video assets for the first implementation; use gradients, local placeholders, or small optimized assets where possible.
- Initialization should be scoped per example so one failed example does not prevent the others from rendering.

## Graceful Degradation

Without JavaScript:

- page title, descriptions, prompts, accessibility notes, and core demo content remain readable
- CSS-only examples still work where possible
- JS-required examples show a useful static state

If GSAP fails:

- GSAP examples remain readable in a static state
- other examples continue functioning

With reduced motion:

- sticky/scrub/parallax/counter animation is removed or simplified
- essential state remains visible
- no example becomes harder to understand

## Testing Strategy

### Contract tests

Add source/structure tests that verify:

- 12 registered examples
- each example has title, prompt, HTML/CSS/JS source, and accessibility notes
- each example renders through the shared shell
- the Stacked Card example remains present
- visible branding is `Interactive Component Lab`

### Unit/behavior tests

Where practical, test reusable utilities such as:

- code-tab switching
- copy button source selection
- accordion state
- counter final-state handling
- example registry uniqueness

### Browser tests

Playwright should verify at minimum:

- all 12 examples render
- anchor navigation works
- code tabs switch content
- Copy Prompt and Copy Code controls are available
- accordion is keyboard operable
- carousel controls are keyboard operable
- reduced-motion mode preserves content
- 390px viewport has no horizontal overflow
- GSAP blocked still leaves all content readable

## Portfolio Integration

The portfolio remains unchanged except for the Lab entry wording if needed.

Recommended portfolio label:

**Interactive Component Lab**

Recommended summary:

> Live CSS, motion, and interaction examples with real source code and reusable prompts for AI-assisted development.

The portfolio must not import Lab styles or runtime JavaScript.

## Migration from Current Branch State

1. Preserve the existing working Stacked Card example.
2. Rename visible Lab framing from AI Command Center to Interactive Component Lab.
3. Remove or retire fictional Pulseframe/AI-product storytelling content from the final Lab experience rather than presenting it as the Lab's primary purpose.
4. Introduce the shared example registry/shell.
5. Move Stacked Card into that shared system.
6. Add examples 02–12 one at a time with tests.
7. Keep the standalone build/copy behavior so the portfolio remains isolated.

The route/path rename is intentionally not part of this spec. The current `/labs/ai-command-center/` route may remain during implementation to avoid deployment churn. A route rename can be handled as a separate compatibility/deployment decision after the new Lab is working.

## Success Criteria

The design is successful when a visitor can open the Lab and, without explanation:

- understand that it is a collection of reusable interactive frontend examples
- preview 12 working examples
- copy the real code for each example
- copy a well-formed prompt for recreating each example with an AI coding tool
- understand the accessibility/reduced-motion considerations
- use the page on mobile and keyboard
- still access useful content if advanced motion libraries fail

The final Lab should demonstrate frontend craft, interaction design, accessible motion, and practical AI-assisted development workflow in one cohesive page.
