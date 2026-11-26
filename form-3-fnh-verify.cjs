const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['form-3-fnh-bank.js','form-3-fnh-written.js','form-3-fnh-lessons.js','form-3-fnh-diagrams.js','form-3-fnh-app.js'],source=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(source[f],{filename:f}));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-fnh.html"'));
const html=fs.readFileSync('form-3-fnh.html','utf8');for(const f of files)assert(html.includes(f));
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.hidden=false;this.value='';this.textContent='';this.className='';this.attrs={};this.classList={toggle(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attrs[k]=v}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const elements=new Map(),store=new Map();
 const doc={getElementById(k){if(!elements.has(k))elements.set(k,new Element());return elements.get(k)},
 createElement:t=>new Element(t),createElementNS:(ns,t)=>new Element(t),querySelector(){return new Element()},querySelectorAll(){return []},addEventListener(){}};
 const win={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const n=new Element('drawing');n.expanded=expanded;container.append(n)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const ctx={document:doc,window:win,location:{search:'?exam='+id,href:''},URLSearchParams,console,setInterval:()=>1,clearInterval(){},Date,Math,JSON,Number,String,Object,Array,Set,confirm:()=>true,alert(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(source[f],ctx,{filename:f}));
 const B=win.BSS_FNH,W=win.BSS_FNH_WRITTEN,L=win.BSS_FNH_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const p of B.papers){
  assert.equal(p.length,60);assert.equal(new Set(p.map(q=>q.stem)).size,60);
  for(const q of p){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4);assert(q.explanation.length>15)}
 }
 for(const p of W){
  assert.equal(p.questions.length,18);
  assert.equal(p.questions.filter(q=>q.section==='B').reduce((s,q)=>s+q.marks,0),51);
  assert.equal(p.questions.filter(q=>q.section==='C').reduce((s,q)=>s+q.marks,0),33);
  assert.equal(p.questions.reduce((s,q)=>s+q.marks,0),84)
 }
 vm.runInNewContext(source[files[4]],ctx,{filename:files[4]});
 const host=doc.getElementById('questionHost'),status=doc.getElementById('assessmentStatus');
 assert.equal(doc.getElementById('assessment').hidden,false,id+' failed to load '+doc.getElementById('problemText').textContent);
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));const group=host.children.find(x=>x.className==='answers');assert.equal(group.children.length,4);
  group.children[0].onclick();assert.equal(JSON.parse(store.get('bss_form3_fnh_2026_'+id)).answers[0],0);
  doc.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else if(id.startsWith('structured')){
  assert(status.textContent.includes('of 18'));assert(host.children.some(x=>x.tagName==='textarea'));assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded));
  for(let i=0;i<4;i++)doc.getElementById('next').onclick();
  assert(host.children.some(x=>x.tagName==='svg'),'Pressure-cooker diagram missing');
  doc.getElementById('next').onclick();assert(status.textContent.includes('Question 6 of 18'));
 }else{
  assert(status.textContent.includes('of 58'),'Full mock must contain 40 objective and 18 written questions');
  if(id.includes('-t'))assert(doc.getElementById('timer').textContent.includes('Time left'),'Timer missing');
  for(let j=0;j<40;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 41 of 58'));assert(host.children.some(x=>x.tagName==='textarea'));assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded));
  for(let j=0;j<4;j++)doc.getElementById('next').onclick();
  assert(host.children.some(x=>x.tagName==='svg'),'Pressure cooker illustration missing from mock');
 }
 console.log('PASS '+id+' loads and navigates questions with answer tools');
}
console.log('PASS 12 assessments; 5x60 questions; Section A 40, B 51, C 33; 90-minute timed mocks.');