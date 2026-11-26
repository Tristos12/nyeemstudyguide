const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-it-bank.js','form-3-it-written.js','form-3-it-lessons.js','form-3-it-diagrams.js','form-3-it-app.js'];
const src=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));files.forEach(f=>new vm.Script(src[f],{filename:f}));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-it.html"'));
const page=fs.readFileSync('form-3-it.html','utf8');files.forEach(f=>assert(page.includes(f)));assert(page.includes('form3-answer-tools.js'));
class E{
 constructor(name='div'){this.tagName=name;this.children=[];this.textContent='';this.value='';this.style={};this.attrs={};this.hidden=false;this.disabled=false;this.className='';this.classList={toggle(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attrs[k]=v}
 querySelector(){return new E()}
 scrollIntoView(){}
}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const elements=new Map(),store=new Map(),document={
  getElementById(k){if(!elements.has(k))elements.set(k,new E());return elements.get(k)},
  createElement:t=>new E(t),createElementNS:(ns,t)=>new E(t),querySelector(){return new E()},querySelectorAll(){return []},addEventListener(){}
 };
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{
  mount({container,expanded}){const tool=new E('drawing');tool.expanded=expanded;container.append(tool)},
  hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true
 }};
 const ctx={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,Date,Math,Number,String,Array,Object,JSON,Set,console,confirm:()=>true,alert(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(src[f],ctx,{filename:f}));
 const B=window.BSS_IT,W=window.BSS_IT_WRITTEN,L=window.BSS_IT_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const p of B.papers){
  assert.equal(p.length,60);
  assert.equal(new Set(p.map(q=>q.stem)).size,60,'Repeated question');
  for(const q of p){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,'Duplicate choices in '+q.stem);assert(q.answer>=0&&q.answer<=3);assert(q.explanation.length>20)}
 }
 for(const p of W){assert.equal(p.questions.length,5);assert.equal(p.questions.reduce((s,q)=>s+q.marks,0),30);assert(p.questions.every(q=>q.marks===6))}
 vm.runInNewContext(src['form-3-it-app.js'],ctx,{filename:'form-3-it-app.js'});
 const host=document.getElementById('questionHost'),status=document.getElementById('assessmentStatus');
 assert.equal(document.getElementById('assessment').hidden,false,id+' failed to start: '+document.getElementById('problemText').textContent);
 assert.equal(document.getElementById('problem').hidden,true,id+' entered error screen');
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));const group=host.children.find(e=>e.className==='answers');assert.equal(group.children.length,4);
  group.children[0].onclick();
  assert.equal(JSON.parse(store.get('bss_form3_it_2026_'+id)).answers[0],0);
  document.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else if(id.startsWith('structured')){
  assert(status.textContent.includes('of 5'));assert(host.children.some(e=>e.tagName==='textarea'));assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded));
  for(let i=0;i<2;i++)document.getElementById('next').onclick();
  assert(status.textContent.includes('Question 3 of 5'));assert(host.children.some(e=>e.tagName==='svg'),'Scratch workspace diagram missing');
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='svg'),'Coordinate grid missing');
 }else{
  assert(status.textContent.includes('of 15'),'Mock must have 10 MC plus five written');
  if(id.includes('-t'))assert(document.getElementById('timer').textContent.includes('Time left'),'Timed exam needs clock');
  for(let i=0;i<10;i++)document.getElementById('next').onclick();
  assert(status.textContent.includes('Question 11 of 15'),'Mock failed to enter Section B');
  assert(host.children.some(e=>e.tagName==='textarea'),'Written input missing');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),'Drawing/upload controls missing');
  for(let i=0;i<2;i++)document.getElementById('next').onclick();
  assert(host.children.some(e=>e.tagName==='svg'),'Scratch workspace diagram missing in mock');
 }
 console.log('PASS '+id+' question navigation and response tools');
}
console.log('PASS 12 IT assessments, 5 full 60-question practices, 3 written 30-mark papers, 4 40-mark mock exams');