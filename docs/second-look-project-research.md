# Second Look — portfolio research

Reviewed November 14, 2026. Portfolio base: `9c5dc7b556ca578bb6cf94a0815caf93c437fbdc`, matching GitHub main at review time.

## Sources

- Published product site: https://ommanish.github.io/second-look-download/
- Public download repository: https://github.com/ommanish/second-look-download
- App source (private): https://github.com/ommanish/second-look
- Initial review: root-level v0.3.0 files; superseded by the current source review below.
- Reviewed download files: index.html and assets/downloads directory listings.

## Current source and release

Rechecked after the repository was reorganized. The current source is under `extension/`; `extension/manifest.json` and the public site both identify v0.10.0. The earlier v0.3.0 mismatch is resolved.

Reviewed current README.md, CHANGELOG.md, extension/manifest.json, docs/CHECKS.md, docs/ARCHITECTURE.md, docs/PRIVACY.md, docs/TESTING.md, and docs/ROADMAP.md. The documentation catalogs 45 checks covering accessibility, readability, forms, navigation, structure, layout, content, and go-live readiness.

The framework-free Manifest V3 extension uses a popup, service worker, injected analyzer, report dashboard, and shared license module. It reviews the current tab, another tab, or a typed address. Reports include screenshot pins, severity-ranked recommendations, Nielsen heuristic mapping, a go-live checklist, screenshot enlargement, and print/Save as PDF. Vision views cover blur, low contrast, glare, and four color-blindness simulations on the page or screenshot.

The latest ten reports remain in local storage. Trial start and license fingerprint also use Chrome sync when enabled. Network checks send credential-free HEAD requests to at most 30 same-origin links plus favicon, robots, and sitemap paths. Query-string, download, and action-like URLs are skipped. Current permissions remain activeTab, scripting, storage, and optional host access.

The source documents a seven-day trial with personally supplied keys. Installation is via ZIP/Load unpacked. Chrome Web Store publication is pending. AI task walks, site-wide review, comparisons, and team features are roadmap items, not current features.

## Validation boundaries

The repository reports Chromium end-to-end testing against a seeded problem page, not real websites. Edge/Brave, real toolbar activation, browser permission prompts, large pages, and multilingual pages remain documented gaps. The test guide says many outcomes are printed for inspection rather than asserted; its test pass status alone should not be described as complete behavioral validation. These extension tests were not independently rerun during portfolio editing.

The actual report image is referenced from https://ommanish.github.io/second-look-download/assets/report.png and depends on that site's availability. The private app repository is retained for maintainer traceability rather than exposed as a public source-code CTA.

## Portfolio integration

- Eighth case-study card and `/case-studies/second-look-ux-review` detail route.
- Project framing, decisions, features, stack, installation, privacy, limitations, proposed measurement, and next steps.
- Public download-site and repository links; actual screenshot labeling instead of concept-board labeling.
- Static deployment route added to the existing build script.
- No invented user research, adoption, revenue, or time-saving metrics.

## Validation

- App suite: 34 tests passed.
- Case-study suites: 5 tests passed, including the new product link, image description, release note, and card.
- Vite production build and git diff whitespace checks passed using Node 22.23.2.
- Visual desktop/mobile review could not run: this environment blocks the local preview server from listening on a port. The full deployment wrapper, which installs the historical classic site's dependencies, was not run.
