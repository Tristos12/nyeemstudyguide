const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['form-3-french-bank.js','form-3-french-written.js','form-3-french-lessons.js','form-3-french-app.js'];
const source=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(source[f],{filename:f}));
const html=fs.readFileSync('form-3-french.html','utf8');
assert(html.includes('form3-answer-tools.js')&&html.includes('form-3-french-app.js'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-french.html"'));
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.hidden=false;this.style={};this.value='';this.textContent='';this.className='';this.disabled=false;this.attrs={};this.classList={toggle(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(name,value){this.attrs[name]=value}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
for(const id of ['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2']){
 const elems=new Map(),storage=new Map();
 const document={
  getElementById(k){if(!elems.has(k))elems.set(k,new Element());return elems.get(k)},
  createElement(tag){return new Element(tag)},
  querySelector(){return new Element()},
  querySelectorAll(){return []},
  addEventListener(){}
 };
 const window={scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container}){container.append(new Element('drawing'))},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}};
 const context={document,window,location:{search:'?exam='+id,href:''},URLSearchParams,console,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},setInterval:()=>1,clearInterval:()=>{},confirm:()=>true,Date,Math,JSON,Object,Array,String,Number,Set,encodeURIComponent,alert:()=>{}};
 for(const file of files.slice(0,3))vm.runInNewContext(source[file],context,{filename:file});
 const bank=context.window.BSS_FRENCH,reading=context.window.BSS_FRENCH_WRITTEN,lessons=context.window.BSS_FRENCH_LESSONS;
 assert.equal(bank.papers.length,5);
 for(const paper of bank.papers){
  assert.equal(paper.length,60,'Each practice must have 60 questions');
  assert.equal(new Set(paper.map(q=>q.stem)).size,60,'Questions cannot repeat in the same paper');
  paper.forEach(q=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.options[q.answer]));assert(q.explanation.length>20)})
 }
 assert.equal(reading.length,3);assert.equal(lessons.length,6);
 reading.forEach(p=>{assert.equal(p.questions.length,7);assert.equal(p.questions.reduce((sum,q)=>sum+q.marks,0),15);assert(p.passage.length>200)});
 vm.runInNewContext(source['form-3-french-app.js'],context,{filename:files[3]});
 const host=document.getElementById('questionHost');
 assert.equal(document.getElementById('assessment').hidden,false,id+' did not open');
 assert.equal(document.getElementById('problem').hidden,true,id+' showed error');
 assert(host.children.some(c=>c.tagName==='h3'),id+' missing heading');
 if(id.startsWith('practice')){
  assert(document.getElementById('assessmentStatus').textContent.includes('of 60'),id+' wrong count');
  const group=host.children.find(c=>c.tagName==='div');assert.equal(group.children.length,4);
  group.children[0].onclick();
  assert.equal(JSON.parse(storage.get('bss_form3_french_2026_'+id)).answers[0],0);
 }else if(id.startsWith('structured')){
  assert(document.getElementById('assessmentStatus').textContent.includes('of 7'));
  assert(host.children.some(c=>c.tagName==='textarea'));
  assert(host.children.some(c=>c.tagName==='drawing'),'Missing drawing/upload interface');
  assert.equal(document.getElementById('readingPassage').hidden,false);
 }else{
  assert(document.getElementById('assessmentStatus').textContent.includes('of 22'));
  const group=host.children.find(c=>c.tagName==='div');assert.equal(group.children.length,3,'Mocks must follow the 3-option school situations format');
  if(id.includes('-t'))assert(document.getElementById('timer').textContent.includes('Time remaining'),'Missing timed mock clock')
 }
 document.getElementById('next').onclick();
 assert(document.getElementById('assessmentStatus').textContent.includes('Question 2 of'),id+' cannot go to question 2');
 console.log('PASS '+id+' opens questions, navigation, saving and written input where applicable');
}
console.log('PASS: five 60-question French practices, three 15-mark reading papers and four 30-mark 45-minute/untimed mocks');
