import fs from "node:fs";
const CLASSIC_ID="current-portfolio-return";
const ANALYTICS_ID="portfolio-analytics-client";
const CF_ANALYTICS_ID="cloudflare-web-analytics";
const classicStyle=`<style id="current-portfolio-return-style">#${CLASSIC_ID}{position:fixed;right:18px;bottom:18px;z-index:9999;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;width:min(360px,calc(100vw - 36px));padding:12px 14px;border:1px solid rgba(255,255,255,.35);border-radius:18px;background:rgba(15,22,34,.97);color:#fff;text-decoration:none;box-shadow:0 18px 52px rgba(0,0,0,.28);font-family:Inter,system-ui,sans-serif}#${CLASSIC_ID} strong{font-size:13px}#${CLASSIC_ID} small{color:#c6cedb;font-size:11px}</style>`;
const classicMarkup=`<a id="${CLASSIC_ID}" href="/?from=classic" data-experiment="classic-to-current-v1" data-analytics-event="portfolio_cta_click" data-analytics-value="current-portfolio" aria-label="View the current portfolio"><span><strong>View the current portfolio</strong><br/><small>The adaptive experience is now the default</small></span><span aria-hidden="true">→</span></a>`;
const canonicalMeta='<link rel="canonical" href="https://manishchawla.com/" />';
const escapeAttr=(value)=>String(value||"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function injectAdaptiveCanonical(html){if(html.includes('rel="canonical" href="https://manishchawla.com/"'))return html;return html.replace("</head>",`${canonicalMeta}
</head>`);}
export function injectClassicFallback(html){if(html.includes(`id="${CLASSIC_ID}"`))return html;const meta='<meta name="robots" content="noindex,follow" />\n<link rel="canonical" href="https://manishchawla.com/" />';return html.replace("</head>",`${meta}
${classicStyle}
</head>`).replace("</body>",`${classicMarkup}
</body>`);}
export function injectAnalytics(html,apiBase="",webAnalyticsToken=""){let result=html;const api=String(apiBase||"").trim();const token=String(webAnalyticsToken||"").trim();if(api&&!result.includes(`id="${ANALYTICS_ID}"`)){const client=`<script id="${ANALYTICS_ID}" src="/portfolio-analytics.js" data-api-base="${escapeAttr(api)}"></script>`;result=result.replace("<head>",`<head>
${client}`);}if(token&&!result.includes(`id="${CF_ANALYTICS_ID}"`)){if(!/^[A-Za-z0-9_-]{20,100}$/.test(token))throw new Error("Invalid Cloudflare Web Analytics site token.");const config=JSON.stringify({token});const beacon=`<script id="${CF_ANALYTICS_ID}" defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${config}'></script>`;result=result.replace("</head>",`${beacon}
</head>`);}return result;}
export function applyProductionShell(adaptiveIndex,classicIndex,apiBase="",webAnalyticsToken=""){const adaptive=injectAnalytics(injectAdaptiveCanonical(fs.readFileSync(adaptiveIndex,"utf8")),apiBase,webAnalyticsToken);const classic=injectAnalytics(injectClassicFallback(fs.readFileSync(classicIndex,"utf8")),apiBase,webAnalyticsToken);fs.writeFileSync(adaptiveIndex,adaptive);fs.writeFileSync(classicIndex,classic);}
if(process.argv[1]?.endsWith("experiment-shell.mjs")){const [,,adaptiveIndex,classicIndex,apiBase="",webAnalyticsToken=""]=process.argv;if(!adaptiveIndex||!classicIndex){console.error("Usage: node scripts/experiment-shell.mjs <adaptive-index> <classic-index> [api-base] [web-analytics-token]");process.exit(1);}applyProductionShell(adaptiveIndex,classicIndex,apiBase,webAnalyticsToken);}
