import fs from "node:fs";

const CLASSIC_ID = "adaptive-experiment-invite";
const RETURN_ID = "classic-experiment-return";
const ANALYTICS_ID = "portfolio-analytics-client";
const CF_ANALYTICS_ID = "cloudflare-web-analytics";

const classicStyle = `
<style id="adaptive-experiment-invite-style">
#${CLASSIC_ID}{
position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:9999;
display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;
width:min(360px,calc(100vw - 36px));padding:12px 14px;border:1px solid rgba(255,255,255,.35);
border-radius:18px;background:linear-gradient(135deg,rgba(24,33,52,.97),rgba(15,22,34,.97));
color:#fff;text-decoration:none;box-shadow:0 18px 52px rgba(0,0,0,.28);
backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
#${CLASSIC_ID}:hover,#${CLASSIC_ID}:focus-visible{transform:translateY(-3px);border-color:rgba(125,211,199,.75);box-shadow:0 22px 62px rgba(0,0,0,.36);outline:none}
#${CLASSIC_ID} .experiment-new{display:inline-grid;place-items:center;min-width:42px;min-height:24px;padding:0 8px;border-radius:999px;background:linear-gradient(135deg,#8ab4f8,#7dd3c7);color:#101214;font-size:10px;font-weight:900;letter-spacing:.08em}
#${CLASSIC_ID} .experiment-copy{display:grid;gap:2px;min-width:0}
#${CLASSIC_ID} strong{color:#fff;font-size:13px;line-height:1.25;letter-spacing:-.01em}
#${CLASSIC_ID} small{color:#c6cedb;font-size:11px;line-height:1.3}
#${CLASSIC_ID} .experiment-arrow{color:#7dd3c7;font-size:18px;font-weight:900}
@media(max-width:520px){#${CLASSIC_ID}{right:14px;bottom:max(14px,env(safe-area-inset-bottom));width:calc(100vw - 28px)}}
@media(prefers-reduced-motion:reduce){#${CLASSIC_ID}{transition:none}}
</style>`;

const classicMarkup = `
<a id="${CLASSIC_ID}" href="/new/?from=classic" data-experiment="classic-to-adaptive-v1" aria-label="Try the new adaptive portfolio experience">
<span class="experiment-new">NEW</span>
<span class="experiment-copy"><strong>Try the new adaptive experience</strong><small>See the portfolio through a Lens</small></span>
<span class="experiment-arrow" aria-hidden="true">→</span>
</a>`;

const adaptiveStyle = `
<style id="classic-experiment-return-style">
#${RETURN_ID}{
position:fixed;left:max(18px,env(safe-area-inset-left));bottom:max(18px,env(safe-area-inset-bottom));z-index:9999;
display:inline-flex;align-items:center;min-height:42px;padding:0 13px;border:1px solid rgba(255,255,255,.18);
border-radius:999px;background:rgba(10,13,18,.82);color:#e8eaed;text-decoration:none;box-shadow:0 12px 36px rgba(0,0,0,.24);
backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
font:750 12px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#${RETURN_ID}:hover,#${RETURN_ID}:focus-visible{border-color:rgba(125,211,199,.7);color:#fff;outline:none}
@media(max-width:520px){#${RETURN_ID}{left:14px;bottom:max(14px,env(safe-area-inset-bottom))}}
</style>`;

const adaptiveMarkup = `
<a id="${RETURN_ID}" href="/" data-experiment="adaptive-to-classic-v1" data-analytics-event="portfolio_cta_click" data-analytics-value="classic-return" aria-label="Return to the classic portfolio">← Classic portfolio</a>`;

const escapeAttr = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export function injectClassicInvite(html) {
  if (html.includes(`id="${CLASSIC_ID}"`)) return html;
  return html
    .replace("</head>", `${classicStyle}\n</head>`)
    .replace("</body>", `${classicMarkup}\n</body>`);
}

export function injectAdaptiveReturn(html) {
  if (html.includes(`id="${RETURN_ID}"`)) return html;
  const meta = '<meta name="robots" content="noindex,follow" />\n<link rel="canonical" href="https://manishchawla.com/" />';
  return html
    .replace("</head>", `${meta}\n${adaptiveStyle}\n</head>`)
    .replace("</body>", `${adaptiveMarkup}\n</body>`);
}

export function injectAnalytics(html, apiBase = "", webAnalyticsToken = "") {
  let result = html;
  const api = String(apiBase || "").trim();
  const token = String(webAnalyticsToken || "").trim();

  if (api && !result.includes(`id="${ANALYTICS_ID}"`)) {
    const client = `<script id="${ANALYTICS_ID}" src="/portfolio-analytics.js" data-api-base="${escapeAttr(api)}"></script>`;
    result = result.replace("<head>", `<head>\n${client}`);
  }

  if (token && !result.includes(`id="${CF_ANALYTICS_ID}"`)) {
    if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) {
      throw new Error("Invalid Cloudflare Web Analytics site token.");
    }
    const config = JSON.stringify({ token });
    const beacon = `<script id="${CF_ANALYTICS_ID}" defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${config}'></script>`;
    result = result.replace("</head>", `${beacon}\n</head>`);
  }

  return result;
}

export function applyExperimentShell(
  classicIndex,
  adaptiveIndex,
  apiBase = "",
  webAnalyticsToken = ""
) {
  const classic = injectAnalytics(
    injectClassicInvite(fs.readFileSync(classicIndex, "utf8")),
    apiBase,
    webAnalyticsToken
  );
  const adaptive = injectAnalytics(
    injectAdaptiveReturn(fs.readFileSync(adaptiveIndex, "utf8")),
    apiBase,
    webAnalyticsToken
  );
  fs.writeFileSync(classicIndex, classic);
  fs.writeFileSync(adaptiveIndex, adaptive);
}

if (process.argv[1]?.endsWith("experiment-shell.mjs")) {
  const [, , classicIndex, adaptiveIndex, apiBase = "", webAnalyticsToken = ""] = process.argv;
  if (!classicIndex || !adaptiveIndex) {
    console.error("Usage: node scripts/experiment-shell.mjs <classic-index> <adaptive-index> [api-base] [web-analytics-token]");
    process.exit(1);
  }
  applyExperimentShell(classicIndex, adaptiveIndex, apiBase, webAnalyticsToken);
}
