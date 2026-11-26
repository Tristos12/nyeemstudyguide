const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-theatre-bank.js','form-3-theatre-written.js','form-3-theatre-lessons.js','form-3-theatre-diagrams.js','form-3-theatre-app.js'];
const sources=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));files.forEach(f=>new vm.Script(sources[f],{filename:f}));
const html=fs.readFileSync('form-3-theatre.html','utf8');files.forEach(f=>assert(html.includes(f)));assert(html.includes('form3-answer-tools.js'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-theatre.html"'));
class E{constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.textContent='';this.value='';this.className='';this.hidden=false;this.attrs={};this.classList={toggle(){}}}append(...a){this.children.push(...a)}replaceChildren(...a){this.children=[...a]}setAttribute(k,v){this.attrs[k]=v}querySelector(){return new E()}scrollIntoView(){}}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const els=new Map(),store=new Map(),document={getElementById(k){if(!els.has(k))els.set(k,new E());return els.get(k)},createElement:t=>new E(t),createElementNS:(ns,t)=>new E(t),querySelector(){return new E()},querySelectorAll(){return []},addEventListener(){}};
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const x=new E('drawing');x.expanded=expanded;container.append(x)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const ctx={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,Date,Math,Number,String,Array,Object,JSON,Set,console,confirm:()=>true,alert(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(sources[f],ctx,{filename:f}));
 const B=window.BSS_THEATRE,W=window.BSS_THEATRE_WRITTEN,L=window.BSS_THEATRE_LESSONS,T=window.BSS_THEATRE_TRUE_FALSE;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);assert.equal(T.length,15);
 for(const p of B.papers){assert.equal(p.length,60);assert.equal(new Set(p.map(x=>x.stem)).size,60);p.forEach(q=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4)})}
 for(const p of W){assert.equal(p.questions.length,11);assert.equal(p.questions.filter(q=>q.section==='3').reduce((a,q)=>a+q.marks,0),10);assert.equal(p.questions.filter(q=>q.section==='4').reduce((a,q)=>a+q.marks,0),10)}
 vm.runInNewContext(sources['form-3-theatre-app.js'],ctx,{filename:'form-3-theatre-app.js'});
 const status=document.getElementById('assessmentStatus'),host=document.getElementById('questionHost');
 assert.equal(document.getElementById('assessment').hidden,false,id+' failed opening: '+document.getElementById('problemText').textContent);
 assert.equal(document.getElementById('problem').hidden,true);
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));const group=host.children.find(e=>e.className==='answers');assert.equal(group.children.length,4);
  group.children[0].onclick();assert.equal(JSON.parse(store.get('bss_form3_theatre_2026_'+id)).answers[0],0);
  document.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else{
  const mock=id.startsWith('mock');assert(status.textContent.includes('of '+(mock?51:11)));
  if(id.startsWith('mock-t'))assert(document.getElementById('timer').textContent.includes('Time left'));
  if(mock){
   for(let j=0;j<30;j++)document.getElementById('next').onclick();
   assert(status.textContent.includes('Question 31 of 51'));assert.equal(host.children.find(x=>x.className==='answers').children.length,2);
   for(let j=0;j<10;j++)document.getElementById('next').onclick();
   assert(status.textContent.includes('Question 41 of 51'));
  }
  assert(host.children.some(e=>e.tagName==='svg'),'Story Mountain missing');
  assert(host.children.some(e=>e.tagName==='textarea'),'Typing input missing');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),'Pen and upload tools missing');
  for(let j=0;j<5;j++)document.getElementById('next').onclick();
  assert(host.children.some(e=>e.tagName==='blockquote'),'Folktale scenario missing');
 }
 console.log('PASS '+id+' opens complete content and answer tools');
}
console.log('PASS 12 Theatre Arts assessments: 30 objective + 10 true-false + 10 plot + 10 production marks.');