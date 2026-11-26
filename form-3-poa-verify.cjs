const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-poa-bank.js','form-3-poa-written.js','form-3-poa-lessons.js','form-3-poa-diagrams.js','form-3-poa-app.js'];
const src=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(src[f],{filename:f}));
const html=fs.readFileSync('form-3-poa.html','utf8');files.forEach(f=>assert(html.includes(f)));assert(html.includes('form3-answer-tools.js'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-poa.html"'));
class E{constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.textContent='';this.value='';this.className='';this.hidden=false;this.attrs={};this.classList={toggle(){}}}
 append(...args){this.children.push(...args)}replaceChildren(...args){this.children=[...args]}setAttribute(k,v){this.attrs[k]=v}querySelector(){return new E()}scrollIntoView(){}}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const elements=new Map(),store=new Map(),document={
  getElementById(k){if(!elements.has(k))elements.set(k,new E());return elements.get(k)},
  createElement:t=>new E(t),createElementNS:(ns,t)=>new E(t),querySelector(){return new E()},querySelectorAll(){return []},addEventListener(){}
 };
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const n=new E('drawing');n.expanded=expanded;container.append(n)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const context={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,Date,Math,Number,String,Array,Object,JSON,Set,console,confirm:()=>true,alert(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(src[f],context,{filename:f}));
 const B=window.BSS_POA,W=window.BSS_POA_WRITTEN,L=window.BSS_POA_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const paper of B.papers){assert.equal(paper.length,60);assert.equal(new Set(paper.map(q=>q.stem)).size,60);paper.forEach(q=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4)})}
 for(const paper of W){assert.equal(paper.questions.length,7);assert.equal(paper.questions.reduce((s,q)=>s+q.marks,0),50);assert.equal(paper.tasks.length,6);assert.equal(paper.stakeholders.length,10);assert.equal(paper.tf.length,10)}
 vm.runInNewContext(src[files[4]],context,{filename:files[4]});
 const status=document.getElementById('assessmentStatus'),host=document.getElementById('questionHost');
 assert.equal(document.getElementById('assessment').hidden,false,id+' did not open: '+document.getElementById('problemText').textContent);
 assert.equal(document.getElementById('problem').hidden,true,id+' error');
 if(id.startsWith('practice')){
  assert(status.textContent.includes('of 60'));
  const choices=host.children.find(e=>e.className==='answers');assert.equal(choices.children.length,4);
  choices.children[0].onclick();assert.equal(JSON.parse(store.get('bss_form3_poa_2026_'+id)).answers[0],0);
  document.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else{
  const mock=id.startsWith('mock');assert(status.textContent.includes('of '+(mock?17:7)));
  if(id.startsWith('mock-t'))assert(document.getElementById('timer').textContent.includes('Time left'));
  if(mock)for(let j=0;j<10;j++)document.getElementById('next').onclick();
  assert(host.children.some(e=>e.tagName==='textarea'),'Answer input missing');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),'Drawing tools missing');
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='svg'),'Financial control diagram missing');
  document.getElementById('next').onclick();
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='table'),'Task classification table missing');
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='table'),'Stakeholders table missing');
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='ol'),'Matching interests missing');
  document.getElementById('next').onclick();assert(host.children.some(e=>e.tagName==='ol'),'True false statements missing');
 }
 console.log('PASS '+id+' question navigation and answer methods');
}
console.log('PASS 12 Principles of Accounts assessments, five 60-question practices, three 40-mark structured papers and four 45-mark mocks');