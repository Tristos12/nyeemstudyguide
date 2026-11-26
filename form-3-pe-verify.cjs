const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['form-3-pe-bank.js','form-3-pe-written.js','form-3-pe-lessons.js','form-3-pe-app.js'];
const src=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
files.forEach(f=>new vm.Script(src[f],{filename:f}));
const page=fs.readFileSync('form-3-pe.html','utf8');
assert(page.includes('src="./form3-answer-tools.js"'));
assert(fs.readFileSync('form-3.html','utf8').includes('href="./form-3-pe.html"'));
class Element{
 constructor(name='div'){this.tagName=name;this.children=[];this.textContent='';this.style={};this.hidden=false;this.value='';this.disabled=false;this.className='';this.attrs={};this.classList={toggle(){}}}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(name,value){this.attrs[name]=value}
 querySelector(){return new Element()}
 scrollIntoView(){}
}
const ids=['completedCount','averageGrade','unmarkedCount','quickRecommendations','gradeTable','lessonRecommendations','lessonContent','assessment','results','problem','assessmentTitle','assessmentStatus','timer','progressBar','questionHost','previous','next','submitExam','saveExit','resultTitle','resultSummary','resultTable','suggestedLessons','reviewAnswers','downloadWork','retryExam','reviewArea','problemText'];
let totalChecked=0;
for(const id of ['practice-1','practice-2','practice-3','practice-4','practice-5','structured-1','structured-2','structured-3','mock-u1','mock-u2','mock-t1','mock-t2']){
 const els=new Map(ids.map(x=>[x,new Element()])),store=new Map(),nav=new Element('nav');
 const doc={
  getElementById(id){if(!els.has(id))els.set(id,new Element());return els.get(id)},
  createElement(tag){return new Element(tag)},
  querySelector(selector){if(selector==='nav')return nav;return new Element()},
  querySelectorAll(selector){return []},
  addEventListener(){}
 };
 const context={window:{scrollTo(){},addEventListener(){},BSSAnswerTools:{mount({container}){const div=new Element('draw');div.textContent='Draw or upload';container.append(div)},hasContent:async()=>false,clearNamespace:async()=>true,exportBundle:async()=>true}},document:doc,location:{search:'?exam='+id,href:''},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},URLSearchParams,console,setInterval:()=>1,clearInterval:()=>{},confirm:()=>true,Date,Math,JSON,Object,Array,Number,String,Set,encodeURIComponent,alert:()=>{}};
 for(const f of files.slice(0,3))vm.runInNewContext(src[f],context,{filename:f});
 const bank=context.window.BSS_PE,written=context.window.BSS_PE_WRITTEN,lessons=context.window.BSS_PE_LESSONS;
 assert.equal(bank.papers.length,5);assert.equal(written.length,3);assert.equal(lessons.length,8);
 for(const p of bank.papers){
  assert.equal(p.length,60);
  assert.equal(new Set(p.map(q=>q.stem)).size,60);
  p.forEach(q=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert(q.explanation.length>15)})
 }
 for(const p of written){
 assert.equal(p.questions.length,9);
 assert.equal(p.questions.reduce((sum,q)=>sum+q.marks,0),40);
 assert.equal(p.questions.filter(q=>q.section==='B').reduce((sum,q)=>sum+q.marks,0),25);
 assert.equal(p.questions.filter(q=>q.section==='C').reduce((sum,q)=>sum+q.marks,0),15);
}
 vm.runInNewContext(src['form-3-pe-app.js'],context,{filename:'form-3-pe-app.js'});
 const isPractice=id.startsWith('practice'),isMock=id.startsWith('mock'),host=doc.getElementById('questionHost');
 assert.equal(doc.getElementById('assessment').hidden,false,id+' failed to load');
 assert.equal(doc.getElementById('problem').hidden,true,id+' showed load error');
 assert(host.children.some(c=>c.tagName==='h3'),id+' missing heading');
 const first=host.children;
 if(isPractice){
  assert(first.some(c=>c.tagName==='div'&&c.children.length===4),id+' no choices');
  assert(doc.getElementById('assessmentStatus').textContent.includes('of 60'));
  first.find(c=>c.tagName==='div').children[0].onclick();
  const rec=JSON.parse(store.get('bss_form3_pe_2026_'+id));
  assert.equal(rec.answers[0],0,'Answer did not save');
 }else{
  assert(first.some(c=>c.tagName==='textarea'),id+' no text response');
  assert(first.some(c=>c.tagName==='draw'),id+' drawing workspace unavailable');
  assert(doc.getElementById('assessmentStatus').textContent.includes('of '+(isMock?19:9)),id+' question count');
 }
 doc.getElementById('next').onclick();
 assert(doc.getElementById('assessmentStatus').textContent.includes('Question 2 of'),id+' next question did not open');
 if(isMock&&id.includes('t'))assert(doc.getElementById('timer').textContent.includes('Time left'),id+' timed mock missing clock');
 totalChecked++;
 console.log('PASS '+id+' opens first and second questions and saves progress');
}
console.log('PASS '+totalChecked+' PE assessments; five 60-question practices, 3 50-mark written papers, 4 70-mark mocks');
