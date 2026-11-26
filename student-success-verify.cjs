const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const paths=['student-success-lessons.js','student-success-bank.js','student-success-app.js'];
const src=Object.fromEntries(paths.map(f=>[f,fs.readFileSync(f,'utf8')]));paths.forEach(f=>new vm.Script(src[f],{filename:f}));
const html=fs.readFileSync('student-success.html','utf8');
for(const p of paths)assert(html.includes(p));assert(fs.readFileSync('form-3.html','utf8').includes('student-success.html'));
assert(fs.readFileSync('index.html','utf8').includes('student-success.html'));
const els=new Map(),store=new Map();
class E{
 constructor(tag='div',value){this.tagName=tag;this.children=[];this.style={};this.className='';this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.hidden=false;this.disabled=false;this.value=value||'';this.textContent='';this.checked=false;this.href='';this.max=0;this.min=0}
 append(...c){this.children.push(...c)}
 prepend(...c){this.children.unshift(...c)}
 replaceChildren(...c){this.children=[...c]}
 removeChild(c){this.children.splice(this.children.indexOf(c),1);return c}
 get lastChild(){return this.children[this.children.length-1]}
 scrollIntoView(){}
 setAttribute(){}
}
const document={
 getElementById(id){if(!els.has(id))els.set(id,new E('div'));return els.get(id)},
 createElement:t=>new E(t),
 createTextNode:t=>new E('text',t),
 querySelectorAll(){return []},
 querySelector(){return new E()},
 addEventListener(){},
 body:new E('body')
};
const window={addEventListener(){},URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}}};
const ctx={document,window,Option:class extends E{constructor(text,value){super('option',value);this.textContent=text}},URLSearchParams,location:{search:'',href:''},Date,Math,JSON,Number,String,Array,Object,Set,console,confirm:()=>true,Blob,setInterval:()=>1,clearInterval(){},setTimeout() {},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
vm.runInNewContext(src[paths[0]],ctx,{filename:paths[0]});vm.runInNewContext(src[paths[1]],ctx,{filename:paths[1]});
const B=window.BSS_SUCCESS_BANK,L=window.BSS_SUCCESS_LESSONS,keys=['test','study','time','knowledge','vocab'];
assert.equal(Object.keys(B.questions).length,5);assert.equal(Object.keys(L).length,5);
assert.equal(keys.reduce((s,k)=>s+B.questions[k].length,0),85);
for(const k of keys){
 assert.equal(L[k].lessons.length,5);
 for(const l of L[k].lessons){assert(l.body.length>150);assert(l.example.length>20)}
 assert(B.questions[k].length>=15);
 for(const q of B.questions[k]){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4);assert(q.explanation.length>20)}
}
vm.runInNewContext(src[paths[2]],ctx,{filename:paths[2]});
const topicCards=document.getElementById('topicCards');assert.equal(topicCards.children.length,5);
const practice=document.getElementById('practiceCards');assert.equal(practice.children.length,7);
for(let n=0;n<7;n++){
 const launchButton=practice.children[n].children.find(x=>x.tagName==='button');
 assert(launchButton, 'Start practice missing');
 launchButton.onclick();
 const title=document.getElementById('quizTitle').textContent,options=document.getElementById('quizOptions');
 assert(!document.getElementById('quizView').hidden,title+' not opened');
 assert.equal(options.children.length,4);
 options.children[0].onclick();
 document.getElementById('quizNext').onclick();
 assert(document.getElementById('quizStatus').textContent.includes('Question 2'));
 document.getElementById('quizSubmit').onclick();
 assert(!document.getElementById('quizResult').hidden,title+' result missing');
 assert(document.getElementById('resultSummary').textContent.includes('Score: '));
 assert(document.getElementById('resultRecommendations').children.length>0);
 document.getElementById('resultOther').onclick();
}
const entries=JSON.parse(store.get('bss_student_success_v1_assessments'));assert.equal(Object.values(entries).filter(a=>a.status==='submitted').length,7);
assert.equal(document.getElementById('completed').textContent,'7');
const flash=document.getElementById('flashCard');assert(flash.textContent.includes('Resilient'));document.getElementById('flashReveal').onclick();assert(flash.textContent.includes('recover'));
console.log('PASS: 25 lessons, 85 verified questions, five topic practices, mixed challenge, timed challenge, scoring, recommendations, progress and flashcards.');
