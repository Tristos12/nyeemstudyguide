/* Form 3 Building Technology student assessments. All records are local to this browser. */
(function(){
'use strict';
const $=id=>document.getElementById(id),B=window.BSS_BUILD,W=window.BSS_BUILD_WRITTEN,L=window.BSS_BUILD_LESSONS;
const key=id=>'bss_form3_build_2026_'+id;
const configs=[
 ...Array.from({length:5},(_,i)=>({id:'practice-'+(i+1),title:'Full Practice '+(i+1),kind:'objective',paper:i,minutes:0})),
 ...Array.from({length:3},(_,i)=>({id:'structured-'+(i+1),title:'Structured Paper '+(i+1),kind:'written',paper:i,minutes:0})),
 {id:'mock-u1',title:'Untimed Mock 1',kind:'mixed',paper:0,minutes:0},
 {id:'mock-u2',title:'Untimed Mock 2',kind:'mixed',paper:1,minutes:0},
 {id:'mock-t1',title:'Timed Mock 1',kind:'mixed',paper:2,minutes:75},
 {id:'mock-t2',title:'Timed Mock 2',kind:'mixed',paper:3,minutes:75}
];
const read=id=>{try{return JSON.parse(localStorage.getItem(key(id))||'null')}catch{return null}};
const write=(id,value)=>{try{localStorage.setItem(key(id),JSON.stringify(value));return true}catch{return false}};
let cfg=null,record=null,questions=[],clock=null;
function getQuestions(config){
 if(config.kind==='objective')return B.papers[config.paper].map(q=>({type:'objective',q}));
 const written=W[config.paper%3].questions.map(q=>({type:'written',q}));
 if(config.kind==='written')return written;
 // The uploaded school exam has three written sections, each worth 20 marks.
 // Complete mocks are 60 marks and require teacher marking throughout.
 return written;
}
function stopTimer(){if(clock!==null){clearInterval(clock);clock=null}}
function showScreen(name){
 for(const nameOf of ['assessment','results','problem'])$(nameOf).hidden=nameOf!==name;
 const inMenu=!name;document.querySelectorAll('.tab').forEach(e=>e.hidden=!inMenu||e.id!=='overview');
 document.querySelector('nav').hidden=!inMenu;
 if(!inMenu)window.scrollTo({top:0,behavior:'smooth'})
}
function tab(name){
 if(!['overview','practices','written','mocks','lessons','grades'].includes(name))name='overview';
 stopTimer();cfg=null;record=null;
 $('assessment').hidden=true;$('results').hidden=true;$('problem').hidden=true;
 document.querySelector('nav').hidden=false;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=e.id!==name);
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
 if(name==='lessons')renderLessons();
 if(name==='grades')renderGrades();
 renderStats();window.scrollTo({top:0,behavior:'smooth'})
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function fail(msg){stopTimer();$('problemText').textContent=msg;showScreen('problem')}
function mediaNamespace(){return 'bss-build-'+cfg.id}
function persist(){const ok=write(cfg.id,record);$('assessmentStatus').textContent=ok?'Answers saved on this device.':'Browser storage unavailable; please export your work before leaving.'}
async function launch(id){
 cfg=configs.find(c=>c.id===id);
 if(!cfg){fail('Unknown Building Technology assessment.');return}
 try{questions=getQuestions(cfg)}catch(e){fail('Assessment questions could not load: '+e.message);return}
 if(!questions.length||questions.some(x=>!x.q||!x.q.stem))return fail('The questions for this assessment are incomplete.');
 const old=read(cfg.id);
 if(old?.status==='submitted'&&Array.isArray(old.answers)&&old.answers.length===questions.length){
  record=old;result();return
 }
 if(old?.status==='draft'&&Array.isArray(old.answers)&&old.answers.length===questions.length){
  record=old;
 }else record={status:'draft',position:0,startedAt:Date.now(),deadline:cfg.minutes?Date.now()+cfg.minutes*60000:null,answers:questions.map(x=>x.type==='objective'?null:'')};
 if(cfg.minutes&&(!Number.isFinite(record.deadline)||Date.now()>=record.deadline)){await submit(true);return}
 record.position=Math.max(0,Math.min(questions.length-1,record.position||0));
 persist();showScreen('assessment');renderQuestion();
 stopTimer();if(cfg.minutes){tick();clock=setInterval(tick,1000)}else $('timer').textContent='Untimed'
}
function tick(){
 if(!cfg||!cfg.minutes||record?.status!=='draft')return;
 const seconds=Math.max(0,Math.ceil((record.deadline-Date.now())/1000));
 $('timer').textContent='Time left '+String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 if(seconds===0)submit(true)
}
function renderQuestion(){
 const i=record.position,it=questions[i],host=$('questionHost');host.replaceChildren();
 $('assessmentTitle').textContent=cfg.title;
 const answered=record.answers.filter((value,index)=>questions[index].type==='objective'?value!==null:typeof value==='string'&&value.trim()).length;
 $('progressBar').style.width=(100*answered/questions.length)+'%';
 $('assessmentStatus').textContent='Question '+(i+1)+' of '+questions.length+' · '+answered+' typed or selected responses entered. Drawings and uploads save separately.';
 const heading=document.createElement('h3');
 heading.textContent=(it.type==='written'?'Section '+it.q.section+' · '+it.q.marks+' marks · '+B.topics[it.q.topic]:'Section '+(cfg.kind==='mixed'?'A':'Practice')+' · '+B.topics[it.q.topic]);
 const prompt=document.createElement('p');prompt.textContent=it.q.stem;
 host.append(heading,prompt);
 if(it.type==='written'&&it.q.visual&&window.BSS_BUILD_DIAGRAMS){
  const diagram=window.BSS_BUILD_DIAGRAMS.draw(it.q.visual);
  const description=document.createElement('p');description.className='small muted';
  description.textContent=it.q.visual==='tree'?'Identify the labelled tree-trunk layers and growth rings.':'Use the ruler diagram for your conversion working.';
  host.append(diagram,description);
 }
 if(it.type==='objective'){
  const group=document.createElement('div');group.className='answers';
  it.q.options.forEach((choice,j)=>{
   const b=document.createElement('button');b.type='button';b.textContent='ABCD'[j]+'. '+choice;
   b.className=record.answers[i]===j?'selected':'';
   b.setAttribute('aria-pressed',String(record.answers[i]===j));
   b.onclick=()=>{record.answers[i]=j;persist();renderQuestion()};
   group.append(b)
  });host.append(group)
 }else{
  const label=document.createElement('label');label.htmlFor='buildingWritten';label.textContent='Type your full response or show your reasoning';
  const area=document.createElement('textarea');area.id='buildingWritten';area.maxLength=18000;area.value=record.answers[i]||'';
  area.oninput=()=>{record.answers[i]=area.value;persist()};
  const tip=document.createElement('p');tip.className='small muted';tip.textContent='You may type explanations, draw timber diagrams and measurement working with coloured pens, or upload a photo, PDF or Word file.';
  host.append(label,area,tip);
  if(window.BSSAnswerTools)window.BSSAnswerTools.mount({container:host,namespace:mediaNamespace(),index:i,readonly:false,expanded:true})
 }
 $('previous').disabled=i===0;$('next').disabled=i===questions.length-1;
}
$('previous').onclick=()=>{if(record.position>0){record.position--;persist();renderQuestion()}};
$('next').onclick=()=>{if(record.position<questions.length-1){record.position++;persist();renderQuestion()}};
$('saveExit').onclick=()=>{persist();stopTimer();location.href='./form-3-building.html?tab='+ (cfg.kind==='objective'?'practices':cfg.kind==='written'?'written':'mocks')};
async function submit(expired=false){
 if(!cfg||record?.status!=='draft')return;
 let blanks=0;
 if(!expired){
  for(let i=0;i<questions.length;i++){
   const value=record.answers[i];
   if(questions[i].type==='objective'){if(value===null)blanks++;continue}
   if(String(value||'').trim())continue;
   if(!window.BSSAnswerTools||!(await window.BSSAnswerTools.hasContent(mediaNamespace(),i)))blanks++
  }
  if(blanks&&!confirm(blanks+' questions have no answer. Submit anyway?'))return;
  if(!confirm('Submit '+cfg.title+'? You cannot edit this attempt after submission.'))return
 }
 let score=0,total=0;questions.forEach((it,i)=>{if(it.type==='objective'){total++;if(record.answers[i]===it.q.answer)score++}});
 record.grade=total?score:null;record.objectiveTotal=total;record.submittedAt=new Date().toISOString();record.expired=!!expired;record.status='submitted';
 persist();stopTimer();result()
}
$('submitExam').onclick=()=>submit(false);
function makeLink(url,label){
 const a=document.createElement('a');a.className='action';a.href=url;a.textContent=label;a.style.margin='4px';return a
}
function scoreGroups(list,answers){
 const map=Object.fromEntries(B.sections.map(topic=>[topic,{topic,correct:0,total:0}]));
 list.forEach((it,i)=>{if(it.type!=='objective')return;const stat=map[it.q.topic];stat.total++;if(answers[i]===it.q.answer)stat.correct++});
 return B.sections.map(t=>({...map[t],percent:map[t].total?Math.round(map[t].correct/map[t].total*100):null}))
}
function result(){
 stopTimer();showScreen('results');
 $('resultTitle').textContent=cfg.title+(record.expired?' · Time expired':' · Submitted');
 const objective=record.objectiveTotal||0;
 const summary=$('resultSummary');summary.replaceChildren();
 const headline=document.createElement('p');headline.style.fontSize='21px';headline.style.fontWeight='700';
 headline.textContent=cfg.kind==='objective'?'Score: '+record.grade+'/60 ('+Math.round(record.grade/60*100)+'%)':
  cfg.kind==='mixed'?'Sections A, B and C: 60 written marks awaiting teacher marking. Objective practice grades and recommended lessons are available separately.':
  'Sections A, B and C: 60 written marks awaiting teacher marking.';
 summary.append(headline);
 const stat=scoreGroups(questions,record.answers),host=$('resultTable');host.replaceChildren();
 if(objective){
  const table=document.createElement('table'),tr=document.createElement('tr');
  for(const title of ['Building Technology topic','Correct','Total','Recommended mini lesson']){const th=document.createElement('th');th.textContent=title;tr.append(th)}table.append(tr);
  for(const s of stat.filter(x=>x.total)){
   const row=document.createElement('tr');
   for(const value of [B.topics[s.topic],s.correct,s.total]){const td=document.createElement('td');td.textContent=String(value);row.append(td)}
   const td=document.createElement('td');
   if(s.percent<85)td.append(makeLink('./form-3-building.html?lesson='+s.topic,'Study lesson ('+s.percent+'%)'));
   else td.textContent='On track ('+s.percent+'%)';
   row.append(td);table.append(row)
  }host.append(table)
 }
 const box=$('suggestedLessons');box.replaceChildren();const h=document.createElement('h3');h.textContent='Your Next Step: Recommended Mini Lessons';box.append(h);
 const candidates=stat.filter(x=>x.percent!==null&&x.percent<85).sort((a,b)=>a.percent-b.percent);
 const p=document.createElement('p');
 p.textContent=objective?(candidates.length?'Study these lower-scoring topics before the next assessment.':'Your assessed topics scored at least 85%. Browse any lesson for revision.'):'Written questions await teacher feedback. Review the relevant lessons while awaiting marking.';
 box.append(p);
 candidates.forEach((s,i)=>box.append(makeLink('./form-3-building.html?lesson='+s.topic,(i===0?'Start here: ':'Study ')+B.topics[s.topic]+' ('+s.percent+'%)')));
 if(!candidates.length)box.append(makeLink('./form-3-building.html?tab=lessons','Browse all Building Technology lessons'));
 $('downloadWork').hidden=cfg.kind==='objective';$('reviewArea').hidden=true;$('reviewArea').replaceChildren()
}
$('reviewAnswers').onclick=()=>{
 const host=$('reviewArea');host.replaceChildren();
 questions.forEach((it,i)=>{
  const block=document.createElement('div');block.className='review';
  const title=document.createElement('strong');title.textContent='Question '+(i+1)+' · '+B.topics[it.q.topic];
  const question=document.createElement('p');question.textContent=it.q.stem;
  const answer=document.createElement('p');
  if(it.type==='objective')answer.textContent='Your answer: '+(record.answers[i]===null?'Blank':it.q.options[record.answers[i]])+'\nCorrect answer: '+it.q.options[it.q.answer]+'\nExplanation: '+it.q.explanation;
  else answer.textContent='Your typed answer:\n'+(record.answers[i]||'[No typed answer]')+'\nTeacher marking is required.';
  block.append(title,question,answer);
  if(it.type==='written'&&window.BSSAnswerTools)window.BSSAnswerTools.mount({container:block,namespace:mediaNamespace(),index:i,readonly:true});
  host.append(block)
 });host.hidden=false;host.scrollIntoView({behavior:'smooth'})
};
$('downloadWork').onclick=async()=>{
 const btn=$('downloadWork');btn.disabled=true;btn.textContent='Preparing ZIP...';
 try{
  await window.BSSAnswerTools.exportBundle({
   namespace:mediaNamespace(),
   questions:questions.map((it,i)=>'Question '+(i+1)+(it.type==='written'?' ('+it.q.marks+' marks)':'')+': '+it.q.stem),
   answers:questions.map((it,i)=>it.type==='objective'?(record.answers[i]===null?'Blank':it.q.options[record.answers[i]]):record.answers[i]),
   filename:'form3-pe-'+cfg.id
  })
 }catch(e){alert('Unable to export: '+e.message)}
 finally{btn.disabled=false;btn.textContent='Download complete submission (ZIP)'}
};
$('retryExam').onclick=async()=>{
 if(!confirm('Replace this result and all saved written attachments with a new attempt?'))return;
 try{await window.BSSAnswerTools.clearNamespace(mediaNamespace(),questions.length)}catch{}
 try{localStorage.removeItem(key(cfg.id))}catch{}
 const id=cfg.id;stopTimer();launch(id)
};
function allGrades(){
 const rows=configs.map(cfg=>({cfg,saved:read(cfg.id)}));
 const submitted=rows.filter(x=>x.saved?.status==='submitted'),objective=submitted.filter(x=>x.cfg.kind!=='written'&&Number.isInteger(x.saved.grade));
 const pending=submitted.filter(x=>x.cfg.kind!=='objective').length;
 $('completedCount').textContent=submitted.length;$('unmarkedCount').textContent=pending;
 $('averageGrade').textContent=objective.length?Math.round(objective.reduce((a,x)=>a+x.saved.grade/x.saved.objectiveTotal*100,0)/objective.length)+'%':'No grades';
 return rows
}
function renderStats(){
 const rows=allGrades(),summary=$('quickRecommendations');summary.replaceChildren();
 const stat=overallSkills();
 const weak=stat.filter(x=>x.percent!==null&&x.percent<85).slice(0,3);
 if(!weak.length){const p=document.createElement('p');p.className='small muted';p.textContent='Complete an objective practice or mock to receive targeted Building Technology mini lessons.';summary.append(p);return}
 for(const s of weak)summary.append(makeLink('./form-3-building.html?lesson='+s.topic,B.topics[s.topic]+' ('+s.percent+'%)'))
}
function renderGrades(){
 const rows=allGrades(),host=$('gradeTable');host.replaceChildren();
 const table=document.createElement('table'),head=document.createElement('tr');
 ['Assessment','Status','Grade / Marking'].forEach(t=>{const th=document.createElement('th');th.textContent=t;head.append(th)});table.append(head);
 rows.forEach(({cfg,saved})=>{
  const tr=document.createElement('tr'),status=saved?.status==='submitted'?'Submitted':saved?.status==='draft'?'In progress':'Not started';
  let grade='Not graded';if(saved?.status==='submitted')grade=cfg.kind==='objective'?saved.grade+'/60 ('+Math.round(saved.grade/60*100)+'%)':cfg.kind==='mixed'?'60 marks pending teacher':'60 written marks awaiting teacher';
  [cfg.title,status,grade].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});table.append(tr)
 });host.append(table)
}
function overallSkills(){
 const map=Object.fromEntries(B.sections.map(t=>[t,{topic:t,correct:0,total:0}]));
 configs.filter(c=>c.kind!=='written').forEach(c=>{
  const saved=read(c.id);if(saved?.status!=='submitted'||!Array.isArray(saved.answers))return;
  const items=getQuestions(c);
  items.forEach((it,i)=>{if(it.type==='objective'){const s=map[it.q.topic];s.total++;if(saved.answers[i]===it.q.answer)s.correct++}})
 });
 return B.sections.map(t=>({...map[t],percent:map[t].total?Math.round(map[t].correct/map[t].total*100):null})).sort((a,b)=>a.percent===null?1:b.percent===null?-1:a.percent-b.percent)
}
function renderLessons(){
 const ordered=overallSkills(),recommended=$('lessonRecommendations');recommended.replaceChildren();
 const attempted=ordered.filter(s=>s.percent!==null);
 if(!attempted.length){const p=document.createElement('p');p.textContent='Complete a full Building Technology practice or objective mock section to receive personalised recommendations.';recommended.append(p)}
 else attempted.forEach(s=>recommended.append(makeLink('./form-3-building.html?lesson='+s.topic,B.topics[s.topic]+' · '+s.percent+'%')));
 const host=$('lessonContent');host.replaceChildren();
 for(const lesson of L){
  const score=ordered.find(x=>x.topic===lesson.key),box=document.createElement('article');box.className='lesson';box.id='lesson-'+lesson.key;
  const heading=document.createElement('h3');heading.textContent=lesson.title;
  const status=document.createElement('p');status.className='small muted';status.textContent=score?.percent===null?'Not yet assessed':'Your objective score: '+score.percent+'% ('+score.correct+'/'+score.total+')';
  const goals=document.createElement('ul');lesson.goals.forEach(g=>{const li=document.createElement('li');li.textContent=g;goals.append(li)});
  const details=document.createElement('details');details.open=score?.percent!==null&&score?.percent<70;
  const summary=document.createElement('summary');summary.textContent='Read the complete lesson and worked example';details.append(summary);
  lesson.steps.forEach(([h,body])=>{const sec=document.createElement('section'),title=document.createElement('h4'),p=document.createElement('p');title.textContent=h;p.textContent=body;sec.append(title,p);details.append(sec)});
  const worked=document.createElement('p');worked.textContent='Worked example: '+lesson.worked;details.append(worked);
  const label=document.createElement('h4');label.textContent='Try it yourself';details.append(label);
  const tasks=document.createElement('ol');lesson.check.forEach(t=>{const li=document.createElement('li');li.textContent=t;tasks.append(li)});details.append(tasks);
  box.append(heading,status,goals,details);host.append(box)
 }
}
function openLesson(id){
 tab('lessons');const node=document.getElementById('lesson-'+id);
 if(node){const details=node.querySelector('details');if(details)details.open=true;node.scrollIntoView({behavior:'smooth',block:'start'})}
}
function boot(){
 if(!B||!W||!L||!window.BSS_BUILD_DIAGRAMS||B.papers.length!==5||W.length!==3||L.length!==8){fail('Some Building Technology content did not load. Please refresh the page.');return}
 renderStats();
 const params=new URLSearchParams(location.search),exam=params.get('exam'),lesson=params.get('lesson'),selected=params.get('tab');
 if(exam){launch(exam);return}
 if(lesson&&B.sections.includes(lesson)){openLesson(lesson);return}
 tab(selected||'overview')
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cfg?.minutes&&record?.status==='draft')tick()});
window.addEventListener('pageshow',()=>{if(cfg?.minutes&&record?.status==='draft')tick();else renderStats()});
boot();
})();