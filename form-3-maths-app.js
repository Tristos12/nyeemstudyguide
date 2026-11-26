/* Form 3 Mathematics client-side learning and assessment engine. */
(function(){
'use strict';
const $=id=>document.getElementById(id),math=window.BSS_MATH,lessons=window.BSS_MATH_LESSONS,structured=window.BSS_MATH_STRUCTURED;
const base='bss_f3_maths_2026_v1_',categories=math.sections;
const configs=[
 ...Array.from({length:5},(_,i)=>({id:'practice-'+(i+1),title:'Practice '+(i+1),kind:'objective',paper:i,minutes:null})),
 ...Array.from({length:3},(_,i)=>({id:'structured-'+(i+1),title:'Structured Paper '+(i+1),kind:'written',paper:i,minutes:null})),
 {id:'mock-u1',title:'Untimed Mock 1',kind:'mixed',paper:0,minutes:null},
 {id:'mock-u2',title:'Untimed Mock 2',kind:'mixed',paper:1,minutes:null},
 {id:'mock-t1',title:'Timed Mock 1',kind:'mixed',paper:2,minutes:75},
 {id:'mock-t2',title:'Timed Mock 2',kind:'mixed',paper:3,minutes:75}
];
const get=id=>{try{return JSON.parse(localStorage.getItem(base+id)||'null')}catch{return null}};
const set=(id,value)=>{try{localStorage.setItem(base+id,JSON.stringify(value));return true}catch{return false}};
let active=null,record=null,clock=null,currentTab='overview';
function stopClock(){if(clock!==null){clearInterval(clock);clock=null}}
function assessmentQuestions(cfg){
 if(cfg.kind==='objective')return math.papers[cfg.paper].map(q=>({kind:'objective',q}));
 const parts=structured[cfg.paper%3];
 const writing=parts.sectionB.concat(parts.sectionC).map((q,i)=>({kind:'written',q,section:i<6?'B':'C'}));
 if(cfg.kind==='written')return writing;
 // School-style full mock: Section A 20 objective marks, B 20 and C 10
 const original=math.papers[cfg.paper%5],sample=[];
 // Two distinct items in each of the ten skill areas.
 for(let k=0;k<10;k++)sample.push(original[k*6],original[k*6+1]);
 return sample.map(q=>({kind:'objective',q})).concat(writing);
}
function showTab(tab){
 currentTab=tab;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=e.id!==tab);
 document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.tab===tab));
 $('workArea').hidden=true;$('results').hidden=true;
 $('summary').hidden=false;document.querySelector('nav').hidden=false;
 window.scrollTo({top:0,behavior:'smooth'});
 if(tab==='lessons')renderLessons();
 if(tab==='grades')renderGradeTable();
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showTab(b.dataset.go));
function cardList(target,list){
 const host=$(target);host.replaceChildren();
 for(const cfg of list){
  const card=document.createElement('article');card.className='tile',h=document.createElement('h3');h.textContent=cfg.title;
  const stored=get(cfg.id),p=document.createElement('p');
  p.textContent=cfg.kind==='objective'?'60 multiple-choice questions':cfg.kind==='written'?'30 written marks; teacher marking required':'50 marks total (20 objective + 30 written)';
  const status=document.createElement('p');status.className='small muted';
  status.textContent=stored?.status==='submitted'?cfg.kind==='objective'?'Completed · '+stored.grade+'/60':cfg.kind==='mixed'?'Submitted · Objective '+stored.grade+'/20; written pending':'Submitted · Awaiting marking':stored?.status==='draft'?'In progress · Resume here':'Not started';
  const time=document.createElement('p');time.className='small muted';time.textContent=cfg.minutes?cfg.minutes+' minute time limit':'Untimed';
  const b=document.createElement('button');b.className='primary';b.textContent=stored?.status==='submitted'?'View results / retry':stored?.status==='draft'?'Continue':'Start';
  b.onclick=()=>start(cfg.id);
  card.append(h,p,status,time,b);host.append(card)
 }
}
function stats(){
 let done=0,pending=0,grades=[],rows=[];
 for(const cfg of configs){
  const rec=get(cfg.id),isDone=rec?.status==='submitted';
  if(isDone){done++;if(cfg.kind!=='objective')pending++;if(cfg.kind!=='written'&&Number.isInteger(rec.grade))grades.push(100*rec.grade/(cfg.kind==='mixed'?20:60))}
  const status=isDone?'Submitted':rec?.status==='draft'?'In progress':'Not started';
  const grade=isDone?(cfg.kind==='objective'?rec.grade+'/60 ('+Math.round(rec.grade/60*100)+'%)':cfg.kind==='mixed'?'Objective '+rec.grade+'/20; writing awaiting marking':'Written paper awaiting marking'):'Not graded';
  rows.push([cfg.title,status,grade])
 }
 $('done').textContent=done;$('pending').textContent=pending;
 $('average').textContent=grades.length?Math.round(grades.reduce((a,b)=>a+b,0)/grades.length)+'%':'No grades';
 return rows;
}
function renderGradeTable(){
 const rows=stats(),host=$('gradeTable');host.replaceChildren(),table=document.createElement('table');
 const tr=document.createElement('tr');for(const label of ['Assessment','Progress','Grade']){const th=document.createElement('th');th.textContent=label;tr.append(th)}table.append(tr);
 for(const values of rows){const row=document.createElement('tr');for(const val of values){const td=document.createElement('td');td.textContent=val;row.append(td)}table.append(row)}host.append(table)
}
function skillReport(){
 const acc=Object.fromEntries(categories.map(k=>[k,{correct:0,total:0}]));
 for(const cfg of configs){
  if(cfg.kind==='written')continue;
  const rec=get(cfg.id);if(rec?.status!=='submitted'||!Array.isArray(rec.answers))continue;
  const qs=assessmentQuestions(cfg);
  qs.forEach((it,i)=>{if(it.kind!=='objective')return;const row=acc[it.q.topic];row.total++;if(rec.answers[i]===it.q.answer)row.correct++})
 }
 return categories.map(k=>({key:k,title:math.topicNames[k],correct:acc[k].correct,total:acc[k].total,
 percent:acc[k].total?Math.round(acc[k].correct*100/acc[k].total):null})).sort((a,b)=>a.percent===null?1:b.percent===null?-1:a.percent-b.percent)
}
function openLesson(key){
 stopClock();showTab('lessons');
 const node=document.getElementById('lesson-'+key);
 if(node){node.querySelector('details').open=true;node.scrollIntoView({behavior:'smooth',block:'start'})}
}
function renderQuick(){
 const host=$('quickLesson');host.replaceChildren();
 const scores=skillReport().filter(x=>x.percent!==null&&x.percent<85).slice(0,3);
 if(!scores.length){const p=document.createElement('p');p.className='muted small';p.textContent='After completing a practice, your weakest Mathematics topics and matching lessons will appear here.';host.append(p);return}
 const p=document.createElement('span');p.className='small muted';p.textContent='Recommended next lessons:';host.append(p);
 for(const r of scores){const btn=document.createElement('button');btn.textContent=r.title+' ('+r.percent+'%)';btn.onclick=()=>openLesson(r.key);host.append(btn)}
}
function refresh(){stats();cardList('practiceCards',configs.filter(c=>c.kind==='objective'));cardList('structuredCards',configs.filter(c=>c.kind==='written'));cardList('mockCards',configs.filter(c=>c.kind==='mixed'));renderQuick()}
function start(id){
 active=configs.find(c=>c.id===id);if(!active)return;
 record=get(id);
 if(record?.status==='submitted'){
  if(confirm('View the saved result? Select Cancel to choose a new attempt.')){showResult();return}
  if(!confirm('Replace the previously saved result with a new attempt?'))return;
  record=null
 }
 const qs=assessmentQuestions(active);
 if(!record||record.status!=='draft')record={status:'draft',answers:qs.map(q=>q.kind==='objective'?null:''),position:0,started:Date.now(),deadline:active.minutes?Date.now()+active.minutes*60000:null};
 if(!Array.isArray(record.answers)||record.answers.length!==qs.length)record={status:'draft',answers:qs.map(q=>q.kind==='objective'?null:''),position:0,started:Date.now(),deadline:active.minutes?Date.now()+active.minutes*60000:null};
 if(active.minutes&&Date.now()>=record.deadline){submit(true);return}
 set(active.id,record);showWork();
}
function showWork(){
 document.querySelectorAll('.tab').forEach(e=>e.hidden=true);
 $('summary').hidden=true;document.querySelector('nav').hidden=true;
 $('workArea').hidden=false;$('results').hidden=true;$('workTitle').textContent=active.title;
 stopClock();if(active.minutes){tick();clock=setInterval(tick,1000)}else $('timer').textContent='Untimed';
 renderQuestion();window.scrollTo({top:0,behavior:'smooth'})
}
function tick(){
 if(!active?.minutes||record?.status!=='draft')return;
 const sec=Math.max(0,Math.ceil((record.deadline-Date.now())/1000));
 $('timer').textContent='Time left: '+String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
 if(sec===0)submit(true)
}
function persist(){if(active&&record?.status==='draft')$('workStatus').textContent=set(active.id,record)?'Your answers are saved on this device.':'Unable to save to this browser.'}
function renderQuestion(){
 const qs=assessmentQuestions(active),pos=Math.max(0,Math.min(qs.length-1,record.position||0));record.position=pos;
 const it=qs[pos],q=it.q,host=$('questionArea');host.replaceChildren();
 const answered=record.answers.filter((v,i)=>qs[i].kind==='objective'?v!==null:typeof v==='string'&&!!v.trim()).length;
 $('workBar').style.width=100*answered/qs.length+'%';
 $('workStatus').textContent='Question '+(pos+1)+' of '+qs.length+' · '+answered+' responses entered. Work saves automatically.';
 const title=document.createElement('h3');title.textContent=it.kind==='objective'?('Question '+(pos+1)+' · '+math.topicNames[q.topic]):('Question '+(pos+1)+' · Section '+it.section+' · '+q.marks+' marks');
 const stem=document.createElement('p');stem.textContent=it.kind==='objective'?q.stem:q.stem;
 host.append(title,stem);
 if(it.kind==='objective'){
  q.options.forEach((answer,i)=>{
   const btn=document.createElement('button');btn.type='button';btn.className='answer'+(record.answers[pos]===i?' chosen':'');
   btn.textContent='ABCD'[i]+'. '+answer;btn.setAttribute('aria-pressed',String(record.answers[pos]===i));
   btn.onclick=()=>{record.answers[pos]=i;persist();renderQuestion()};host.append(btn)
  })
 }else{
  const lab=document.createElement('label');lab.htmlFor='mathResponse';lab.textContent='Show all working and give your answer';
  const area=document.createElement('textarea');area.id='mathResponse';area.rows=9;area.maxLength=12000;area.value=record.answers[pos]||'';
  area.oninput=()=>{record.answers[pos]=area.value;persist()};host.append(lab,area);
  const note=document.createElement('p');note.className='muted small';note.textContent='Type steps, symbols and explanations. For diagrams, describe the pattern clearly or draw it separately for your teacher.';host.append(note)
 }
 $('back').disabled=pos===0;$('forward').disabled=pos===qs.length-1
}
$('back').onclick=()=>{if(record.position>0){record.position--;persist();renderQuestion()}};
$('forward').onclick=()=>{if(record.position<assessmentQuestions(active).length-1){record.position++;persist();renderQuestion()}};
$('saveExit').onclick=()=>{persist();stopClock();refresh();showTab('overview')};
function submit(expired){
 if(!active||!record||record.status!=='draft')return;
 const qs=assessmentQuestions(active),missing=record.answers.filter((v,i)=>qs[i].kind==='objective'?v===null:!v.trim()).length;
 if(!expired&&missing&&!confirm(missing+' questions are unanswered. Submit anyway?'))return;
 if(!expired&&!confirm('Submit '+active.title+' now? You will see corrections for objective questions.'))return;
 let score=0;qs.forEach((it,i)=>{if(it.kind==='objective'&&record.answers[i]===it.q.answer)score++});
 record.status='submitted';record.grade=active.kind==='written'?null:score;record.submittedAt=new Date().toISOString();record.expired=!!expired;
 set(active.id,record);showResult()
}
$('submit').onclick=()=>submit(false);
function showResult(){
 stopClock();document.querySelectorAll('.tab').forEach(e=>e.hidden=true);
 $('summary').hidden=true;document.querySelector('nav').hidden=true;$('workArea').hidden=true;$('results').hidden=false;
 $('resultHeading').textContent=active.title+(record.expired?' · Time expired':' · Completed');
 const info=$('resultInfo');info.replaceChildren();
 const summary=document.createElement('p');summary.className='score';
 summary.textContent=active.kind==='objective'?'Grade: '+record.grade+' / 60 ('+Math.round(record.grade/60*100)+'%)':active.kind==='mixed'?'Objective Section A: '+record.grade+' / 20 ('+Math.round(record.grade/20*100)+'%); written sections awaiting marking':'Written sections submitted · 30 marks awaiting teacher assessment';
 info.append(summary);
 const note=document.createElement('p');note.className='muted';note.textContent=active.kind==='objective'?'The full grade and skill results are shown below.':active.kind==='mixed'?'No total /50 grade will be calculated until a teacher marks Sections B and C.':'Written solutions require teacher review; no automatic written grade is assigned.';info.append(note);
 const host=$('resultTable');host.replaceChildren(),q=assessmentQuestions(active),rec={};
 q.forEach((it,i)=>{if(it.kind==='objective'){if(!rec[it.q.topic])rec[it.q.topic]={right:0,total:0};rec[it.q.topic].total++;if(record.answers[i]===it.q.answer)rec[it.q.topic].right++}});
 if(Object.keys(rec).length){
  const table=document.createElement('table'),head=document.createElement('tr');
  for(const label of ['Skill','Correct','Total','Mini Lesson']){const th=document.createElement('th');th.textContent=label;head.append(th)}table.append(head);
  for(const key of categories){
   const x=rec[key];if(!x)continue;const row=document.createElement('tr');
   for(const val of [math.topicNames[key],x.right,x.total]){const td=document.createElement('td');td.textContent=val;row.append(td)}
   const cell=document.createElement('td'),pct=Math.round(100*x.right/x.total);
   if(pct<85){const a=document.createElement('a');a.className='action';a.href='./form-3-mathematics.html?lesson='+key;a.textContent='Study lesson ('+pct+'%)';cell.append(a)}else cell.textContent='On track ('+pct+'%)';
   row.append(cell);table.append(row)
  }
  host.append(table)
 }
 const suggested=$('suggestedLessons');suggested.replaceChildren();
 const h=document.createElement('h3');h.textContent='Your Next Step: Recommended Mini Lessons';suggested.append(h);
 const priorities=Object.entries(rec).map(([key,v])=>({key,pct:Math.round(v.right/v.total*100)})).filter(r=>r.pct<85).sort((a,b)=>a.pct-b.pct);
 if(priorities.length){
  const p=document.createElement('p');p.textContent='Start with your lowest-scoring skill, study its worked examples, then return for another practice.';suggested.append(p);
  priorities.forEach((r,i)=>{const a=document.createElement('a');a.className='action';a.style.margin='4px';a.href='./form-3-mathematics.html?lesson='+r.key;a.textContent=(i?'Study ':'Start here: ')+math.topicNames[r.key]+' ('+r.pct+'%)';suggested.append(a)})
 }else{
  const p=document.createElement('p');p.textContent=active.kind==='written'?'Your written sections need teacher marking before reliable recommendations can be made. Browse the mini lessons below.':'All assessed topics scored at least 85%. Review any lesson to keep improving.';suggested.append(p);
  const a=document.createElement('a');a.className='action';a.href='./form-3-mathematics.html?tab=lessons';a.textContent='Browse mini lessons';suggested.append(a)
 }
 $('answerReview').hidden=true;$('answerReview').replaceChildren();window.scrollTo({top:0,behavior:'smooth'});
}
$('answerReviewBtn').onclick=()=>{
 const host=$('answerReview');host.replaceChildren();
 const qs=assessmentQuestions(active);
 qs.forEach((it,i)=>{
  const block=document.createElement('div');block.className='review',h=document.createElement('strong');h.textContent='Question '+(i+1)+(it.kind==='written'?' · '+it.q.marks+' marks':' · '+math.topicNames[it.q.topic]);
  const p=document.createElement('p');p.textContent=it.kind==='objective'?it.q.stem:it.q.stem;block.append(h,p);
  const answer=document.createElement('p');
  if(it.kind==='objective')answer.textContent='Your answer: '+(record.answers[i]===null?'Blank':it.q.options[record.answers[i]])+' | Correct answer: '+it.q.options[it.q.answer]+' | '+it.q.explanation;
  else answer.textContent='Your working: '+(record.answers[i]||'[Blank]')+' | Teacher marking required';
  block.append(answer);host.append(block)
 });host.hidden=false;host.scrollIntoView({behavior:'smooth',block:'start'})
};
$('returnHome').onclick=()=>{refresh();showTab('grades')};
$('retake').onclick=()=>{if(!confirm('Start a new attempt? The saved result will be replaced.'))return;localStorage.removeItem(base+active.id);start(active.id)};
function renderLessons(){
 const host=$('lessonCards');host.replaceChildren();const recs=skillReport();
 for(const topic of lessons){
  const score=recs.find(r=>r.key===topic.key);
  const box=document.createElement('article');box.className='lesson';box.id='lesson-'+topic.key;
  const h=document.createElement('h3');h.textContent=topic.title;box.append(h);
  const p=document.createElement('p');p.className='small muted';p.textContent=score?.percent===null?'Not yet assessed':'Your marked score: '+score.percent+'% ('+score.correct+'/'+score.total+')';box.append(p);
  const goals=document.createElement('ul');topic.goals.forEach(text=>{const li=document.createElement('li');li.textContent=text;goals.append(li)});box.append(goals);
  const d=document.createElement('details');d.open=score?.percent!==null&&score?.percent<70;
  const sum=document.createElement('summary');sum.textContent='Read the full lesson and worked example';d.append(sum);
  for(const [title,body] of topic.steps){const section=document.createElement('section'),h=document.createElement('h4'),p=document.createElement('p');h.textContent=title;p.textContent=body;section.append(h,p);d.append(section)}
  const ex=document.createElement('p');ex.textContent='Worked example: '+topic.example;
  const check=document.createElement('p');check.textContent='Try it yourself: '+topic.check;d.append(ex,check);box.append(d);
  const button=document.createElement('button');button.textContent='Return to full practices';button.onclick=()=>showTab('practices');box.append(button);host.append(box)
 }
 const recommendations=$('recommendations');recommendations.replaceChildren();
 const selected=skillReport().filter(x=>x.percent!==null);
 if(!selected.length){const p=document.createElement('p');p.className='muted';p.textContent='Complete a 60-question practice or a school-style mock to receive personalised lessons. You can study any topic now.';recommendations.append(p);return}
 for(const r of selected){
  const p=document.createElement('p'),b=document.createElement('button');b.textContent='Study '+r.title+' · '+r.percent+'%';
  b.onclick=()=>openLesson(r.key);p.append(b);recommendations.append(p)
 }
}

