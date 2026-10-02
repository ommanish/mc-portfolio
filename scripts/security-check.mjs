import fs from "node:fs"; import path from "node:path"; import {execFileSync} from "node:child_process";
const fail=m=>{console.error("SECURITY CHECK FAILED: "+m);process.exitCode=1};
const pkg=JSON.parse(fs.readFileSync("package.json","utf8")); const lock=JSON.parse(fs.readFileSync("package-lock.json","utf8"));
if(lock.lockfileVersion!==3) fail("package-lock must use v3");
for(const g of ["dependencies","devDependencies","optionalDependencies"]) for(const [n,s] of Object.entries(pkg[g]||{})){if(s==="latest"||s==="*") fail(`${g}.${n} is floating`); if(/^(https?:|git\+|git:|github:)/i.test(s)) fail(`${g}.${n} uses remote spec`)}
if(pkg.engines?.node!=="^22.13.0 || >=24.0.0") fail("unexpected Node engine policy");
const tracked=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);
for(const f of tracked){const b=path.basename(f); if((/^\.env(?:\.|$)/.test(b)||/^\.dev\.vars(?:\.|$)/.test(b))&&!/\.example$/.test(b)) fail(`tracked secret file: ${f}`); if(/\.(pem|key)$/i.test(b)) fail(`tracked private-key file: ${f}`)}
const pats=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{20,}\b/,/\bAKIA[0-9A-Z]{16}\b/,/\bxox[baprs]-[A-Za-z0-9-]{20,}\b/];
for(const f of tracked){try{const st=fs.statSync(f); if(!st.isFile()||st.size>1500000) continue; const t=fs.readFileSync(f,"utf8"); if(pats.some(r=>r.test(t))) fail(`credential pattern found in ${f}`)}catch{}}
for(const f of fs.readdirSync(".github/workflows").filter(x=>/\.ya?ml$/i.test(x))){const t=fs.readFileSync(`.github/workflows/${f}`,"utf8"); if(/^\s*pull_request_target\s*:/m.test(t)) fail(`${f} uses pull_request_target`); if(/permissions\s*:\s*write-all/i.test(t)) fail(`${f} grants write-all`); for(const m of t.matchAll(/^\s*uses:\s*([^\s#]+)/gm)){if(!m[1].startsWith("./")&&!/@[0-9a-f]{40}$/i.test(m[1])) fail(`${f} action not SHA-pinned: ${m[1]}`)}}
const w=fs.readFileSync("worker/wrangler.toml","utf8"); for(const k of ["OPENAI_API_KEY","TURNSTILE_SECRET_KEY","RESEND_API_KEY","CONTACT_TO_EMAIL","CONTACT_FROM_EMAIL"]) if(new RegExp(`^\\s*${k}\\s*=\\s*[\"'][^\"']+[\"']`,`m`).test(w)) fail(`secret value committed: ${k}`);
if(!process.exitCode) console.log("Security static checks passed.");
