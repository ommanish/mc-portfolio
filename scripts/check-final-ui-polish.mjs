import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const args=process.argv.slice(2);
const ri=args.indexOf("--report");
const si=args.indexOf("--screenshots");
const reportPath=ri>=0?args[ri+1]:"docs/experiments/final-ui-polish-v1/layout-report.json";
const shotsDir=si>=0?args[si+1]:"docs/experiments/final-ui-polish-v1/screenshots";

const port=4179;
const url=`http://127.0.0.1:${port}/`;
const server=spawn(
  process.platform==="win32"?"npm.cmd":"npm",
  ["run","dev","--","--host","127.0.0.1","--port",String(port)],
  {stdio:["ignore","pipe","pipe"]}
);
let logs="";
server.stdout.on("data",d=>logs+=d.toString());
server.stderr.on("data",d=>logs+=d.toString());

const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function ready(){
  for(let i=0;i<100;i+=1){
    try{const r=await fetch(url);if(r.ok)return;}catch{}
    await sleep(100);
  }
  throw new Error("Vite did not start:\n"+logs);
}

async function rect(loc){
  return loc.evaluate(el=>{
    const r=el.getBoundingClientRect();
    return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
  });
}

function overlap(a,b){
  const w=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
  const h=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  return w*h;
}

async function liveSweep(page,vp){
  let y=0;
  const step=Math.max(320,Math.floor(vp.height*.55));
  let safety=0;
  while(safety<140){
    const h=await page.evaluate(()=>document.documentElement.scrollHeight);
    if(y>h+vp.height)break;
    await page.evaluate(v=>scrollTo(0,v),y);
    await page.waitForTimeout(45);
    y+=step;
    safety+=1;
  }
}

async function pseudoContent(loc,pseudo){
  return loc.evaluate((el,p)=>getComputedStyle(el,p).content,pseudo);
}

const vps=[
  {name:"mobile",width:375,height:812},
  {name:"tablet",width:768,height:900},
  {name:"desktop",width:1280,height:900},
];

const report={generatedAt:new Date().toISOString(),checks:[]};
let browser;

