#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLASSIC_REF="${CLASSIC_REF:-16a748974a2f2ecc98e22c9849c6a87c52e4ae3d}"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/mc-portfolio-build.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
CLASSIC_SRC="$TMP/classic-src"
CLASSIC_OUT="$TMP/classic-dist"
ADAPTIVE_OUT="$TMP/adaptive-dist"
mkdir -p "$CLASSIC_SRC" "$CLASSIC_OUT" "$ADAPTIVE_OUT"
cd "$ROOT"
git cat-file -e "${CLASSIC_REF}^{commit}" 2>/dev/null || { echo "Classic ref $CLASSIC_REF is unavailable. Checkout must include full history."; exit 1; }
echo "Building preserved classic portfolio at /classic/..."
git archive "$CLASSIC_REF" | tar -x -C "$CLASSIC_SRC"
(
  cd "$CLASSIC_SRC"
  npm ci --ignore-scripts
  VITE_PORTFOLIO_API_BASE="${VITE_PORTFOLIO_API_BASE:-}" VITE_TURNSTILE_SITE_KEY="${VITE_TURNSTILE_SITE_KEY:-}" npm run build -- --base=/classic/
  cp -R dist/. "$CLASSIC_OUT/"
)
echo "Building adaptive portfolio as the default at /..."
VITE_PORTFOLIO_API_BASE="${VITE_PORTFOLIO_API_BASE:-}" VITE_TURNSTILE_SITE_KEY="${VITE_TURNSTILE_SITE_KEY:-}" "$ROOT/node_modules/.bin/vite" build --base=/ --outDir "$ADAPTIVE_OUT"
rm -rf "$ROOT/dist"
mkdir -p "$ROOT/dist/classic"
cp -R "$ADAPTIVE_OUT/." "$ROOT/dist/"
cp -R "$CLASSIC_OUT/." "$ROOT/dist/classic/"
rm -f "$ROOT/dist/classic/CNAME"
if [ -d "$ROOT/public/case-studies" ]; then mkdir -p "$ROOT/dist/case-studies"; cp -R "$ROOT/public/case-studies/." "$ROOT/dist/case-studies/"; fi
cp "$ROOT/public/portfolio-analytics.js" "$ROOT/dist/portfolio-analytics.js"
rm -f "$ROOT/dist/classic/portfolio-analytics.js"
node "$ROOT/scripts/experiment-shell.mjs" "$ROOT/dist/index.html" "$ROOT/dist/classic/index.html" "${VITE_PORTFOLIO_API_BASE:-}" "${CLOUDFLARE_WEB_ANALYTICS_TOKEN:-}"
mkdir -p "$ROOT/dist/new"
cat > "$ROOT/dist/new/index.html" <<'EOF'
<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="robots" content="noindex,follow"/><link rel="canonical" href="https://manishchawla.com/"/><meta http-equiv="refresh" content="0; url=/"/><title>Portfolio moved</title><script>(()=>{const target="/"+window.location.search+window.location.hash;window.location.replace(target);})();</script></head><body><p>This portfolio has moved to <a href="/">manishchawla.com</a>.</p></body></html>
EOF
for slug in adaptive-ai-portfolio website-experience-refresh accessibility-intelligence ai-assisted-page-builder web-experience-quality-score; do
  route_dir="$ROOT/dist/case-studies/$slug"; mkdir -p "$route_dir"; cp "$ROOT/dist/index.html" "$route_dir/index.html"
done
test -f "$ROOT/dist/index.html"
test -f "$ROOT/dist/classic/index.html"
test -f "$ROOT/dist/new/index.html"
grep -q '/assets/' "$ROOT/dist/index.html"
grep -q '/classic/assets/' "$ROOT/dist/classic/index.html"
grep -q 'name="robots" content="noindex,follow"' "$ROOT/dist/classic/index.html"
grep -q 'href="/?from=classic"' "$ROOT/dist/classic/index.html"
grep -q 'id="portfolio-analytics-client"' "$ROOT/dist/index.html"
grep -q 'id="portfolio-analytics-client"' "$ROOT/dist/classic/index.html"
grep -q 'window.location.replace(target)' "$ROOT/dist/new/index.html"
echo "Adaptive-default production artifact ready."
