/* Form 3 Music Theory interactive practice and assessment engine.
 * Objective questions auto-marked; all written/drawn answers require teacher marking.
 */
(function(){
'use strict';
const $=id=>document.getElementById(id),M=window.BSS_MUSIC,W=window.BSS_MUSIC_WRITTEN,L=window.BSS_MUSIC_LESSONS,N=window.BSS_MUSIC_NOTATION;
const configs=[
 ...Array.from({length:5},(_,i)=>({id:'practice-'+(i+1),title:'Music Full Practice '+(i+1),kind:'objective',paper:i,minutes:0})),
 ...Array.from({length:3},(_,i)=>({id:'structured-'+(i+1),title:'Music Structured Paper '+(i+1),kind:'written',paper:i,minutes:0})),
 {id:'mock-u1',title:'Untimed Music Mock 1',kind:'mixed',paper:0,minutes:0},
 {id:'mock-u2',title:'Untimed Music Mock 2',kind:'mixed',paper:1,minutes:0},
 {id:'mock-t1',title:'Timed Music Mock 1',kind:'mixed',paper:2,minutes:75},
 {id:'mock-t2',title:'Timed Music Mock 2',kind:'mixed',paper:3,minutes:75}
];
const recordKey=id=>'bss_form3_music_2026_'+id;
const load=id=>{try{return JSON.parse(localStorage.getItem(recordKey(id))||'null')}catch{return null}};
const save=(id,value)=>{try{localStorage.setItem(recordKey(id),JSON.stringify(value));return true}catch{return false}};
let cfg=null,record=null,items=[],clock=null;
function media(){return 'bss-music-'+cfg.id}
function stopClock(){if(clock!==null){clearInterval(clock);clock=null}}
function objective(topic,p,start,count,section){
 const offset=M.sections.indexOf(topic)*10;
 return M.papers[p].slice(offset+start,offset+start+count).map(q=>({kind:'objective',section,marks:1,q}))
}
function makeQuestions(c){
 if(c.kind==='objective')return M.papers[c.paper].map(q=>({kind:'objective',section:'Practice',marks:1,q}));
 const written=W[c.paper%3].questions.map(q=>({kind:'written',section:q.section,marks:q.marks,q}));
 if(c.kind==='written')return written;
 const bySection=s=>written.filter(item=>item.section===s);
 // Preserve school examination weighting: A 10, B 5, C 10, D 4, E 6, F 15.
 const objective25=[
  ...objective('values',c.paper,0,5,'A'),
  ...objective('rests',c.paper,0,5,'B'),
  ...objective('time',c.paper,0,10,'C'),
  ...objective('ledger',c.paper,0,3,'E'),
  ...objective('excerpt',c.paper,0,2,'F')
 ];
 const merged=[
  ...objective25.filter(item=>item.section==='A'),...bySection('A'),
  ...objective25.filter(item=>item.section==='B'),
  ...objective25.filter(item=>item.section==='C'),
  ...bySection('D'),
  ...objective25.filter(item=>item.section==='E'),...bySection('E'),
  ...objective25.filter(item=>item.section==='F'),...bySection('F')
 ];
 return merged
}
function markTotal(array){return array.reduce((s,item)=>s+item.marks,0)}
function show(screen){
 for(const id of ['assessment','results','problem'])$(id).hidden=id!==screen;
 document.querySelector('nav').hidden=!!screen;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=!!screen||e.id!=='overview');
 if(screen)window.scrollTo({top:0,behavior:'smooth'})
}
function navigate(tab){
 if(!['overview','practices','written','mocks','lessons','grades'].includes(tab))tab='overview';
 stopClock();cfg=null;record=null;items=[];
 $('assessment').hidden=true;$('results').hidden=true;$('problem').hidden=true;
 document.querySelector('nav').hidden=false;
 document.querySelectorAll('.tab').forEach(e=>e.hidden=e.id!==tab);
 document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.tab===tab));
 if(tab==='lessons')renderLessons();
 if(tab==='grades')renderGrades();
 renderStats();window.scrollTo({top:0,behavior:'smooth'})
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.tab));
function fail(error){stopClock();$('problemText').textContent=error;show('problem')}
function persist(){
 const ok=save(cfg.id,record);
 $('assessmentStatus').textContent=ok?'Answers saved on this browser.':'Browser saving failed. Export your responses before leaving.';
}
function start(id){
 cfg=configs.find(c=>c.id===id);
 if(!cfg)return fail('The requested Music assessment was not found.');
 try{items=makeQuestions(cfg)}catch(e){return fail('The question bank failed to load: '+e.message)}
 const expected=cfg.kind==='objective'?60:cfg.kind==='written'?15:40;
 const expectedMarks=cfg.kind==='objective'?60:cfg.kind==='written'?25:50;
 if(items.length!==expected||markTotal(items)!==expectedMarks||items.some(i=>!i.q||!i.q.stem))return fail('This paper has incomplete questions or marking totals.');
 const old=load(cfg.id);
 if(old?.status==='submitted'&&Array.isArray(old.answers)&&old.answers.length===items.length){record=old;result();return}
 if(old?.status==='draft'&&Array.isArray(old.answers)&&old.answers.length===items.length){record=old}
 else record={status:'draft',position:0,startedAt:Date.now(),deadline:cfg.minutes?Date.now()+cfg.minutes*60000:null,answers:items.map(i=>i.kind==='objective'?null:'')};
 record.position=Math.max(0,Math.min(items.length-1,Number(record.position)||0));
 if(cfg.minutes&&(!Number.isFinite(record.deadline)||Date.now()>=record.deadline)){submit(true);return}
 persist();show('assessment');renderQuestion();stopClock();
 if(cfg.minutes){tick();clock=setInterval(tick,1000)}else $('timer').textContent='Untimed';
}
function tick(){
 if(!cfg?.minutes||record?.status!=='draft')return;
 const remain=Math.max(0,Math.ceil((record.deadline-Date.now())/1000));
 $('timer').textContent='Time remaining '+String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0');
 if(remain===0)submit(true)
}
function appendVisual(host,visual){
 if(!visual||!N?.draw)return;
 const svg=N.draw(visual);if(svg)host.append(svg)
}
function renderQuestion(){
 const position=record.position,item=items[position],host=$('questionHost');host.replaceChildren();
 const answered=record.answers.filter((a,i)=>items[i].kind==='objective'?a!==null:!!String(a||'').trim()).length;
 $('assessmentTitle').textContent=cfg.title;
 $('progressBar').style.width=(100*answered/items.length)+'%';
 $('assessmentStatus').textContent='Question '+(position+1)+' of '+items.length+' · '+answered+' typed or selected responses. Drawings and uploads are saved separately.';
 const section=document.createElement('h3');
 section.textContent=item.section==='Practice'?M.topics[item.q.topic]:'Section '+item.section+' · '+M.topics[item.q.topic]+' · '+item.marks+(item.marks===1?' mark':' marks');
 const prompt=document.createElement('p');prompt.textContent=item.q.stem;host.append(section,prompt);
 appendVisual(host,item.q.visual);
 if(item.kind==='objective'){
  const group=document.createElement('div');group.className='answers';
  item.q.options.forEach((choice,j)=>{
   const b=document.createElement('button');b.type='button';b.className=record.answers[position]===j?'selected':'';
   b.textContent='ABCD'[j]+'. '+choice;b.setAttribute('aria-pressed',String(record.answers[position]===j));
   b.onclick=()=>{record.answers[position]=j;persist();renderQuestion()};
   group.append(b)
  });host.append(group)
 }else{
  const label=document.createElement('label');label.htmlFor='musicWritten';label.textContent='Write your answer or show your musical notation';
  const area=document.createElement('textarea');area.id='musicWritten';area.maxLength=15000;area.value=record.answers[position]||'';
  area.oninput=()=>{record.answers[position]=area.value;persist()};
  const tip=document.createElement('p');tip.className='small muted';tip.textContent='You may type, handwrite with different pen colours and thicknesses, draw notes on the canvas, erase, or upload an image, PDF or Word file.';
  host.append(label,area,tip);
  if(window.BSSAnswerTools)window.BSSAnswerTools.mount({container:host,namespace:media(),index:position,expanded:true,readonly:false})
 }
 $('previous').disabled=position===0;$('next').disabled=position===items.length-1
}
$('previous').onclick=()=>{if(record.position>0){record.position--;persist();renderQuestion()}};
$('next').onclick=()=>{if(record.position<items.length-1){record.position++;persist();renderQuestion()}};
$('saveExit').onclick=()=>{persist();stopClock();location.href='./form-3-music.html?tab='+(cfg.kind==='objective'?'practices':cfg.kind==='written'?'written':'mocks')};
async function submit(expired=false){
 if(!cfg||record?.status!=='draft')return;
 if(!expired){
  let missing=0;
  for(let i=0;i<items.length;i++){
   if(items[i].kind==='objective'){if(record.answers[i]===null)missing++;continue}
   if(String(record.answers[i]||'').trim())continue;
   if(!window.BSSAnswerTools||!(await window.BSSAnswerTools.hasContent(media(),i)))missing++
  }
  if(missing&&!confirm(missing+' answers have been left blank. Submit anyway?'))return;
  if(!confirm('Submit '+cfg.title+' for marking? You cannot edit submitted responses.'))return
 }
 let grade=0,total=0;
 items.forEach((item,i)=>{if(item.kind==='objective'){total++;if(record.answers[i]===item.q.answer)grade++}});
 record.status='submitted';record.grade=total?grade:null;record.objectiveTotal=total;
 record.submittedAt=new Date().toISOString();record.expired=!!expired;
 persist();stopClock();result()
}
$('submitExam').onclick=()=>submit(false);
function skills(questionList,answers){
 const counts=Object.fromEntries(M.sections.map(topic=>[topic,{topic,correct:0,total:0}]));
 questionList.forEach((item,i)=>{if(item.kind!=='objective')return;const s=counts[item.q.topic];s.total++;if(answers[i]===item.q.answer)s.correct++});
 return M.sections.map(topic=>({...counts[topic],percent:counts[topic].total?Math.round(100*counts[topic].correct/counts[topic].total):null}))
}
function lessonLink(topic,title){
 const a=document.createElement('a');a.href='./form-3-music.html?lesson='+topic;a.className='action';a.style.margin='4px';a.textContent=title;return a
}
function result(){
 stopClock();show('results');
 $('resultTitle').textContent=cfg.title+(record.expired?' · Time expired':' · Completed');
 const summary=$('resultSummary');summary.replaceChildren();const p=document.createElement('p');p.style.fontWeight='700';p.style.fontSize='21px';
 p.textContent=cfg.kind==='objective'?'Score: '+record.grade+' / 60 ('+Math.round(100*record.grade/60)+'%)':
 cfg.kind==='mixed'?'Objective sections: '+record.grade+' / 25 ('+Math.round(100*record.grade/25)+'%). Remaining 25 written marks await teacher marking.':
 'Structured written responses: 25 marks awaiting teacher marking.';
 summary.append(p);
 const data=skills(items,record.answers),host=$('resultTable');host.replaceChildren();
 if(record.objectiveTotal){
  const table=document.createElement('table'),head=document.createElement('tr');
  ['Theory topic','Correct','Total','Recommended lesson'].forEach(x=>{const h=document.createElement('th');h.textContent=x;head.append(h)});table.append(head);
  data.filter(s=>s.total).forEach(s=>{
   const tr=document.createElement('tr');
   [M.topics[s.topic],s.correct,s.total].forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td)});
   const td=document.createElement('td');
   if(s.percent<85)td.append(lessonLink(s.topic,'Study lesson ('+s.percent+'%)'));
   else td.textContent='On track ('+s.percent+'%)';
   tr.append(td);table.append(tr)
  });host.append(table)
 }
 const note=$('suggestedLessons');note.replaceChildren();
 const heading=document.createElement('h3');heading.textContent='Your Next Step: Recommended Mini Lessons';note.append(heading);
 const weak=data.filter(s=>s.percent!==null&&s.percent<85).sort((a,b)=>a.percent-b.percent);
 const help=document.createElement('p');help.textContent=record.objectiveTotal?(weak.length?'Study the weakest areas before the next practice. Scores from mock topics with few questions are only initial guidance.':'All automatically assessed areas reached 85%. Continue revising any topic.'):'Your written answers await teacher marking. Review the music lessons while waiting for feedback.';note.append(help);
 weak.forEach((s,i)=>note.append(lessonLink(s.topic,(i===0?'Start here: ':'Study ')+M.topics[s.topic]+' ('+s.percent+'%)')));
 if(!weak.length)note.append(lessonLink('excerpt','Browse all Music Theory lessons'));
 $('downloadWork').hidden=cfg.kind==='objective';$('reviewArea').hidden=true;$('reviewArea').replaceChildren()
}
$('reviewAnswers').onclick=()=>{
 const host=$('reviewArea');host.replaceChildren();
 items.forEach((item,i)=>{
  const block=document.createElement('div');block.className='review';
  const h=document.createElement('strong');h.textContent='Question '+(i+1)+' · '+M.topics[item.q.topic];
  const prompt=document.createElement('p');prompt.textContent=item.q.stem;
  block.append(h,prompt);appendVisual(block,item.q.visual);
  const answer=document.createElement('p');
  answer.textContent=item.kind==='objective'?'Your answer: '+(record.answers[i]===null?'Blank':item.q.options[record.answers[i]])+'\nCorrect answer: '+item.q.options[item.q.answer]+'\nExplanation: '+item.q.explanation:
   'Your written answer:\n'+(record.answers[i]||'[No typed answer]')+'\nTeacher marking required.';
  block.append(answer);
  if(item.kind==='written'&&window.BSSAnswerTools)window.BSSAnswerTools.mount({container:block,namespace:media(),index:i,readonly:true});
  host.append(block)
 });host.hidden=false;host.scrollIntoView({behavior:'smooth'})
};
$('downloadWork').onclick=async()=>{
 const btn=$('downloadWork');btn.disabled=true;btn.textContent='Preparing submission...';
 try{
  await window.BSSAnswerTools.exportBundle({
   namespace:media(),questions:items.map((item,i)=>(i+1)+'. Section '+item.section+' ('+item.marks+' marks): '+item.q.stem),
   answers:items.map((item,i)=>item.kind==='objective'?(record.answers[i]===null?'Blank':item.q.options[record.answers[i]]):record.answers[i]),
   filename:'form3-music-'+cfg.id
  })
 }catch(e){alert('Could not export the Music Theory submission: '+e.message)}
 finally{btn.disabled=false;btn.textContent='Download complete submission (ZIP)'}
};
$('retryExam').onclick=async()=>{
 if(!confirm('Start a fresh attempt? Previous answers, drawings, uploaded files and grade will be replaced.'))return;
 try{await window.BSSAnswerTools.clearNamespace(media(),items.length)}catch{}
 try{localStorage.removeItem(recordKey(cfg.id))}catch{}
 const id=cfg.id;stopClock();start(id)
};
function allGrades(){
 const rows=configs.map(c=>({cfg:c,data:load(c.id)})),submitted=rows.filter(x=>x.data?.status==='submitted');
 const graded=submitted.filter(x=>x.cfg.kind!=='written'&&Number.isInteger(x.data.grade)),pending=submitted.filter(x=>x.cfg.kind!=='objective').length;
 $('completedCount').textContent=submitted.length;$('pendingCount').textContent=pending;
 $('averageGrade').textContent=graded.length?Math.round(graded.reduce((s,x)=>s+x.data.grade/x.data.objectiveTotal*100,0)/graded.length)+'%':'No grades';
 return rows
}
function combinedSkills(){
 const totals=Object.fromEntries(M.sections.map(topic=>[topic,{topic,correct:0,total:0}]));
 configs.filter(c=>c.kind!=='written').forEach(c=>{
  const data=load(c.id);if(data?.status!=='submitted'||!Array.isArray(data.answers))return;
  const questions=makeQuestions(c);
  questions.forEach((item,i)=>{if(item.kind==='objective'){const s=totals[item.q.topic];s.total++;if(data.answers[i]===item.q.answer)s.correct++}})
 });
 return M.sections.map(topic=>({...totals[topic],percent:totals[topic].total?Math.round(totals[topic].correct/totals[topic].total*100):null})).sort((a,b)=>a.percent===null?1:b.percent===null?-1:a.percent-b.percent)
}
function renderStats(){
 allGrades();const host=$('quickRecommendations');host.replaceChildren();
 const weak=combinedSkills().filter(s=>s.percent!==null&&s.percent<85).slice(0,3);
 if(!weak.length){const p=document.createElement('p');p.className='small muted';p.textContent='Complete a 60-question practice or mock objective section to receive recommended lessons.';host.append(p)}
 else weak.forEach(s=>host.append(lessonLink(s.topic,M.topics[s.topic]+' ('+s.percent+'%)')))
}
function renderGrades(){
 const table=document.createElement('table'),head=document.createElement('tr');
 ['Assessment','Status','Grade / Teacher marking'].forEach(x=>{const th=document.createElement('th');th.textContent=x;head.append(th)});table.append(head);
 allGrades().forEach(({cfg,data})=>{
  const tr=document.createElement('tr'),status=data?.status==='submitted'?'Submitted':data?.status==='draft'?'In progress':'Not started';
  let grade='Not graded';
  if(data?.status==='submitted')grade=cfg.kind==='objective'?data.grade+'/60 ('+Math.round(data.grade/60*100)+'%)':cfg.kind==='mixed'?'Objective '+data.grade+'/25; written 25 pending':'25 written marks awaiting teacher';
  [cfg.title,status,grade].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});table.append(tr)
 });
 $('gradeTable').replaceChildren(table)
}
function renderLessons(){
 const scores=combinedSkills(),recommended=$('lessonRecommendations');recommended.replaceChildren();
 if(!scores.some(s=>s.total)){const p=document.createElement('p');p.textContent='Complete an objective practice or mock to receive personalised learning suggestions.';recommended.append(p)}
 else scores.filter(s=>s.total).forEach(s=>recommended.append(lessonLink(s.topic,M.topics[s.topic]+' ('+s.percent+'%)')));
 const host=$('lessonContent');host.replaceChildren();
 L.forEach(lesson=>{
  const s=scores.find(x=>x.topic===lesson.key),box=document.createElement('article');box.id='lesson-'+lesson.key;box.className='lesson';
  const h=document.createElement('h3');h.textContent=lesson.title;
  const p=document.createElement('p');p.className='small muted';p.textContent=s?.percent===null?'Not yet assessed':'Your marked score: '+s.percent+'% ('+s.correct+'/'+s.total+')';
  const ul=document.createElement('ul');lesson.goals.forEach(g=>{const li=document.createElement('li');li.textContent=g;ul.append(li)});
  const details=document.createElement('details');details.open=s?.percent!==null&&s?.percent<70;
  const summary=document.createElement('summary');summary.textContent='Open the full lesson and worked example';details.append(summary);
  lesson.steps.forEach(([title,body])=>{const sec=document.createElement('section'),h4=document.createElement('h4'),txt=document.createElement('p');h4.textContent=title;txt.textContent=body;sec.append(h4,txt);details.append(sec)});
  const worked=document.createElement('p');worked.textContent='Worked example: '+lesson.example;details.append(worked);
  const subtitle=document.createElement('h4');subtitle.textContent='Try it yourself';details.append(subtitle);
  const ol=document.createElement('ol');lesson.check.forEach(q=>{const li=document.createElement('li');li.textContent=q;ol.append(li)});details.append(ol);
  if(['values','rests','ledger','excerpt'].includes(lesson.key)){
   const example=lesson.key==='values'?{type:'note',value:'quarter'}:lesson.key==='rests'?{type:'rest',value:'quarter rest'}:lesson.key==='ledger'?{type:'staff',pitch:'C4'}:{type:'excerpt',version:0};
   appendVisual(details,example)
  }
  box.append(h,p,ul,details);host.append(box)
 })
}
function openLesson(topic){
 navigate('lessons');const node=document.getElementById('lesson-'+topic);
 if(node){const details=node.querySelector('details');if(details)details.open=true;node.scrollIntoView({behavior:'smooth',block:'start'})}
}
function boot(){
 if(!M||!W||!L||!N||M.papers.length!==5||W.length!==3||L.length!==6)return fail('Music learning files did not load. Refresh the page.');
 renderStats();const params=new URLSearchParams(location.search);
 if(params.get('exam')){start(params.get('exam'));return}
 if(M.sections.includes(params.get('lesson'))){openLesson(params.get('lesson'));return}
 navigate(params.get('tab')||'overview')
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cfg?.minutes&&record?.status==='draft')tick()});
window.addEventListener('pageshow',()=>{if(cfg?.minutes&&record?.status==='draft')tick();else renderStats()});
boot();
})();