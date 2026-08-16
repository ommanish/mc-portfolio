#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLASSIC_REF="${CLASSIC_REF:-16a748974a2f2ecc98e22c9849c6a87c52e4ae3d}"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/mc-portfolio-experiment.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

CLASSIC_SRC="$TMP/classic-src"
CLASSIC_OUT="$TMP/classic-dist"
ADAPTIVE_OUT="$TMP/adaptive-dist"
mkdir -p "$CLASSIC_SRC" "$CLASSIC_OUT" "$ADAPTIVE_OUT"

cd "$ROOT"

git cat-file -e "${CLASSIC_REF}^{commit}" 2>/dev/null || {
  echo "Classic ref $CLASSIC_REF is unavailable. Checkout must include full history."
  exit 1
}

echo "Building classic portfolio..."
git archive "$CLASSIC_REF" | tar -x -C "$CLASSIC_SRC"
(
  cd "$CLASSIC_SRC"
  npm ci --ignore-scripts
  VITE_PORTFOLIO_API_BASE="${VITE_PORTFOLIO_API_BASE:-}" \
  VITE_TURNSTILE_SITE_KEY="${VITE_TURNSTILE_SITE_KEY:-}" \
    npm run build
  cp -R dist/. "$CLASSIC_OUT/"
)

echo "Building adaptive portfolio at /new/..."
VITE_PORTFOLIO_API_BASE="${VITE_PORTFOLIO_API_BASE:-}" \
VITE_TURNSTILE_SITE_KEY="${VITE_TURNSTILE_SITE_KEY:-}" \
  "$ROOT/node_modules/.bin/vite" build --base=/new/ --outDir "$ADAPTIVE_OUT"

rm -rf "$ROOT/dist"
mkdir -p "$ROOT/dist/new"
cp -R "$CLASSIC_OUT/." "$ROOT/dist/"
cp -R "$ADAPTIVE_OUT/." "$ROOT/dist/new/"
rm -f "$ROOT/dist/new/CNAME"

# One privacy-safe analytics client is shared by both routes. The classic source
# is pinned to an older commit, so copy the current client explicitly.
cp "$ROOT/public/portfolio-analytics.js" "$ROOT/dist/portfolio-analytics.js"
rm -f "$ROOT/dist/new/portfolio-analytics.js"

node "$ROOT/scripts/experiment-shell.mjs" \
  "$ROOT/dist/index.html" \
  "$ROOT/dist/new/index.html" \
  "${VITE_PORTFOLIO_API_BASE:-}" \
  "${CLOUDFLARE_WEB_ANALYTICS_TOKEN:-}"

test -f "$ROOT/dist/index.html"
test -f "$ROOT/dist/new/index.html"
test -f "$ROOT/dist/portfolio-analytics.js"
grep -q 'id="adaptive-experiment-invite"' "$ROOT/dist/index.html"
grep -q 'href="/new/?from=classic"' "$ROOT/dist/index.html"
grep -q 'id="classic-experiment-return"' "$ROOT/dist/new/index.html"
grep -q 'name="robots" content="noindex,follow"' "$ROOT/dist/new/index.html"
grep -q 'id="portfolio-analytics-client"' "$ROOT/dist/index.html"
grep -q 'id="portfolio-analytics-client"' "$ROOT/dist/new/index.html"

echo "Experiment artifact ready."
