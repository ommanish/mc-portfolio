# Handwritten Owner-Alignment Fix — Design Spec

## Goal

Fix the visible handwritten alignment problems in the approved A2 direction without redesigning the portfolio or adding new decoration.

## Root cause

The current problem is not the handwritten style itself. Several accents are still positioned as floating decoration using fixed/absolute geometry. Their drawing and note can therefore drift away from the content they are meant to explain, collide with body copy or connector lines, or surround empty space.

The fix is structural:

> Every handwritten accent must have an obvious visual owner.

If an accent cannot remain attached to that owner at a breakpoint, it simplifies or disappears.

## Scope

Alignment-only changes for the four problems visible in the review screenshots:

1. Hero underline / note / arrow
2. QA-style `validate here` annotation
3. AI `human in the loop` marker
4. Experience `built over time` annotation

No new icons, sections, content architecture, Lens behavior, or production changes.

## Branch strategy

Preserve the current A2 experiment.

Current experiment:
`feat/handwritten-accent-responsive-v2`

Create a separate local fix branch:
`fix/handwritten-accent-owner-alignment-v1`

If the current A2 branch contains uncommitted experiment work, checkpoint only known A2 files before creating the fix branch.

Do not delete any branch.

## 1. Hero

### Current problem

The underline belongs to the headline, but its handwritten note drops into the body-copy area. The orange arrow is detached from a meaningful target at narrower widths.

### Fix

Desktop:
- underline stays directly attached to the closing headline phrase
- note becomes `built to ship`
- note stays directly below the underline
- desktop arrow may remain only if it has a clear nearby target

Tablet and mobile:
- hide the orange floating arrow
- underline + note become one normal-flow unit
- no reserved decorative height between headline and description
- body paragraph begins after the complete accent unit

### Success condition

The note never overlaps the description and the accent reads visually as part of the headline.

## 2. `validate here` / QA annotation

### Current problem

The circle, note, node, and horizontal process connector occupy the same area, making the annotation unreadable.

### Fix

Desktop:
- QA emphasis can use a restrained circle only when it surrounds the actual QA content/node

Tablet/mobile:
- convert the QA accent to underline + short note
- place it inside the QA stage content column
- use normal flow
- connector lines remain behind/outside the annotation row
- never anchor the accent to the viewport edge

### Success condition

`validate here` is readable and clearly belongs to QA; no connector passes through the note or drawing.

## 3. `human in the loop`

### Current problem

The purple marker and note sit in a large independent empty band instead of feeling attached to the AI content.

### Fix

Desktop:
- keep the marker treatment but place it immediately under the relevant AI heading/copy

Tablet/mobile:
- normal-flow marker/underline directly after the content it supports
- substantially reduce vertical empty space
- no absolute positioning

### Success condition

A visitor can immediately tell which AI statement the annotation belongs to.

## 4. `built over time`

### Current problem

The rough circle currently surrounds empty space.

### Fix

Move the annotation's visual owner from the section-header whitespace to the actual `17+` experience anchor.

Desktop:
- rough circle may wrap/emphasize `17+`
- `built over time` sits directly with that emphasis

Tablet/mobile:
- simplify to underline + short note attached to `17+`
- no empty standalone circle between the heading and timeline

### Success condition

The circle or underline emphasizes `17+`; it never surrounds an empty area.

## Shared positioning rule

Parent components position the complete `HandwrittenAccent` wrapper.

The SVG drawing and note are not independently positioned by parent components.

For normal-flow responsive accents:
- `position: relative` or `static`
- width is constrained by the content owner
- note follows drawing inside the same wrapper
- margin creates spacing; `top/right/bottom/left` do not create layout

Absolute positioning remains permitted only for a desktop decorative accent that has a stable local containing block and passes the geometry test.

## Breakpoint behavior

### Desktop — 1280px
Rich treatment is allowed when the accent remains clearly attached.

### Tablet — 768px
- Hero arrow hidden
- circles simplified when necessary
- annotations move closer to owners
- no large decorative bands

### Mobile — 375px
- underline + short note is the default
- normal flow
- no floating arrows
- no empty circles
- no viewport-edge placement

## Browser validation

Use Chrome at:

- 375 × 812
- 768 × 900
- 1280 × 900

Dark + light.

Validate:
- no horizontal page overflow
- no handwritten note outside viewport
- no note/body-copy collision
- no note/control collision
- Hero note remains above the description
- Hero arrow hidden at tablet/mobile
- QA annotation remains inside QA content owner
- process connector does not intersect QA annotation
- AI note is adjacent to its supported content
- `built over time` is attached to `17+`
- mobile annotations are normal-flow
- minimum handwritten text remains readable

Capture full-page screenshots for all six viewport/theme combinations.

## Safety

Local only.

Do not:
- push
- create a PR
- merge
- deploy
- delete branches
- modify the classic production route
- add sketch icons
- rewrite canonical portfolio content
- change Lens personalization behavior
