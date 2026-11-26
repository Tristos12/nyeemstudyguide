const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-building-bank.js','form-3-building-written.js','form-3-building-lessons.js','form-3-building-diagrams.js','form-3-building-app.js'],src=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(src[f],{filename:f}));
const html=fs.readFileSync('form-3-building.html','utf8');for(const f of files)assert(html.includes(f));assert(html.includes('form3-answer-tools.js'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-building.html"'));
class E{constructor(tag='div'){this.tagName=tag;this.children=[];this.textContent='';this.value='';this.style={};this.hidden=false;this.disabled=false;this.className='';this.attrs={};this.classList={toggle(){}}}
append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=[...nodes]}setAttribute(k,v){this.attrs[k]=v}querySelector(){return new E()}scrollIntoView(){}}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
for(const id of cases){
 const elements=new Map(),store=new Map(),document={
 getElementById(k){if(!elements.has(k))elements.set(k,new E());return elements.get(k)},createElement:t=>new E(t),createElementNS:(ns,t)=>new E(t),querySelector(){return new E()},querySelectorAll(){return []},addEventListener(){}};
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const el=new E('drawing');el.expanded=expanded;container.append(el)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const ctx={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,Date,Math,Number,String,Array,Object,JSON,Set,console,confirm:()=>true,alert(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
 files.slice(0,4).forEach(f=>vm.runInNewContext(src[f],ctx,{filename:f}));
 const B=window.BSS_BUILD,W=window.BSS_BUILD_WRITTEN,L=window.BSS_BUILD_LESSONS;
 assert.equal(B.papers.length,5);assert.equal(W.length,3);assert.equal(L.length,8);
 for(const p of B.papers){assert.equal(p.length,60);assert.equal(new Set(p.map(q=>q.stem)).size,60);for(const q of p){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4)}}
 for(const p of W){assert.equal(p.questions.length,10);assert.equal(p.questions.reduce((a,q)=>a+q.marks,0),60);for(const [sec,marks] of [['A',20],['B',20],['C',20]])assert.equal(p.questions.filter(q=>q.section===sec).reduce((a,q)=>a+q.marks,0),marks)}
 vm.runInNewContext(src['form-3-building-app.js'],ctx,{filename:'form-3-building-app.js'});
 const host=document.getElementById('questionHost'),status=document.getElementById('assessmentStatus');
 assert.equal(document.getElementById('assessment').hidden,false,id+' not opened '+document.getElementById('problemText').textContent);
 assert.equal(document.getElementById('problem').hidden,true,id+' error screen');
 if(id.startsWith('practice')){
 assert(status.textContent.includes('of 60'));const group=host.children.find(x=>x.className==='answers');assert.equal(group.children.length,4);group.children[0].onclick();assert.equal(JSON.parse(store.get('bss_form3_build_2026_'+id)).answers[0],0);
 document.getElementById('next').onclick();assert(status.textContent.includes('Question 2 of 60'));
 }else{
 assert(status.textContent.includes('of 10'));assert(host.children.some(x=>x.tagName==='textarea'));assert(host.children.some(x=>x.tagName==='drawing'&&x.expanded));
 if(id.startsWith('mock-t'))assert(document.getElementById('timer').textContent.includes('Time left'));
 for(let i=0;i<3;i++)document.getElementById('next').onclick();
 assert(status.textContent.includes('Question 4 of 10'));assert(host.children.some(x=>x.tagName==='svg'),'Tree cross-section absent');
 for(let i=0;i<4;i++)document.getElementById('next').onclick();
 assert(status.textContent.includes('Question 8 of 10'));assert(host.children.some(x=>x.tagName==='svg'),'Ruler diagram absent');
 }
 console.log('PASS '+id+' opens and navigates with response tools');
}
console.log('PASS all 12 Building Technology assessments and complete 60-mark paper structure');