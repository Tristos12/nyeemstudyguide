const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['form-3-tcf-bank.js','form-3-tcf-written.js','form-3-tcf-lessons.js','form-3-tcf-diagrams.js','form-3-tcf-app.js'];
const source=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(source[f],{filename:f}));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-tcf.html"'));
const html=fs.readFileSync('form-3-tcf.html','utf8');for(const f of files)assert(html.includes(f));
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.hidden=false;this.value='';this.textContent='';this.className='';this.attrs={};this.classList={toggle(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attrs[k]=v}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
for(const id of ['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2']){
 const elements=new Map(),store=new Map();
 const doc={
  getElementById(k){if(!elements.has(k))elements.set(k,new Element());return elements.get(k)},
  createElement:t=>new Element(t),createElementNS:(ns,t)=>new Element(t),
  querySelector(){return new Element()},querySelectorAll(){return []},addEventListener(){}
 };
 const win={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const n=new Element('drawing');n.expanded=expanded;container.append(n)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const ctx={document:doc,window:win,location:{search:'?exam='+id,href:''},URLSearchParams,console,setInterval:()=>1,clearInterval(){},Date,Math,JSON,Number,String,Object,Array,Set,confirm:()=>true,alert(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(source[f],ctx,{filename:f}));
 const bank=win.BSS_TCF,papers=win.BSS_TCF_WRITTEN,lessons=win.BSS_TCF_LESSONS;
 assert.equal(bank.papers.length,5);assert.equal(papers.length,3);assert.equal(lessons.length,8);
 for(const p of bank.papers){assert.equal(p.length,60);assert.equal(new Set(p.map(q=>q.stem)).size,60);
  for(const q of p){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert(q.explanation.length>15)}}
 for(const p of papers){assert.equal(p.questions.length,10);assert.equal(p.questions.filter(q=>q.section==='C').reduce((a,q)=>a+q.marks,0),8);assert.equal(p.questions.filter(q=>q.section==='D').reduce((a,q)=>a+q.marks,0),28);assert.equal(p.questions.reduce((a,q)=>a+q.marks,0),36);}
 assert.equal(win.BSS_TCF_TRUE_FALSE.length,15);
 vm.runInNewContext(source['form-3-tcf-app.js'],ctx,{filename:'form-3-tcf-app.js'});
 const host=doc.getElementById('questionHost'),status=doc.getElementById('assessmentStatus');
 assert.equal(doc.getElementById('assessment').hidden,false,id+' failed to load '+doc.getElementById('problemText').textContent);
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));const choices=host.children.find(x=>x.className==='answers');assert.equal(choices.children.length,4);choices.children[0].onclick();
  assert.equal(JSON.parse(store.get('bss_form3_tcf_2026_'+id)).answers[0],0);
  doc.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else if(id.startsWith('structured')){
  assert(status.textContent.includes('of 10'));assert(host.children.some(x=>x.tagName==='svg'),'Missing diagram');
  assert(host.children.some(x=>x.tagName==='textarea'),'Missing typing input');assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded),'Missing drawing tools');
  doc.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 10'));
 }else{
  assert(status.textContent.includes('of 44'));if(id.includes('-t'))assert(doc.getElementById('timer').textContent.includes('Time left'));
  for(let j=0;j<24;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 25 of 44'));assert.equal(host.children.find(x=>x.className==='answers').children.length,2,'True-false must have two choices');
  for(let j=0;j<10;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 35 of 44'));assert(host.children.some(x=>x.tagName==='svg'),'Section C diagram missing');
  assert(host.children.some(x=>x.tagName==='textarea'));assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded));
 }
 console.log('PASS '+id+' opens and navigates with required inputs');
}
console.log('PASS: 5 full TCF practices, 3 structured papers, 4 mock examinations and their mark totals');