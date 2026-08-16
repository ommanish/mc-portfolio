# Handwritten Accent Responsive v2 — Design Spec

## Goal

Restore the handwritten-accent direction the user preferred, while fixing the responsive problems that made the previous mobile version feel broken or detached.

The visual personality stays expressive and human, but the accent vocabulary changes by screen size so annotations remain attached to the content they support.

## Direction

**A2 — responsive handwritten vocabulary**

Desktop keeps the richer handwritten language.

Tablet uses a reduced version.

Mobile uses a simplified system built mostly from inline underlines and short notes.

The canonical portfolio content, section order, Lens behavior, Contact behavior, and production/classic portfolio remain unchanged.

## Branch strategy

Preserve all existing experiments.

Current handwritten checkpoint:
`fix/handwritten-accent-alignment-v1` at commit `67fd681`

New local experiment branch:
`feat/handwritten-accent-responsive-v2`

The sketch-icon experiment branch remains preserved as a separate comparison branch and is not merged into this work.

No branch deletion.

## Visual vocabulary by breakpoint

### Desktop — 1280px and wider

Allowed:
- hand-drawn underline
- rough circle
- short curved arrow
- marker stroke
- short handwritten note

Rules:
- accents must visually attach to a nearby word, heading, stage, or content block
- no annotation may exist only as decoration in empty space
- no long floating arrows across large areas
- no continuous animation

### Tablet — around 768px

Allowed:
- underline
- restrained circle
- short arrow when enough local space exists
- short note

Rules:
- fewer accents than desktop
- arrows shorten
- notes stay closer to their targets
- circles may become underlines if space is constrained
- no viewport-edge anchoring

### Mobile — around 375px

Primary vocabulary:
- underline
- short handwritten note directly below or beside its target

Optional:
- very short pointer only when fully contained in the target block

Avoid:
- floating arrows
- circles in empty space
- long callouts
- tiny annotations
- annotations positioned relative to the viewport edge
- decorative elements that become detached from their target

If an accent does not have enough space, simplify it or hide it.

## Typography

Core UI typography remains unchanged.

Handwritten notes:
- use the existing system cursive stack
- remain secondary to content
- minimum readable mobile size around 13px
- no external font dependency

## Motion

Use restrained one-time motion only:
- SVG draw-on
- short fade/translate
- connector trace where appropriate

Typical duration:
350–700ms

No:
- looping motion
- bouncing
- constant floating
- spinning

`prefers-reduced-motion` renders the final state immediately.

## Hero

Canonical Hero headline remains unchanged.

### Desktop
- one handwritten underline attached to the key closing phrase
- one short supporting note such as `built to ship`
- optional short arrow only if it clearly points to an existing Hero element

### Tablet
- retain underline + note
- remove or shorten the arrow

### Mobile
- no floating Hero arrow
- one underline attached directly to the relevant phrase
- one short note directly below the headline/content area
- no large reserved decorative empty area

## Career / 17+ visual

Desktop may keep the richer capability coordinate.

Mobile must not squeeze the desktop radial/cross treatment.

Mobile becomes a compact stacked presentation:
- `17+` remains prominent
- UI
- WEB
- CMS
- AI

These labels remain readable and visually grouped.

## Section headers

Selected section headers may keep handwritten accents.

Desktop:
- underline, circle, or marker allowed

Tablet:
- underline or restrained marker preferred

Mobile:
- accent sits inline below the heading
- circles simplify to underlines where necessary
- no absolutely positioned floating mark

## Web Experience / Web Delivery

Verified delivery order remains:

Strategy → Design → Build → QA → Launch → Optimize

Handwritten accents support the flow rather than decorate around it.

### QA
Desktop/tablet:
- restrained emphasis around or near the QA stage
- note such as `validate here`

Mobile:
- QA note lives inside the QA stage row
- use underline + short note
- never anchor to the right viewport edge

### Launch
Desktop/tablet:
- short launch pointer or emphasis allowed

Mobile:
- convert to inline underline/note or hide if unnecessary

## Infographics

Existing Web Delivery and Career/Skills infographics remain the primary information graphics.

Handwritten accents act as a secondary expressive layer only.

No infographic structure or verified copy is rewritten.

## Timeline

Use only selected milestone accents.

Suggested emphasis:
- Salesforce — `web experience`
- TechDemocracy / Quantious — `page-builder delivery`
- Genpact — `enterprise scale`
- GE Corporate — `frontend foundation`

Desktop/tablet:
- short pointer, marker, or underline

Mobile:
- short underline/label inside the milestone row

No floating timeline annotations outside the row.

## Case Studies

Maximum one handwritten accent per case study.

Desktop:
- restrained callout such as `real delivery`, `trade-offs matter`, or `quality through launch`

Mobile:
- underline + short note only

The case study content itself remains unchanged.

## Lens guidance

A small `start here` accent may support the Lens recommendation/guidance.

Desktop/tablet:
- short arrow or underline

Mobile:
- inline underline/note only

It must not interfere with Lens controls or accessible labels.

## Contact

One restrained handwritten note:
`let’s build something useful`

Placement:
- below or beside Contact intro copy
- outside all form controls
- never over input fields, Turnstile, buttons, or status messages

Mobile:
- normal-flow placement only

## Component architecture

`HandwrittenAccent` remains the reusable primitive and owns:
- SVG drawing
- note rendering
- accent type
- note position
- breakpoint simplification
- reduced-motion behavior

Suggested responsive interface:

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

Parent components position the complete accent wrapper relative to their own content.

Parents do not position the note independently from the drawing.

## Responsive alignment rules

Every visible handwritten accent must:
- remain within the viewport horizontally
- stay visually attached to its target
- keep its note close to the drawing/target
- avoid significant overlap with interactive controls
- remain readable
- simplify on mobile when desktop geometry cannot fit cleanly

## Browser validation

Use real Chrome at:

- 375 × 812
- 768 × 900
- 1280 × 900

Test each in:
- dark mode
- light mode

Capture full-page screenshots.

Checks:
- no horizontal overflow
- no handwritten note leaves the viewport
- no significant overlap with buttons, links, inputs, or form controls
- minimum readable handwritten note size
- mobile Hero floating arrow is absent
- mobile career coordinate uses the compact layout
- mobile QA annotation remains inside the QA stage
- section-header annotations are normal-flow on mobile
- notes remain close to their associated drawing/target

## Experiment records

Save:
- design spec
- implementation plan
- responsive layout report
- full-page screenshots
- experiment summary

Keep all previous handwritten and sketch-icon experiment records for comparison.

## Safety

This remains a local experiment.

Do not:
- push
- create a PR
- merge
- deploy
- delete branches
- modify the classic production route
- rewrite canonical portfolio content
- change Lens personalization behavior
