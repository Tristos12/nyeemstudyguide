(function(){
"use strict";
const cfg=window.BSS_ASSESSMENT_CONFIG;
if(!cfg||cfg.enabled!==true||!/^https:\/\/[a-z0-9.-]+\/api\/assess$/i.test(cfg.endpoint||"")||!cfg.turnstileSiteKey)return;
if(!location.pathname.includes("ctec-english-guide.html"))return;
const styles=document.createElement("style");
styles.textContent=".ctec-ai{padding:12px;border:1px solid #e3d3c2;background:#fff9ed;border-radius:10px;margin-top:12px}.ctec-ai button{font:inherit;border:0;background:#67243b;color:white;border-radius:8px;padding:10px 13px;cursor:pointer;font-weight:700}.ctec-ai button:disabled{opacity:.5;cursor:not-allowed}.ctec-ai .result{margin-top:12px;white-space:pre-wrap;background:white;padding:12px;border-radius:8px}.ctec-ai .notice{font-size:13px;color:#685961}";
document.head.append(styles);
let turnstilePromise;
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve();
 if(turnstilePromise)return turnstilePromise;
 turnstilePromise=new Promise((resolve,reject)=>{
  const s=document.createElement("script");
  s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  s.async=true;s.defer=true;
  s.onload=()=>resolve();s.onerror=()=>reject(new Error("Verification unavailable"));
  document.head.append(s);
 });
 return turnstilePromise;
}
async function getToken(target){
 await loadTurnstile();
 if(!window.turnstile)throw new Error("Verification unavailable");
 return await new Promise((resolve,reject)=>{
  let widget;
  const fail=()=>{if(widget!==undefined)window.turnstile.remove(widget);reject(new Error("Verification unsuccessful"))};
  widget=window.turnstile.render(target,{
   sitekey:cfg.turnstileSiteKey,
   callback:token=>{window.turnstile.remove(widget);resolve(token)},
   "error-callback":fail,
   "expired-callback":fail,
   theme:"auto"
  });
 });
}
[...document.querySelectorAll(".ctec-practice")].forEach((group,index)=>{
 const container=group.querySelector(".ctec-practice-body");
 const ta=container?.querySelector("textarea");
 if(!ta)return;
 const instructions=container.querySelector("ol")?.innerText||"Written response";
 const rubric=container.querySelector("details p")?.innerText||"Relevant answer, clear organisation, appropriate language.";
 const panel=document.createElement("section");
 panel.className="ctec-ai";
 const info=document.createElement("p");info.className="notice";
 info.textContent="Optional AI writing feedback. Selecting Submit sends the draft and task instructions to an external AI provider. Do not include your name, other people's names or private details. AI feedback is not an official mark.";
 const consentLabel=document.createElement("label"),consent=document.createElement("input");
 consent.type="checkbox";
 consentLabel.append(consent,document.createTextNode(" I understand and choose to submit this practice response for AI feedback."));
 const button=document.createElement("button");button.type="button";button.textContent="Submit for AI feedback";
 const verification=document.createElement("div");
 const result=document.createElement("div");result.className="result";result.hidden=true;result.setAttribute("aria-live","polite");
 panel.append(info,consentLabel,document.createElement("br"),button,verification,result);
 button.addEventListener("click",async()=>{
  if(!consent.checked){result.hidden=false;result.textContent="Please review and accept the submission notice first.";return}
  if(ta.value.trim().length<30){result.hidden=false;result.textContent="Write a fuller response before requesting feedback.";return}
  button.disabled=true;result.hidden=false;result.textContent="Checking your response...";
  try{
   const token=await getToken(verification);
   const response=await fetch(cfg.endpoint,{
    method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({task:instructions.slice(0,2000),rubric:rubric.slice(0,1600),answer:ta.value.slice(0,6000),turnstileToken:token,consent:true}),
    signal:AbortSignal.timeout(25000)
   });
   const data=await response.json();
   if(!response.ok)throw new Error("Feedback temporarily unavailable");
   const f=data.feedback||{};
   const lines=["AI FORMATIVE FEEDBACK",String(f.overview||""),"","STRENGTHS",...(f.strengths||[]).map(x=>"• "+x),"","WHAT TO IMPROVE",...(f.improvements||[]).map(x=>"• "+x),"","YOUR NEXT REVISION",String(f.revisionPrompt||""),"","A teacher must review any official assessment."];
   result.textContent=lines.join("\n");
  }catch(e){result.textContent="AI feedback is unavailable right now. Your local self-correction remains available and no formal mark has been issued."}
  finally{button.disabled=false}
 });
 container.append(panel);
});
})();