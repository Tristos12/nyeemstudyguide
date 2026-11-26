const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('form-3-math-structured.html','utf8'),app=fs.readFileSync('form-3-math-structured-app.js','utf8'),bank=fs.readFileSync('form-3-maths-structured.js','utf8'),home=fs.readFileSync('form-3-mathematics.html','utf8');
new vm.Script(bank);new vm.Script(app);
class Element{constructor(){this.children=[];this.style={};this.hidden=false;this.textContent='';this.value='';this.disabled=false;this.className=''}
 append(...args){this.children.push(...args)}replaceChildren(...args){this.children=[...args]}scrollIntoView(){}}
for(let n=1;n<=3;n++){
 const els=new Map(),storage=new Map(),document={getElementById(id){if(!els.has(id))els.set(id,new Element());return els.get(id)},createElement(){return new Element()}};
 const ctx={window:{scrollTo(){}},document,console,location:{search:'?paper='+n,href:''},URLSearchParams,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},confirm:()=>true,Date,Number,Math,Array,Object,String,JSON};
 vm.runInNewContext(bank,ctx);vm.runInNewContext(app,ctx);
 assert.equal(els.get('exam').hidden,false,'Paper '+n+' failed to open');
 assert(els.get('questionText').textContent.length>45,'Paper '+n+' question empty');
 assert(els.get('count').textContent.includes('Question 1/10'),'Wrong first question');
 els.get('response').value='Working: 4 × 5 = 20';els.get('response').oninput();
 const saved=JSON.parse(storage.get('bss_f3_maths_2026_v1_structured-'+n));
 assert.equal(saved.answers[0],'Working: 4 × 5 = 20');
 for(let j=1;j<10;j++)els.get('next').onclick();
 assert(els.get('questionText').textContent.length>45,'Missing question 10');
 assert(els.get('sectionTitle').textContent.includes('Section C'),'Section C missing');
 const original=ctx.window.BSS_MATH_STRUCTURED[n-1];
 assert.equal(original.sectionB.reduce((a,q)=>a+q.marks,0),20);
 assert.equal(original.sectionC.reduce((a,q)=>a+q.marks,0),10);
 assert(home.includes('form-3-math-structured.html?paper='+n),'Missing dashboard link');
 console.log('Paper '+n+': 10 questions, written input and save, section B 20 marks, section C 10 marks');
}
assert(html.includes('form-3-math-structured-app.js'),'Missing script reference');
console.log('PASS: All three structured papers open with real questions and saved response fields');