const profileKey='bss_form3_maths_profile_v1';
function profile(){
 let value={nickname:'',className:''};
 try{value=JSON.parse(localStorage.getItem(profileKey)||'null')||value}catch{}
 $('mathNickname').value=value.nickname||'';
 $('mathClass').value=value.className||'';
 return value
}
$('saveMathProfile').onclick=()=>{
 const value={nickname:$('mathNickname').value.trim().slice(0,24).replace(/[<>]/g,''),className:$('mathClass').value.trim().slice(0,20).replace(/[<>]/g,'')};
 try{localStorage.setItem(profileKey,JSON.stringify(value));$('mathProfileStatus').textContent='Profile saved in this browser.'}
 catch{$('mathProfileStatus').textContent='Browser storage is unavailable.'}
};
$('exportMathAnswers').onclick=()=>{
 if(!active||!record||record.status!=='submitted')return;
 const student=profile(),qs=assessmentQuestions(active);
 const lines=['BABONNEAU SECONDARY SCHOOL','FORM THREE MATHEMATICS',active.title,
  'Nickname: '+(student.nickname||'Not provided'),'Class: '+(student.className||'Not provided'),'Submitted: '+(record.submittedAt||''),
  active.kind==='objective'?'Objective grade: '+record.grade+'/60':active.kind==='mixed'?'Section A grade: '+record.grade+'/20; Sections B and C awaiting teacher marking':'Written assessment: awaiting teacher marking','','STUDENT RESPONSES'];
 qs.forEach((it,i)=>{
  lines.push('Question '+(i+1)+(it.kind==='written'?' ('+it.q.marks+' marks)':''),it.kind==='objective'?it.q.stem:it.q.stem);
  lines.push(it.kind==='written'?(record.answers[i]||'[No response]'):record.answers[i]===null?'[No answer]':it.q.options[record.answers[i]],'')
 });
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='form3-mathematics-'+active.id+'-responses.txt';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),2000)
};
function boot(){
 profile();refresh();showTab('overview');
 const url=new URLSearchParams(location.search),lesson=url.get('lesson'),tab=url.get('tab');
 if(lesson&&categories.includes(lesson))openLesson(lesson);
 else if(['practices','structured','mocks','grades','lessons'].includes(tab))showTab(tab);
 const id=url.get('exam');if(id&&configs.some(c=>c.id===id))start(id);
}
window.addEventListener('pageshow',()=>{if(!$('workArea').hidden&&active?.minutes&&record?.status==='draft')tick();else refresh()});
boot();
})();