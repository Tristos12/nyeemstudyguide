const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-pob-bank.js','form-3-pob-written.js','form-3-pob-lessons.js','form-3-pob-app.js'];
const src=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(src[f],{filename:f}));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-pob.html"'));
const html=fs.readFileSync('form-3-pob.html','utf8');for(const f of files)assert(html.includes(f));
assert(html.includes('form3-answer-tools.js'));
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.textContent='';this.style={};this.hidden=false;this.value='';this.disabled=false;this.className='';this.attrs={};this.classList={toggle(){}}}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(name,value){this.attrs[name]=value}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const els=new Map(),storage=new Map();
 const doc={
  getElementById(key){if(!els.has(key))els.set(key,new Element());return els.get(key)},
  createElement:t=>new Element(t),querySelector(){return new Element()},querySelectorAll(){return []},addEventListener(){}
 };
 const win={scrollTo(){},addEventListener(){},BSSAnswerTools:{
  mount({container,expanded}){const e=new Element('drawing');e.expanded=expanded;container.append(e)},
  hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true
 }};
 const ctx={document:doc,window:win,location:{search:'?exam='+id,href:''},URLSearchParams,console,Date,Math,Number,String,Array,Object,JSON,Set,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},setInterval:()=>1,clearInterval(){},confirm:()=>true,alert(){}};
 files.slice(0,3).forEach(f=>vm.runInNewContext(src[f],ctx,{filename:f}));
 const B=win.BSS_POB,W=win.BSS_POB_WRITTEN,L=win.BSS_POB_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const paper of B.papers){
  assert.equal(paper.length,60);
  assert.equal(new Set(paper.map(q=>q.stem)).size,60,'All paper questions should be distinct');
  const counts={};for(const q of paper){
   counts[q.topic]=(counts[q.topic]||0)+1;
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,'Duplicate answer choices');
   assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
   assert(q.explanation.length>20)
  }
  assert.equal(Object.values(counts).reduce((s,x)=>s+x,0),60)
 }
 for(const paper of W){
  assert.equal(paper.questions.length,31);
  const marks={};for(const q of paper.questions)marks[q.section]=(marks[q.section]||0)+q.marks;
  assert.deepEqual({...marks},{1:10,2:10,3:20,4:10});
  assert.equal(paper.questions.reduce((s,q)=>s+q.marks,0),50);
  assert.equal(paper.matching.length,5);assert.equal(paper.wordBank.length,12);
  assert.equal(new Set(paper.matching.map(x=>x.letter)).size,5)
 }
 vm.runInNewContext(src['form-3-pob-app.js'],ctx,{filename:'form-3-pob-app.js'});
 const host=doc.getElementById('questionHost'),status=doc.getElementById('assessmentStatus');
 assert.equal(doc.getElementById('assessment').hidden,false,id+' failed to open: '+doc.getElementById('problemText').textContent);
 assert.equal(doc.getElementById('problem').hidden,true,id+' showed error');
 assert(host.children.some(e=>e.tagName==='h3'),id+' missing question prompt');
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));
  const choice=host.children.find(e=>e.className==='answers');assert.equal(choice.children.length,4);
  choice.children[0].onclick();
  assert.equal(JSON.parse(storage.get('bss_form3_pob_2026_'+id)).answers[0],0);
  doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 2 of 60'));
 }else if(id.startsWith('structured')){
  assert(status.textContent.includes('of 31'));
  assert(host.children.some(e=>e.tagName==='ol'),'Matching definitions missing');
  assert(host.children.some(e=>e.tagName==='textarea'),'Typing input missing');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),'Drawing tools missing');
  for(let j=0;j<5;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 6 of 31'),'Word bank not reached');
  assert(host.children.some(e=>e.textContent.includes('Word bank')),'Word bank missing');
  for(let j=0;j<11;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 17 of 31'),'Stakeholder section not reached');
  assert(host.children.some(e=>e.tagName==='table'),'Internal/external stakeholder table missing');
 }else{
  assert(status.textContent.includes('of 51'),'Mock should contain 20 objective plus 31 written questions');
  const choices=host.children.find(e=>e.className==='answers');assert.equal(choices.children.length,4);
  if(id.includes('-t'))assert(doc.getElementById('timer').textContent.includes('Time left'),'Timed mock clock missing');
  for(let j=0;j<20;j++)doc.getElementById('next').onclick();
  assert(status.textContent.includes('Question 21 of 51'));
  assert(host.children.some(e=>e.tagName==='ol'),'Matching task missing after objective questions');
  assert(host.children.some(e=>e.tagName==='textarea'),'Written input not visible');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),'Draw and upload tools missing')
 }
 console.log('PASS '+id+' opens and navigates with valid questions and inputs');
}
console.log('PASS 12 POB assessments, 5 60-item practices, 3 structured 50-mark papers and 4 70-mark mocks');