const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['form-3-spanish-bank.js','form-3-spanish-written.js','form-3-spanish-lessons.js','form-3-spanish-app.js'];
const sources=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(sources[f],{filename:f}));
assert(fs.readFileSync('form-3-spanish.html','utf8').includes('form3-answer-tools.js'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-spanish.html"'));
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.textContent='';this.style={};this.hidden=false;this.value='';this.disabled=false;this.className='';this.attrs={};this.classList={toggle(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attrs[k]=v}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
function descendants(node){return [node,...node.children.flatMap(descendants)]}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const elements=new Map(),storage=new Map();
 const document={
  getElementById(k){if(!elements.has(k))elements.set(k,new Element());return elements.get(k)},
  createElement(tag){return new Element(tag)},
  querySelector(selector){return new Element(selector)},
  querySelectorAll(){return []},addEventListener(){}
 };
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const tool=new Element('drawing');tool.expanded=expanded;container.append(tool)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const context={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,console,Date,Math,String,Number,Array,Object,JSON,Set,confirm:()=>true,alert(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}};
 files.slice(0,3).forEach(f=>vm.runInNewContext(sources[f],context,{filename:f}));
 const B=window.BSS_SPANISH,W=window.BSS_SPANISH_WRITTEN,L=window.BSS_SPANISH_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const p of B.papers){
  assert.equal(p.length,60);
  assert.equal(new Set(p.map(x=>x.stem)).size,60,'Repeated question text');
  const count=Object.fromEntries(B.sections.map(x=>[x,0]));
  for(const x of p){count[x.topic]++;assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4,'duplicate answer options '+x.stem);assert(x.answer>=0&&x.answer<4);assert(x.explanation.length>25)}
  assert.equal(Object.values(count).reduce((sum,x)=>sum+x,0),60)
 }
 for(const p of W){
  assert.equal(p.questions.length,37,'Structured question count');
  const marks={};for(const q of p.questions)marks[q.section]=(marks[q.section]||0)+q.marks;
  assert.deepEqual({...marks},{II:12,III:27,IV:20,V:6,VI:6});
  assert.equal(p.questions.reduce((s,q)=>s+q.marks,0),71)
 }
 vm.runInNewContext(sources[files[3]],context,{filename:files[3]});
 const host=document.getElementById('questionHost'),status=document.getElementById('assessmentStatus');
 assert.equal(document.getElementById('assessment').hidden,false,id+' failed to open: '+document.getElementById('problemText').textContent);
 assert.equal(document.getElementById('problem').hidden,true,id+' error');
 assert(host.children.some(x=>x.tagName==='h3'),'Missing question title');
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));
  assert(host.children.some(x=>x.textContent==='▶ Listen to Spanish sentence'),'Missing listening playback');
  const group=host.children.find(x=>x.className==='answers');assert.equal(group.children.length,4);
  group.children[0].onclick();
  assert.equal(JSON.parse(storage.get('bss_form3_spanish_2026_'+id)).answers[0],0);
  document.getElementById('next').onclick();
  assert(status.textContent.includes('Question 2 of 60'));
 }else if(id.startsWith('structured')){
  assert(status.textContent.includes('of 37'));
  assert(host.children.some(x=>x.tagName==='textarea'));
  assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded));
  assert(host.children.some(x=>x.textContent.includes('Read the Spanish passage')));
  for(let i=0;i<19;i++)document.getElementById('next').onclick();
  assert(status.textContent.includes('Question 20 of 37'));
  assert(host.children.some(x=>x.tagName==='drawing'),'Missing illustration tools');
 }else{
  assert(status.textContent.includes('of 45'),'Mock must have 45 questions');
  assert(host.children.some(x=>x.textContent==='▶ Listen to Spanish sentence'),'Listening mock audio missing');
  if(id.includes('-t'))assert(document.getElementById('timer').textContent.includes('Time left'),'Timed mock clock missing');
  for(let i=0;i<8;i++)document.getElementById('next').onclick();
  assert(status.textContent.includes('Question 9 of 45'),'Did not reach reading section');
  assert(host.children.some(x=>x.tagName==='textarea'),'Written comprehension input missing');
  assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded),'Expanded drawing tools missing');
  assert(host.children.some(x=>x.textContent.includes('Read the Spanish passage')),'Missing mock reading passage')
 }
 console.log('PASS '+id+' questions and section navigation');
}
console.log('PASS 12 Spanish assessments; five 60-question practices; three 71-mark structured papers; four 79-mark mocks');