try{
  await ready();
  browser=await chromium.launch({channel:"chrome",headless:true});
  await fs.mkdir(shotsDir,{recursive:true});

  for(const vp of vps){
    for(const theme of ["dark","light"]){
      const ctx=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
      const page=await ctx.newPage();
      await page.goto(url,{waitUntil:"networkidle"});

      if(theme==="light"){
        await page.evaluate(()=>document.querySelector(".premium-app")?.classList.add("light"));
      }

      const engineering=page.getByRole("button",{name:/engineering \/ technical/i});
      if(await engineering.count())await engineering.click();
      await page.locator(".hero-title").waitFor();

      await liveSweep(page,vp);

      for(const selector of ["#ai","#timeline","#contact",".executive-footer"]){
        const owner=page.locator(selector).first();
        if(await owner.count()){
          await owner.scrollIntoViewIfNeeded();
          await page.waitForTimeout(120);
        }
      }

      await liveSweep(page,vp);

      await page.locator(".delivery-qa-sketch .handwritten-note").waitFor({state:"attached",timeout:5000});
      await page.locator(".ai-owner-accent .handwritten-note").waitFor({state:"attached",timeout:5000});
      await page.locator(".timeline-anchor-years .experience-years-accent").waitFor({state:"attached",timeout:5000});
      await page.locator(".executive-footer").waitFor({state:"attached",timeout:5000});

      const state=await page.evaluate(()=>({
        scroll:document.documentElement.scrollWidth,
        client:document.documentElement.clientWidth,
        text:document.body.innerText,
      }));

      if(state.scroll>state.client+1)throw new Error(`${vp.name}/${theme}: horizontal overflow`);
      if(await page.locator(".hero-sketch-arrow").count())throw new Error(`${vp.name}/${theme}: Hero arrow returned`);
      if(!state.text.includes("18+"))throw new Error(`${vp.name}/${theme}: 18+ missing`);
      if(state.text.includes("17+"))throw new Error(`${vp.name}/${theme}: old visible 17+ returned`);

      const qa=page.locator(".delivery-qa-sketch").first();
      const qaNote=qa.locator(".handwritten-note");
      const qaSize=parseFloat(await qaNote.evaluate(el=>getComputedStyle(el).fontSize));
      if(qaSize<14.9)throw new Error(`${vp.name}/${theme}: QA note too small`);
      const qaStep=qa.locator("xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' delivery-infographic-step ')][1]");
      const qaNode=qaStep.locator(".delivery-infographic-node");
      if(overlap(await rect(qa),await rect(qaNode))>4)throw new Error(`${vp.name}/${theme}: QA overlaps process node`);

      const ai=page.locator(".ai-owner-accent").first();
      const aiNote=ai.locator(".handwritten-note");
      const aiSize=parseFloat(await aiNote.evaluate(el=>getComputedStyle(el).fontSize));
      if(aiSize<14.9)throw new Error(`${vp.name}/${theme}: AI note too small`);
      const aiHeader=ai.locator("xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' section-header ')][1]");
      const aiHeading=aiHeader.locator("h2");
      const aiR=await rect(ai),headingR=await rect(aiHeading);
      const aiGap=aiR.top-headingR.bottom;
      if(aiGap<-8||aiGap>28)throw new Error(`${vp.name}/${theme}: AI note detached (${aiGap.toFixed(1)}px)`);

      const exp=page.locator(".experience-years-accent").first();
      if((await exp.getAttribute("data-accent-type"))!=="underline")throw new Error(`${vp.name}/${theme}: Experience accent is not underline`);
      const expPosition=await exp.evaluate(el=>getComputedStyle(el).position);
      if(expPosition==="absolute"||expPosition==="fixed")throw new Error(`${vp.name}/${theme}: Experience accent floats`);

      const contact=page.locator("#contact").first();
      await contact.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);

      const job=page.getByRole("button",{name:"Job opportunity"}).first();
      if(await job.count())await job.click();

      const change=page.getByRole("button",{name:/change reason/i}).first();
      await change.waitFor({state:"visible",timeout:5000});

      const changeStyle=await change.evaluate(el=>{
        const s=getComputedStyle(el);
        return {
          display:s.display,
          alignItems:s.alignItems,
          gap:parseFloat(s.gap),
          height:parseFloat(s.height),
          whiteSpace:s.whiteSpace,
        };
      });

      // A flex item can blockify specified inline-flex to computed flex.
      // Both values preserve the required flex layout; geometry checks below
      // enforce the actual visual contract.
      if(!["inline-flex","flex"].includes(changeStyle.display))throw new Error(`${vp.name}/${theme}: Change reason display ${changeStyle.display}`);
      if(changeStyle.alignItems!=="center")throw new Error(`${vp.name}/${theme}: Change reason not vertically centered`);
      if(changeStyle.gap<7||changeStyle.gap>10)throw new Error(`${vp.name}/${theme}: Change reason gap ${changeStyle.gap}px`);
      if(changeStyle.height<40||changeStyle.height>48)throw new Error(`${vp.name}/${theme}: Change reason height ${changeStyle.height}px`);
      if(changeStyle.whiteSpace!=="nowrap")throw new Error(`${vp.name}/${theme}: Change reason can wrap`);

      const icon=change.locator(".contact-change-reason-icon");
      const label=change.locator("span").nth(1);
      if((await icon.textContent()).trim()!=="↶")throw new Error(`${vp.name}/${theme}: Change reason icon is not ↶`);

      const iconSize=parseFloat(await icon.evaluate(el=>getComputedStyle(el).fontSize));
      if(iconSize<15||iconSize>17)throw new Error(`${vp.name}/${theme}: Change reason icon size ${iconSize}px`);

      const cr=await rect(change),ir=await rect(icon),lr=await rect(label);
      if(overlap(ir,lr)>0)throw new Error(`${vp.name}/${theme}: Change reason icon overlaps label`);
      const actualGap=lr.left-ir.right;
      if(actualGap<6||actualGap>12)throw new Error(`${vp.name}/${theme}: Change reason visual gap ${actualGap.toFixed(1)}px`);
      if(cr.left<-1||cr.right>vp.width+1)throw new Error(`${vp.name}/${theme}: Change reason leaves viewport`);

      for(const loc of [change,icon,label]){
        for(const pseudo of ["::before","::after"]){
          const content=await pseudoContent(loc,pseudo);
          if(content!=="none"&&content!=='""')throw new Error(`${vp.name}/${theme}: visible pseudo artifact ${pseudo}=${content}`);
        }
      }

      const footer=page.locator(".executive-footer");
      await footer.scrollIntoViewIfNeeded();
      const social=footer.locator(".footer-social-block");
      const follow=social.locator(".footer-social-label");
      const nav=social.getByRole("navigation",{name:"Footer links"});
      const firstLink=nav.locator("a").first();

      if(!(await follow.count())||!(await nav.count()))throw new Error(`${vp.name}/${theme}: Follow me block incomplete`);

      const fr=await rect(follow),nr=await rect(nav),linkR=await rect(firstLink),sr=await rect(social);
      const alignDelta=Math.abs(fr.left-linkR.left);
      if(alignDelta>3)throw new Error(`${vp.name}/${theme}: Follow me left alignment off by ${alignDelta.toFixed(1)}px`);
      const footerGap=nr.top-fr.bottom;
      if(footerGap<4||footerGap>14)throw new Error(`${vp.name}/${theme}: Follow me gap ${footerGap.toFixed(1)}px`);
      const followSize=parseFloat(await follow.evaluate(el=>getComputedStyle(el).fontSize));
      if(followSize<12||followSize>13.5)throw new Error(`${vp.name}/${theme}: Follow me font ${followSize}px`);
      if(sr.left<-1||sr.right>vp.width+1)throw new Error(`${vp.name}/${theme}: Follow me/social block leaves viewport`);

      const shot=path.join(shotsDir,`${vp.name}-${theme}.png`);
      await page.screenshot({path:shot,fullPage:true});

      report.checks.push({
        viewport:vp,
        theme,
        screenshot:shot,
        changeReason:{height:changeStyle.height,computedGap:changeStyle.gap,visualGap:+actualGap.toFixed(1),iconSize},
        followMe:{fontSize:followSize,leftAlignmentDelta:+alignDelta.toFixed(1),gap:+footerGap.toFixed(1)},
        carryForward:{qaFontSize:qaSize,aiFontSize:aiSize,aiHeadingGap:+aiGap.toFixed(1),experiencePosition:expPosition},
      });

      await ctx.close();
    }
  }

  await fs.mkdir(path.dirname(reportPath),{recursive:true});
  await fs.writeFile(reportPath,JSON.stringify(report,null,2)+"\n");
  console.log(`Final UI polish checks passed: ${reportPath}`);
}finally{
  if(browser)await browser.close().catch(()=>{});
  server.kill("SIGTERM");
}
