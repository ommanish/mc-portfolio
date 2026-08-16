# Handwritten Responsive System Design

## Goal
Keep the handwritten personality while making every accent feel intentionally attached at desktop, tablet, and mobile.

## Core principle
Handwritten accents are secondary decoration. They must support the content, never float independently, compete with main typography, or become unreadable when space is tight.

## Responsive visual vocabulary
- Desktop: underlines, circles, curved arrows, marker strokes, short notes.
- Tablet: underlines, circles, shorter arrows, restrained notes.
- Mobile: primarily underline + short note; a short arrow only when guaranteed space exists.
- On mobile avoid floating arrows, empty-space circles, long callouts, tiny compressed notes, and viewport-edge annotations.
- If an accent cannot remain readable and attached, simplify or hide it.

## Hero
Mobile keeps the canonical headline, one attached underline/note, and no floating right-side arrow.

## Section headers
Mobile accents stay in normal flow below headings; circles/markers may simplify to underlines.

## Web Delivery
Strategy → Design → Build → QA → Launch → Optimize remains unchanged. Mobile annotations live inside their stage row; QA simplifies to underline/note and Launch may hide.

## Career / 17+
Desktop can keep the coordinate visual. Mobile uses a compact 17+ anchor with readable UI / WEB / CMS / AI labels.

## Timeline / Case Studies / Lens / Contact
V2 adds restrained accents only after alignment passes. Mobile uses underline + inline note.

## Alignment architecture
`HandwrittenAccent` owns drawing, note, note anchor, type, and responsive simplification. Parent components position the wrapper only.

## Responsive validation
Chrome at 375×812, 768×900, 1280×900, dark + light. Check overflow, viewport containment, note-to-art distance, interactive overlap, readable note size, and expected mobile simplification. Capture screenshots.

## Branch strategy
```text
feat/adaptive-infographics-local
└─ feat/handwritten-accent-v1
   └─ fix/handwritten-accent-alignment-v1
      └─ feat/handwritten-accent-v2-more
```

## Safety
Local only. No push, PR, merge, deployment, or branch deletion. Canonical content and Lens behavior stay unchanged.
