const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const files=['form-3-music-bank.js','form-3-music-notation.js','form-3-music-written.js','form-3-music-lessons.js','form-3-music-app.js'];
const source=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(source[f],{filename:f}));
const home=fs.readFileSync('form-3.html','utf8'),page=fs.readFileSync('form-3-music.html','utf8');
assert(page.includes('form3-answer-tools.js')&&page.includes('form-3-music-app.js'));
class Element {
 constructor(name='div'){this.tagName=name;this.children=[];this.style={};this.attrs={};this.className='';this.classList={toggle(){}};this.value='';this.textContent='';this.hidden=false;this.disabled=false;}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(name,value){this.attrs[name]=value}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
const cases=['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2'];
let tested=0;
for(const id of cases){
 const elems=new Map(),storage=new Map(),document={
  getElementById(name){if(!elems.has(name))elems.set(name,new Element());return elems.get(name)},
  createElement(name){return new Element(name)},createElementNS(ns,name){return new Element(name)},
  querySelector(){return new Element()},querySelectorAll(){return []},addEventListener(){}
 };
 const win={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container,expanded}){const e=new Element('drawing');e.expanded=expanded;container.append(e)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const ctx={window:win,document,location:{search:'?exam='+id,href:''},URLSearchParams,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},setInterval:()=>1,clearInterval:()=>{},Date,Math,Number,Array,JSON,String,Set,Object,console,confirm:()=>true,alert:()=>{}};
 for(const file of files.slice(0,4))vm.runInNewContext(source[file],ctx,{filename:file});
 const bank=win.BSS_MUSIC,written=win.BSS_MUSIC_WRITTEN,lessons=win.BSS_MUSIC_LESSONS;
 assert.equal(bank.papers.length,5);assert.equal(written.length,3);assert.equal(lessons.length,6);
 for(const [p,paper] of bank.papers.entries()){
  assert.equal(paper.length,60,'Paper '+p+' must have 60 questions');
  const count={};
  assert.equal(new Set(paper.map(q=>q.stem)).size,60,'Each full paper must contain 60 distinct question stems');
  paper.forEach(q=>{
   count[q.topic]=(count[q.topic]||0)+1;
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options).size,4,'Duplicate options '+q.stem);
   assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
   assert(q.explanation?.length>30);
  });
  for(const topic of bank.sections)assert.equal(count[topic],10,topic+' must have 10 items');
 }
 for(const paper of written){
  assert.equal(paper.questions.length,15);
  assert.equal(paper.questions.reduce((sum,q)=>sum+q.marks,0),25);
  const sums={};paper.questions.forEach(q=>sums[q.section]=(sums[q.section]||0)+q.marks);
  assert.deepEqual({...sums},{A:5,D:4,E:3,F:13});
 }
 vm.runInNewContext(source['form-3-music-app.js'],ctx,{filename:'form-3-music-app.js'});
 const host=document.getElementById('questionHost');
 assert.equal(document.getElementById('assessment').hidden,false,id+' failed to open');
 assert.equal(document.getElementById('problem').hidden,true,id+' entered error screen: '+document.getElementById('problemText').textContent);
 assert(host.children.some(e=>e.tagName==='h3'),id+' missing heading');
 assert(host.children.some(e=>e.tagName==='svg'),id+' missing SVG music notation');
 if(id.startsWith('mock')){
  const savedData=JSON.parse(storage.get('bss_form3_music_2026_'+id));
  assert.equal(savedData.answers.length,40,'Mock must have 40 answer slots');
  // Six exam sections retain the official marks A10, B5, C10, D4, E6 and F15.
  const app=source['form-3-music-app.js'];
  assert(app.includes("...objective25.filter(item=>item.section==='A')")&&app.includes("...bySection('F')"));
 }

 if(id.startsWith('practice')){
  assert(document.getElementById('assessmentStatus').textContent.includes('of 60'));
  const answers=host.children.find(e=>e.className==='answers');
  assert.equal(answers.children.length,4,id+' choices missing');
  answers.children[0].onclick();
  const r=JSON.parse(storage.get('bss_form3_music_2026_'+id));
  assert.equal(r.answers[0],0);
 }else if(id.startsWith('structured')){
  assert(document.getElementById('assessmentStatus').textContent.includes('of 15'),id+' wrong question count');
  assert(host.children.some(e=>e.tagName==='textarea'));
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),id+' input tools not expanded');
 }else{
  assert(document.getElementById('assessmentStatus').textContent.includes('of 40'),id+' wrong question count');
  const answers=host.children.find(e=>e.className==='answers');
  assert.equal(answers.children.length,4);
  if(id.includes('-t'))assert(document.getElementById('timer').textContent.includes('Time remaining'),id+' timer missing');
  // Navigate from 5 objective note-value items into first written question.
  for(let j=1;j<=5;j++)document.getElementById('next').onclick();
  assert(host.children.some(e=>e.tagName==='textarea'),id+' failed to reach written Section A');
  assert(host.children.some(e=>e.tagName==='drawing'&&e.expanded),id+' missing visible pen/upload tools');
 }
 document.getElementById('next').onclick();
 assert(document.getElementById('assessmentStatus').textContent.includes('Question '+(id.startsWith('mock')?'7':'2')+' of'),id+' cannot advance');
 tested++;console.log('PASS '+id+' opened questions, SVG notation and navigation');
}
console.log('PASS '+tested+' music assessments, 6 lessons, grade bands, writing tools and timed mocks');
