/* Form 3 French assessment engine. All student data stays in this browser. */
(function(){
'use strict';
const $=id=>document.getElementById(id),F=window.BSS_FRENCH,W=window.BSS_FRENCH_WRITTEN,L=window.BSS_FRENCH_LESSONS;
const configs=[
 ...Array.from({length:5},(_,i)=>({id:'practice-'+(i+1),title:'French Full Practice '+(i+1),kind:'objective',paper:i,minutes:0})),
 ...Array.from({length:3},(_,i)=>({id:'structured-'+(i+1),title:'French Structured Paper '+(i+1),kind:'written',paper:i,minutes:0})),
 {id:'mock-u1',title:'Untimed French Mock 1',kind:'mixed',paper:0,minutes:0},
 {id:'mock-u2',title:'Untimed French Mock 2',kind:'mixed',paper:1,minutes:0},
 {id:'mock-t1',title:'Timed French Mock 1',kind:'mixed',paper:2,minutes:45},
 {id:'mock-t2',title:'Timed French Mock 2',kind:'mixed',paper:3,minutes:45}
];
const storageKey=id=>'bss_form3_french_2026_'+id;
const load=id=>{try{return JSON.parse(localStorage.getItem(storageKey(id))||'null')}catch{return null}};
const save=(id,obj)=>{try{localStorage.setItem(storageKey(id),JSON.stringify(obj));return true}catch{return false}};
let active=null,attempt=null,items=[],clock=null;
const media=()=>'bss-french-'+active.id;
function stopClock(){if(clock!==null){clearInterval(clock);clock=null}}
function makeQuestions(cfg){
 if(cfg.kind==='objective')return F.papers[cfg.paper].map(q=>({kind:'objective',q}));
 const dialogue=W[cfg.paper%3],written=dialogue.questions.map(q=>({kind:'written',q,passageTitle:dialogue.passageTitle,passage:dialogue.passage}));
 if(cfg.kind==='written')return written;
 const source=F.papers[cfg.paper],objective=[];
 // 15 school-style situations: 5 requests, 5 responses and 5 school rules.
 for(const block of [0,10,20])for(let i=0;i<5;i++)objective.push({kind:'objective',q:source[block+i]});
 return objective.concat(written)
}
function show(name){
 for(const id of ['assessment','results','problem'])$(id).hidden=id!==name;
 document.querySelector('nav').hidden=!!name;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=!!name||e.id!=='overview');
 if(name)window.scrollTo({top:0,behavior:'smooth'})
}
function navigate(tab){
 if(!['overview','practices','written','mocks','lessons','grades'].includes(tab))tab='overview';
 stopClock();active=null;attempt=null;
 $('assessment').hidden=true;$('results').hidden=true;$('problem').hidden=true;
 document.querySelector('nav').hidden=false;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=e.id!==tab);
 document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.tab===tab));
 if(tab==='lessons')renderLessons();if(tab==='grades')renderGrades();
 renderMetrics();window.scrollTo({top:0,behavior:'smooth'})
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.tab));
function fail(msg){stopClock();$('problemText').textContent=msg;show('problem')}
function persist(){
 const ok=save(active.id,attempt);
 $('assessmentStatus').textContent=ok?'Responses saved in this browser.':'Saving failed. Please download your answers before leaving.'
}
function begin(id){
 const cfg=configs.find(c=>c.id===id);
 if(!cfg)return fail('The requested French paper is not recognised.');
 active=cfg;
 try{items=makeQuestions(cfg)}catch(e){return fail('Could not prepare this paper: '+e.message)}
 const expected=cfg.kind==='objective'?60:cfg.kind==='written'?7:22;
 if(items.length!==expected)return fail('Question content is incomplete.');
 const previous=load(cfg.id);
 if(previous?.status==='submitted'&&previous.answers?.length===expected){attempt=previous;result();return}
 if(previous?.status==='draft'&&previous.answers?.length===expected)attempt=previous;
 else attempt={status:'draft',position:0,startedAt:Date.now(),deadline:cfg.minutes?Date.now()+cfg.minutes*60000:null,answers:items.map(q=>q.kind==='objective'?null:'')};
 attempt.position=Math.min(expected-1,Math.max(0,Number(attempt.position)||0));
 if(cfg.minutes&&(!Number.isFinite(attempt.deadline)||Date.now()>=attempt.deadline)){submit(true);return}
 persist();show('assessment');renderQuestion();
 stopClock();if(cfg.minutes){tick();clock=setInterval(tick,1000)}else $('timer').textContent='Untimed'
}
function tick(){
 if(!active?.minutes||attempt?.status!=='draft')return;
 const seconds=Math.max(0,Math.ceil((attempt.deadline-Date.now())/1000));
 $('timer').textContent='Time remaining '+String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 if(seconds===0)submit(true)
}
function renderQuestion(){
 const i=attempt.position,item=items[i],area=$('questionHost');area.replaceChildren();
 $('assessmentTitle').textContent=active.title;
 const count=attempt.answers.filter((answer,index)=>items[index].kind==='objective'?answer!==null:!!String(answer||'').trim()).length;
 $('progressBar').style.width=Math.round(100*count/items.length)+'%';
 $('assessmentStatus').textContent='Question '+(i+1)+' of '+items.length+' · '+count+' typed or selected answers. Drawings and uploads are saved separately.';
 const passage=$('readingPassage');
 if(item.kind==='written'){
  passage.hidden=false;
  passage.replaceChildren();
  const title=document.createElement('h3');title.textContent='Reading Comprehension · '+item.passageTitle;
  const text=document.createElement('div');text.className='passage';text.textContent=item.passage;
  passage.append(title,text);
 }else{passage.hidden=true;passage.replaceChildren()}
 const title=document.createElement('h3');title.textContent=item.kind==='objective'?'Situations and Language · '+F.topics[item.q.topic]:'Reading Question '+(active.kind==='mixed'?i-14:i+1)+' · '+item.q.marks+' marks';
 const stem=document.createElement('p');stem.textContent=item.q.stem;area.append(title,stem);
 if(item.kind==='objective'){
  const group=document.createElement('div');group.className='answers';
  // 60-question practice uses 4 options. Mocks match the school's 3-option Situations format.
  const displayed=active.kind==='mixed'?item.q.options.filter((_,k)=>k===item.q.answer||k!==(item.q.answer+1)%4).slice(0,3):item.q.options;
  const options=active.kind==='mixed'?item.q.options.map((value,index)=>({value,index})).filter(o=>o.index!==((item.q.answer+1)%4)):item.q.options.map((value,index)=>({value,index}));
  options.forEach((option,j)=>{
   const b=document.createElement('button');b.type='button';b.className=attempt.answers[i]===option.index?'selected':'';
   b.textContent='ABCD'[j]+'. '+option.value;b.setAttribute('aria-pressed',String(attempt.answers[i]===option.index));
   b.onclick=()=>{attempt.answers[i]=option.index;persist();renderQuestion()};
   group.append(b)
  });area.append(group)
 }else{
  const label=document.createElement('label');label.htmlFor='frenchWritten';label.textContent='Answer in English using a full sentence where appropriate';
  const box=document.createElement('textarea');box.id='frenchWritten';box.maxLength=12000;box.value=attempt.answers[i]||'';
  box.oninput=()=>{attempt.answers[i]=box.value;persist()};
  const hint=document.createElement('p');hint.className='small muted';hint.textContent='You may type, draw, handwrite with coloured pens or attach a photograph, PDF or Word document.';
  area.append(label,box,hint);
  if(window.BSSAnswerTools)window.BSSAnswerTools.mount({container:area,namespace:media(),index:i,expanded:true,readonly:false})
 }
 $('previous').disabled=i===0;$('next').disabled=i===items.length-1
}
$('previous').onclick=()=>{if(attempt.position>0){attempt.position--;persist();renderQuestion()}};
$('next').onclick=()=>{if(attempt.position<items.length-1){attempt.position++;persist();renderQuestion()}};
$('saveExit').onclick=()=>{persist();stopClock();location.href='./form-3-french.html?tab='+(active.kind==='objective'?'practices':active.kind==='written'?'written':'mocks')};
async function submit(expired=false){
 if(!active||attempt?.status!=='draft')return;
 let blanks=0;
 if(!expired){
  for(let i=0;i<items.length;i++){
   if(items[i].kind==='objective'){if(attempt.answers[i]===null)blanks++;continue}
   if(String(attempt.answers[i]||'').trim())continue;
   if(!window.BSSAnswerTools||!(await window.BSSAnswerTools.hasContent(media(),i)))blanks++
  }
  if(blanks&&!confirm(blanks+' questions are blank. Submit anyway?'))return;
  if(!confirm('Submit '+active.title+' now? You will not be able to edit this attempt.'))return
 }
 let grade=0,total=0;
 items.forEach((item,i)=>{if(item.kind==='objective'){total++;if(attempt.answers[i]===item.q.answer)grade++}});
 attempt.status='submitted';attempt.grade=total?grade:null;attempt.objectiveTotal=total;attempt.submittedAt=new Date().toISOString();attempt.expired=!!expired;
 persist();stopClock();result()
}
$('submitExam').onclick=()=>submit(false);
function scores(){
 const stats=Object.fromEntries(F.sections.map(topic=>[topic,{topic,correct:0,total:0}]));
 items.forEach((item,i)=>{if(item.kind!=='objective')return;const s=stats[item.q.topic];s.total++;if(attempt.answers[i]===item.q.answer)s.correct++});
 return F.sections.map(k=>({...stats[k],percent:stats[k].total?Math.round(100*stats[k].correct/stats[k].total):null}))
}
function lessonLink(topic,title){
 const link=document.createElement('a');link.className='action';link.href='./form-3-french.html?lesson='+topic;link.textContent=title;link.style.margin='4px';return link
}
function result(){
 stopClock();show('results');$('resultTitle').textContent=active.title+(attempt.expired?' · Time expired':' · Submitted');
 const host=$('resultSummary');host.replaceChildren();const p=document.createElement('p');p.style.fontWeight='700';p.style.fontSize='20px';
 p.textContent=active.kind==='objective'?'Score: '+attempt.grade+' / 60 ('+Math.round(attempt.grade/60*100)+'%)':
 active.kind==='mixed'?'Situations: '+attempt.grade+' / 15 ('+Math.round(attempt.grade/15*100)+'%). Reading comprehension: 15 marks awaiting teacher marking.':
 'Reading comprehension: 15 written marks awaiting teacher marking.';
 host.append(p);
 const all=scores(),tableHost=$('resultTable');tableHost.replaceChildren();
 if(attempt.objectiveTotal){
  const table=document.createElement('table'),row=document.createElement('tr');
  ['Skill','Correct','Total','Recommended Mini Lesson'].forEach(label=>{const th=document.createElement('th');th.textContent=label;row.append(th)});table.append(row);
  all.filter(x=>x.total).forEach(s=>{
   const tr=document.createElement('tr');
   [F.topics[s.topic],s.correct,s.total].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.append(td)});
   const td=document.createElement('td');
   if(s.percent<85)td.append(lessonLink(s.topic,'Study lesson ('+s.percent+'%)'));
   else td.textContent='On track ('+s.percent+'%)';
   tr.append(td);table.append(tr)
  });tableHost.append(table)
 }
 const note=$('suggestedLessons');note.replaceChildren();const h=document.createElement('h3');h.textContent='Your Next Step: Recommended Mini Lessons';note.append(h);
 const weakness=all.filter(s=>s.percent!==null&&s.percent<85).sort((a,b)=>a.percent-b.percent);
 const guidance=document.createElement('p');guidance.textContent=attempt.objectiveTotal?'Start with your weakest area and study the matching detailed lesson before trying another practice.':'Written reading questions await teacher feedback. Review the reading-comprehension lesson as preparation.';note.append(guidance);
 weakness.forEach((s,i)=>note.append(lessonLink(s.topic,(i===0?'Start here: ':'Study ')+F.topics[s.topic]+' ('+s.percent+'%)')));
 if(!weakness.length)note.append(lessonLink('reading','Study French Reading Comprehension'));
 $('downloadWork').hidden=active.kind==='objective';$('reviewArea').hidden=true;$('reviewArea').replaceChildren()
}
$('reviewAnswers').onclick=()=>{
 const wrap=$('reviewArea');wrap.replaceChildren();
 items.forEach((item,i)=>{
  const block=document.createElement('div');block.className='review';const title=document.createElement('strong');title.textContent='Question '+(i+1)+' · '+(item.kind==='objective'?F.topics[item.q.topic]:'Reading comprehension');
  const prompt=document.createElement('p');prompt.textContent=item.q.stem;
  const ans=document.createElement('p');
  ans.textContent=item.kind==='objective'?'Your response: '+(attempt.answers[i]===null?'Blank':item.q.options[attempt.answers[i]])+'\nCorrect: '+item.q.options[item.q.answer]+'\nExplanation: '+item.q.explanation:
   'Your written response: '+(attempt.answers[i]||'[No typed response]')+'\nTeacher marking required.';
  block.append(title,prompt,ans);
  if(item.kind==='written'&&window.BSSAnswerTools)window.BSSAnswerTools.mount({container:block,namespace:media(),index:i,readonly:true});
  wrap.append(block)
 });wrap.hidden=false;wrap.scrollIntoView({behavior:'smooth'})
};
$('downloadWork').onclick=async()=>{
 const btn=$('downloadWork');btn.disabled=true;btn.textContent='Preparing ZIP...';
 try{
  await window.BSSAnswerTools.exportBundle({
   namespace:media(),questions:items.map((x,i)=>(i+1)+'. '+x.q.stem),
   answers:items.map((x,i)=>x.kind==='objective'?(attempt.answers[i]===null?'Blank':x.q.options[attempt.answers[i]]):attempt.answers[i]),
   filename:'form3-french-'+active.id
  })
 }catch(e){alert('Unable to export: '+e.message)}
 finally{btn.disabled=false;btn.textContent='Download full submission (ZIP)'}
};
$('retryExam').onclick=async()=>{
 if(!confirm('Restart this assessment? Saved grades, drawings and attachments will be replaced.'))return;
 try{await window.BSSAnswerTools.clearNamespace(media(),items.length)}catch{}
 try{localStorage.removeItem(storageKey(active.id))}catch{}
 const id=active.id;stopClock();begin(id)
};
function allGrades(){
 const rows=configs.map(c=>({cfg:c,data:load(c.id)})),done=rows.filter(x=>x.data?.status==='submitted');
 const objective=done.filter(x=>x.cfg.kind!=='written'&&Number.isInteger(x.data.grade)),pending=done.filter(x=>x.cfg.kind!=='objective').length;
 $('completedCount').textContent=done.length;$('pendingCount').textContent=pending;
 $('averageGrade').textContent=objective.length?Math.round(objective.reduce((sum,x)=>sum+100*x.data.grade/x.data.objectiveTotal,0)/objective.length)+'%':'No grades';
 return rows
}
function aggregate(){
 const counts=Object.fromEntries(F.sections.map(topic=>[topic,{topic,correct:0,total:0}]));
 configs.filter(cfg=>cfg.kind!=='written').forEach(cfg=>{
  const d=load(cfg.id);if(d?.status!=='submitted'||!Array.isArray(d.answers))return;
  makeQuestions(cfg).forEach((q,i)=>{if(q.kind==='objective'){const c=counts[q.q.topic];c.total++;if(d.answers[i]===q.q.answer)c.correct++}})
 });
 return F.sections.map(topic=>({...counts[topic],percent:counts[topic].total?Math.round(counts[topic].correct/counts[topic].total*100):null}))
 .sort((a,b)=>a.percent===null?1:b.percent===null?-1:a.percent-b.percent)
}
function renderMetrics(){
 allGrades();const host=$('quickRecommendations');host.replaceChildren();
 const weak=aggregate().filter(x=>x.percent!==null&&x.percent<85).slice(0,3);
 if(!weak.length){const p=document.createElement('p');p.className='small muted';p.textContent='Complete a French practice or mock to receive personalised lesson recommendations.';host.append(p)}
 else weak.forEach(s=>host.append(lessonLink(s.topic,F.topics[s.topic]+' ('+s.percent+'%)')))
}
function renderGrades(){
 const host=$('gradeTable');host.replaceChildren();const table=document.createElement('table'),tr=document.createElement('tr');
 ['Assessment','Progress','Grade / Marking'].forEach(label=>{const th=document.createElement('th');th.textContent=label;tr.append(th)});table.append(tr);
 allGrades().forEach(({cfg,data})=>{
  const row=document.createElement('tr'),status=data?.status==='submitted'?'Submitted':data?.status==='draft'?'In progress':'Not started';
  let grade='Not graded';
  if(data?.status==='submitted')grade=cfg.kind==='objective'?data.grade+'/60 ('+Math.round(100*data.grade/60)+'%)':cfg.kind==='mixed'?'Situations '+data.grade+'/15; reading pending':'Reading comprehension awaiting teacher marking /15';
  [cfg.title,status,grade].forEach(value=>{const td=document.createElement('td');td.textContent=value;row.append(td)});table.append(row)
 });host.append(table)
}
function renderLessons(){
 const stats=aggregate(),recommended=$('lessonRecommendations');recommended.replaceChildren();
 if(!stats.some(s=>s.total)){const p=document.createElement('p');p.textContent='Complete a practice or objective mock section to unlock personalised French lesson recommendations.';recommended.append(p)}
 else stats.filter(s=>s.total).forEach(s=>recommended.append(lessonLink(s.topic,F.topics[s.topic]+' ('+s.percent+'%)')));
 const host=$('lessonContent');host.replaceChildren();
 L.forEach(lesson=>{
  const score=stats.find(x=>x.topic===lesson.key),card=document.createElement('article');card.id='lesson-'+lesson.key;card.className='lesson';
  const h=document.createElement('h3');h.textContent=lesson.title;
  const stat=document.createElement('p');stat.className='small muted';stat.textContent=score?.percent===null?'Not yet assessed':'Marked objective score '+score.percent+'% ('+score.correct+'/'+score.total+')';
  const goals=document.createElement('ul');lesson.goals.forEach(g=>{const li=document.createElement('li');li.textContent=g;goals.append(li)});
  const detail=document.createElement('details');detail.open=score?.percent!==null&&score?.percent<70;
  const summary=document.createElement('summary');summary.textContent='Read the lesson, worked example and practice tasks';detail.append(summary);
  lesson.steps.forEach(([t,body])=>{const section=document.createElement('section'),title=document.createElement('h4'),p=document.createElement('p');title.textContent=t;p.textContent=body;section.append(title,p);detail.append(section)});
  const worked=document.createElement('p');worked.textContent='Worked example: '+lesson.example;detail.append(worked);
  const task=document.createElement('h4');task.textContent='Try it yourself';detail.append(task);
  const list=document.createElement('ol');lesson.check.forEach(q=>{const li=document.createElement('li');li.textContent=q;list.append(li)});detail.append(list);
  card.append(h,stat,goals,detail);host.append(card)
 })
}
function openLesson(topic){
 navigate('lessons');const node=document.getElementById('lesson-'+topic);
 if(node){const d=node.querySelector('details');if(d)d.open=true;node.scrollIntoView({behavior:'smooth',block:'start'})}
}
function boot(){
 if(!F||!W||!L||F.papers.length!==5||W.length!==3||L.length!==6)return fail('French resources could not load. Please refresh.');
 const qs=new URLSearchParams(location.search);renderMetrics();
 if(qs.get('exam')){begin(qs.get('exam'));return}
 if(F.sections.includes(qs.get('lesson'))){openLesson(qs.get('lesson'));return}
 navigate(qs.get('tab')||'overview')
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active?.minutes&&attempt?.status==='draft')tick()});
window.addEventListener('pageshow',()=>{if(active?.minutes&&attempt?.status==='draft')tick();else renderMetrics()});
boot();
})();