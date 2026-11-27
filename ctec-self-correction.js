(function(){
"use strict";
const isEnglish=location.pathname.includes("ctec-english-guide");
const groups=[...document.querySelectorAll(".ctec-practice")];
if(!groups.length)return;
const storageKey="bss_ctec_review_"+(isEnglish?"english":"mathematics")+"_v1";
let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey)||"{}")||{}}catch(e){}
const style=document.createElement("style");
style.textContent=".ctec-review{margin-top:13px;padding:13px;border:1px solid #decab8;background:#fff9ee;border-radius:10px}.ctec-review button{font:inherit;font-weight:700;padding:9px 12px;border:1px solid #67243b;background:#67243b;color:#fff;border-radius:8px;cursor:pointer;margin:5px 7px 5px 0}.ctec-review button.secondary{color:#67243b;background:white}.ctec-review .result{margin:9px 0;padding:10px;border-radius:8px;background:#f5eadc}.ctec-review label{display:block;margin:8px 0}.ctec-review textarea{width:100%;min-height:75px;font:inherit;padding:9px}.ctec-review .hint{font-size:13px;color:#695a61}.ctec-review input[type=checkbox]{accent-color:#67243b;margin-right:8px}.ctec-review .result[hidden]{display:none}";
document.head.appendChild(style);
function save(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch(e){}}
function clean(s){return String(s||"").toLowerCase().replace(/[−–]/g,"-").replace(/[$,]/g,"").replace(/\bec\b/g,"").replace(/\s+/g,"").replace(/(\d)\.0+(?=\D|$)/g,"$1").replace(/×/g,"x").trim()}
function candidates(raw){
 const lines=raw.split(/[\n;]/).map(x=>x.trim()).filter(Boolean);
 const seq=[raw.trim(),...lines];
 for(const l of lines){if(l.includes("="))seq.push(l.split("=").pop().trim())}
 return seq.map(clean).filter(Boolean);
}
function numericEquivalent(a,b){
 const x=clean(a),y=clean(b);
 const parse=s=>{if(/^[-+]?\d+(?:\.\d+)?\/[-+]?\d+(?:\.\d+)?$/.test(s)){let v=s.split("/").map(Number);return v[1]===0?NaN:v[0]/v[1]}return /^[-+]?\d+(?:\.\d+)?$/.test(s)?Number(s):NaN};
 const va=parse(x),vb=parse(y);
 return Number.isFinite(va)&&Number.isFinite(vb)&&Math.abs(va-vb)<1e-8;
}
function checkMath(raw,correct){
 const accepted=candidates(raw),expected=clean(correct);
 if(!accepted.length)return "empty";
 if(accepted.some(x=>x===expected||numericEquivalent(x,expected)))return "correct";
 const strippedExpected=expected.replace(/(cm²|cm2|cm|km\/h|km|kg|g|m|°)$/,"");
 const suffix=expected.slice(strippedExpected.length);
 if(suffix && accepted.some(x=>x===strippedExpected||numericEquivalent(x,strippedExpected)))return "unit";
 return "review";
}
groups.forEach((group,i)=>{
 const container=group.querySelector(".ctec-practice-body");
 if(!container)return;
 const root=document.createElement("section");
 root.className="ctec-review";
 if(isEnglish){
 const input=container.querySelector("textarea");
 const criteria=container.querySelector("details p")?.textContent||"Accurate content, clear structure and correct expression.";
 root.innerHTML='<strong>Guided self-correction</strong><p class="hint">Compare your work with the success criteria. This checks your revision steps, not the quality or correctness of your writing. A teacher must mark extended writing.</p><div class="self-check"></div><label><strong>What will you improve?</strong><textarea class="revision" placeholder="Write one correction or improvement here..."></textarea></label><button type="button" class="review-btn">Save my review</button><div class="result" role="status" aria-live="polite" hidden></div>';
 const items=["I answered every question in the task.","My answer uses relevant information or examples.","My writing has a clear order and appropriate format.","I checked grammar, spelling and punctuation.","I compared my response with the marking criteria."];
 const checkWrap=root.querySelector(".self-check");
 items.forEach((s,j)=>{const l=document.createElement("label"),ch=document.createElement("input");ch.type="checkbox";ch.className="self-item";ch.checked=!!saved["e"+i+"c"+j];ch.addEventListener("change",()=>{saved["e"+i+"c"+j]=ch.checked;save()});l.append(ch,document.createTextNode(s));checkWrap.append(l)});
 const text=root.querySelector(".revision");
 text.value=saved["e"+i+"r"]||"";
 text.addEventListener("input",()=>{saved["e"+i+"r"]=text.value.slice(0,3000);save()});
 if(input){input.value=saved["e"+i+"d"]||"";input.addEventListener("input",()=>{saved["e"+i+"d"]=input.value.slice(0,12000);save()})}
 root.querySelector(".review-btn").addEventListener("click",()=>{
 const count=[...root.querySelectorAll(".self-item:checked")].length;
 const words=(input?.value||"").trim().split(/\s+/).filter(Boolean).length;
 const result=root.querySelector(".result");result.hidden=false;
 result.textContent=(words<25?"Your draft is quite short ("+words+" words). Check the task's expected length and develop your ideas. ":"Your draft contains "+words+" words. ")+count+" of 5 self-review checks completed. "+(count===5?"You have completed the review steps. Ask your teacher to check whether the content meets the rubric.":"Finish the remaining checklist items, revise and check again.")+" Rubric: "+criteria;
 });
 }else{
 const problems=[...container.querySelectorAll(".ctec-problem")];
 root.innerHTML='<strong>Check my Mathematics answers</strong><p class="hint">Write your final answer, ideally on its own line. Working is saved privately on this device. Auto-checking uses exact answers and simple numerical equivalence; it cannot evaluate every valid method or expression.</p><button type="button" class="review-btn">Check my answers</button><button type="button" class="secondary retry-btn">Try again</button><div class="result" role="status" aria-live="polite" hidden></div>';
 const inputs=problems.map((p,j)=>{
 const ta=p.querySelector("textarea");if(!ta)return null;
 ta.value=saved["m"+i+"q"+j]||"";
 ta.addEventListener("input",()=>{saved["m"+i+"q"+j]=ta.value.slice(0,5000);save()});
 return ta;
 });
 root.querySelector(".review-btn").addEventListener("click",()=>{
 let right=0,answered=0,notcertain=0,unitCount=0;
 const statuses=[];
 problems.forEach((p,j)=>{
 const correct=p.querySelector("details strong")?.textContent||"";
 const response=inputs[j]?.value||"";
 const status=checkMath(response,correct);
 if(status==="correct")right++;
 if(status!=="empty")answered++;
 if(status==="review")notcertain++;
 if(status==="unit")unitCount++;
 statuses.push("Question "+(j+1)+": "+({correct:"Correct",empty:"Not answered",unit:"Number appears correct; include the required units",review:"Not verified. Compare with the worked answer or ask your teacher"}[status]));
 });
 const result=root.querySelector(".result");result.hidden=false;
 result.textContent=right+" of "+problems.length+" answers automatically verified. "+statuses.join(". ")+". "+(notcertain||unitCount?"Open the answer explanations to review any unverified work.":"Review your working and methods, not just the final answers.");
 saved["m"+i+"last"]=right;save();
 });
 root.querySelector(".retry-btn").addEventListener("click",()=>{root.querySelector(".result").hidden=true;inputs.forEach(x=>{if(x)x.focus()})});
 }
 container.append(root);
});
})();