# Final UI Polish — Change Reason + Follow Me

## Goal

Make the last two visible UI details feel clean and production-ready before the adaptive portfolio is considered for live deployment.

This pass is intentionally narrow.

## 1. Change reason control

Keep the current outlined secondary-button treatment.

Fix:
- remove the vertical divider/artifact through the text
- use `inline-flex`
- vertically center icon and label
- keep the return/change icon at approximately 16px
- use approximately 8px gap between icon and label
- keep `Change reason` on one line
- maintain approximately 44px control height
- retain a restrained warm/gold border
- use a subtle hover background/border treatment
- no translate, bounce, or motion on hover
- maintain clean alignment in dark mode, light mode, desktop, tablet, and mobile

Visual result:

`↶  Change reason`

No divider. No text overlap.

## 2. Follow me

Do not use handwritten treatment here.

Use `Follow me` as a small, quiet footer/social label.

Fix:
- align `Follow me` with the first social link/icon
- approximately 12–13px
- medium weight
- muted footer text color
- approximately 8px space below the label before social links
- keep label and social links in one responsive block
- no floating positioning
- no arrow
- no divider
- no decorative handwriting
- mobile keeps the label and social links together rather than separating them

## Scope

Only modify the existing Change Reason and footer/social presentation.

Do not change:
- Hero
- handwritten accents
- `18+`
- infographics
- Experience
- Lens behavior
- Contact reason logic
- form behavior
- canonical content
- section order
- classic production route

## Responsive verification

Check:
- 375 × 812
- 768 × 900
- 1280 × 900

In dark and light mode.

Verify:
- Change reason has no divider/artifact
- icon and text are vertically centered
- label stays on one line
- no text/control overlap
- Follow me aligns with social links
- Follow me and social links remain grouped on mobile
- no horizontal overflow

## Safety

Work remains local until verification passes and the final screenshots are reviewed.

No push, PR, merge, deployment, or branch deletion during this polish step.
