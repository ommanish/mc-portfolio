# Handwritten Accent v1

**Status:** local-review  
**Date:** 2026-08-14  
**Parent branch:** `feat/adaptive-infographics-local`  
**Parent commit:** `3f8732518b70d490cc1de289c70ddfff26bc6477`  
**Experiment branch:** `feat/handwritten-accent-v1`  
**Production:** not deployed

## Purpose

Add a vibrant, human layer to the adaptive portfolio while keeping the premium/editorial design primary.

## Approved scope

Accent-only handwritten treatment, approximately 10–15% of the visual language.

Used in:
- Hero
- Web Delivery infographic
- Career + Skills infographic
- Web Experience section header
- AI in Practice section header
- Experience section header

Not used in navigation, body copy, core heading typography, Contact fields, timeline job titles, buttons, privacy/legal text, or Lens option labels.

## Reusable system

`src/components/HandwrittenAccent.jsx` supports underline, circle, arrow, and marker treatments using inline SVG + CSS.

## Motion

- one-time draw-on strokes
- subtle note entrance
- no looping animation
- no layout-shifting animation
- reduced-motion users receive static accents

## Trust / content

Decorative only. No new career facts, scores, percentages, or claims. Canonical content, Lens behavior, section order, and Contact behavior remain unchanged.

## Branch lineage

`main → feat/adaptive-infographics-local → feat/handwritten-accent-v1`

The infographic-only parent branch remains independently available.
