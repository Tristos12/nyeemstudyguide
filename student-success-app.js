(function(){
'use strict';
const $=id=>document.getElementById(id);
const B=window.BSS_SUCCESS_BANK,L=window.BSS_SUCCESS_LESSONS,V=window.BSS_SUCCESS_VIDEOS;
const topics=['test','study','time','knowledge','vocab'];
const labels=B?.names||{};
const KEY='bss_student_success_v1_';
const configs=[
 ...topics.map(id=>({id:'topic-'+id,title:labels[id]+' Practice',topics:[id],count:B.questions[id].length,minutes:0})),
 {id:'mixed-30',title:'Mixed Knowledge and Skills Challenge',topics,count:30,minutes:0},
 {id:'timed-30',title:'Timed Study Skills Challenge',topics,count:30,minutes:30}
];
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(KEY+key));return v===null?fallback:v}catch{return fallback}};
const write=(key,v)=>{try{localStorage.setItem(KEY+key,JSON.stringify(v))}catch(err){console.warn('Local save unavailable',err)}};
const select=(selector)=>document.querySelectorAll(selector);
const node=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el};
function button(text,onclick,className=''){const b=node('button',text);b.type='button';b.onclick=onclick;b.className=className;return b}
function linkLesson(topic,i){const a=node('a','Study: '+L[topic].lessons[i].title);a.href='?lesson='+encodeURIComponent(topic)+'-'+i;a.className='btn';return a}
let cfg=null,attempt=null,questions=[],clockId=null,focusId=null,focusEnds=null,focusLeft=25*60,flashIndex=0,flashShown=false;
function questionsFor(config){
 const pool=[];
 config.topics.forEach(topic=>B.questions[topic].forEach((q,i)=>pool.push({...q,id:topic+'-'+i})));
 // A fixed, diverse selection makes saved practice attempts resumable.
 if(config.topics.length===1)return pool;
 const out=[],indexes=Object.fromEntries(config.topics.map(t=>[t,0]));
 while(out.length<config.count){
  for(const topic of config.topics){
   const list=B.questions[topic];
   if(out.length<config.count&&indexes[topic]<list.length){
    out.push({...list[indexes[topic]],id:topic+'-'+indexes[topic]});
    indexes[topic]++;
   }
  }
 }
 return out;
}
function assessments(){return read('assessments',{})}
function saveAttempt(){
 if(!cfg||!attempt)return;
 const all=assessments();all[cfg.id]=attempt;write('assessments',all);
}
function hideQuiz(){if(clockId!==null){clearInterval(clockId);clockId=null}cfg=null;attempt=null;questions=[];$('quizView').hidden=true;$('quizResult').hidden=true}
function renderNav(tab){select('.tab').forEach(x=>x.hidden=x.id!==tab);select('nav button[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab))}
function tab(name){hideQuiz();const allowed=['overview','lessons','videos','practice','planner','flashcards','progress'];renderNav(allowed.includes(name)?name:'overview');if(name==='overview'||!name)renderOverview();if(name==='practice')renderPracticeCards();if(name==='videos')renderVideos();if(name==='progress')renderProgress();if(name==='planner')renderPlan()}
function videoMarks(){return read('videoChecks',{})}
function openVideos(topic){
 if(!V?.[topic])return;
 hideQuiz();renderNav('videos');$('videoTopic').value=topic;renderVideos();
}
function renderVideos(){
 const topic=$('videoTopic').value||topics[0],target=$('videoTutorials');
 target.replaceChildren();if(!V?.[topic])return;
 const lesson=V[topic],progress=videoMarks()[topic];
 const intro=node('p',lesson.intro);intro.className='muted';target.append(intro);
 lesson.clips.forEach((clip,index)=>{
  const section=node('article');section.className='video-card';
  section.append(node('h3',(index+1)+'. '+clip.title),node('p',clip.publisher+' · '+clip.focus));
  const player=node('div');player.className='video-frame';
  // No third-party request until the learner explicitly chooses play.
  const load=button('▶ Play video lesson',()=>{
   const iframe=node('iframe');
   iframe.src='https://www.youtube-nocookie.com/embed/'+clip.id+'?rel=0';
   iframe.title=clip.title+' educational video';
   iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
   iframe.setAttribute('allowfullscreen','');
   iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
   player.replaceChildren(iframe);
  });
  player.append(load);section.append(player);
  const direct=node('a','Open video on YouTube if playback is blocked');
  direct.href='https://www.youtube.com/watch?v='+clip.id;
  direct.target='_blank';direct.rel='noopener noreferrer';section.append(direct);
  section.append(node('p','After watching: '+clip.task));
  target.append(section);
 });
 if(lesson.extra){
  const extra=node('article');extra.className='video-card';
  extra.append(node('h3',lesson.extra.title),node('p',lesson.extra.publisher+' · '+lesson.extra.task));
  const link=node('a','Open the additional learning resource');link.href=lesson.extra.url;link.target='_blank';link.rel='noopener noreferrer';extra.append(link);target.append(extra);
 }
 const assessment=node('div');assessment.className='checkpoint';
 assessment.append(node('h3','Quick check after watching'),node('p',lesson.check.question));
 const feedback=node('p');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 lesson.check.options.forEach((opt,i)=>{
  assessment.append(button(String.fromCharCode(65+i)+'. '+opt,()=>{
   const ok=i===lesson.check.correct;
   feedback.textContent=(ok?'Correct. ':'Not quite. ')+lesson.check.feedback;
   if(ok){const completed=videoMarks();completed[topic]=true;write('videoChecks',completed);renderStats()}
  }));
 });
 assessment.append(feedback);
 const p=node('p',progress?'Checkpoint previously completed.':'Watch the lesson, then select an answer.');
 p.className='muted';assessment.append(p);target.append(assessment);
 const nav=node('div');nav.className='row';
 nav.append(button('Study the written mini lessons',()=>{
  renderNav('lessons');$('lessonTopic').value=topic;renderLessons();
 }),button('Try the topic practice',()=>launch('topic-'+topic),'primary'));
 target.append(nav);
}
function openLesson(topic,index){
 if(!L[topic])return tab('lessons');
 hideQuiz();renderNav('lessons');$('lessonTopic').value=topic;renderLessons();
 const target=$('lesson-'+topic+'-'+index);if(target&&typeof target.scrollIntoView==='function')target.scrollIntoView({block:'start',behavior:'smooth'});
}
function studyMarks(){return read('studied',{})}
function lessonCount(){return Object.values(studyMarks()).filter(Boolean).length}
function recommendationScores(record){
 const stats={};record.items.forEach((q,i)=>{
  if(!stats[q.topic])stats[q.topic]={total:0,correct:0};
  stats[q.topic].total++;if(record.answers[i]===q.answer)stats[q.topic].correct++;
 });
 return stats;
}
function weakTopics(){
 const latest=[];
 Object.values(assessments()).filter(v=>v.status==='submitted').sort((a,b)=>b.submittedAt-a.submittedAt).forEach(a=>{
  if(latest.length===0||a.submittedAt===latest[0].submittedAt){latest.push(a)}
 });
 if(!latest.length)return [];
 const agg={};Object.values(assessments()).filter(a=>a.status==='submitted').forEach(a=>{
  const s=recommendationScores(a);Object.entries(s).forEach(([topic,v])=>{
   agg[topic]??={correct:0,total:0};agg[topic].correct+=v.correct;agg[topic].total+=v.total;
  });
 });
 return Object.entries(agg).map(([topic,v])=>({topic,...v,pct:100*v.correct/v.total})).sort((a,b)=>a.pct-b.pct);
}
function renderOverview(){
 const cards=$('topicCards');cards.replaceChildren();
 topics.forEach(t=>{
  const box=node('article');box.className='tile';box.append(node('h3',labels[t]),node('p',L[t].lessons.length+' detailed lessons · '+B.questions[t].length+' practice questions'));
  const actions=node('div');actions.className='row';actions.append(button('Study lessons',()=>{renderNav('lessons');$('lessonTopic').value=t;renderLessons()}),button('Watch tutorials',()=>openVideos(t)),button('Practise',()=>launch('topic-'+t),'primary'));box.append(actions);cards.append(box);
 });
 const target=$('quickRecommendations');target.replaceChildren();
 const weak=weakTopics();
 if(!weak.length){target.append(node('p','Complete a practice to get specific mini-lesson recommendations. Start with the area that feels most difficult.'));return}
 weak.slice(0,4).forEach(({topic,pct})=>{
  const row=node('div');row.className='target';row.append(node('strong',labels[topic]+' · '+Math.round(pct)+'%'));
  row.append(node('span',pct<70?' · Priority revision':pct<85?' · Keep practising':' · Current strength'));
  const lessonIndex=topic==='vocab'?0:0;row.append(linkLesson(topic,lessonIndex),button('Watch video',()=>openVideos(topic)));target.append(row)
 });
}
function renderLessons(){
 const topic=$('lessonTopic').value,target=$('lessonItems');target.replaceChildren();if(!L[topic])return;
 const done=studyMarks();
 L[topic].lessons.forEach((lesson,i)=>{
  const card=node('article');card.className='lesson';card.id='lesson-'+topic+'-'+i;
  card.append(node('h3',(i+1)+'. '+lesson.title));
  const goals=node('p');goals.className='muted';goals.textContent='Learning goal: '+(lesson.title||'Study this topic');card.append(goals);
  card.append(node('p',lesson.body));
  const example=node('p');example.style.marginTop='9px';example.append(node('strong','Example: '),document.createTextNode(lesson.example));card.append(example);
  const cb=document.createElement('label');cb.className='row';cb.style.marginTop='12px';
  const check=document.createElement('input');check.type='checkbox';check.checked=!!done[topic+'-'+i];
  check.onchange=()=>{const d=studyMarks();d[topic+'-'+i]=check.checked;write('studied',d);renderStats()};
  cb.append(check,node('span','I have studied this lesson'));card.append(cb);target.append(card);
 });
}
function renderStats(){
 const all=Object.values(assessments()).filter(x=>x.status==='submitted');
 const avg=all.length?Math.round(all.reduce((s,a)=>s+(100*a.score/a.items.length),0)/all.length):null;
 $('completed').textContent=String(all.length);
 $('average').textContent=avg===null?'—':avg+'%';
 $('lessonsRead').textContent=String(lessonCount());
 const today=new Date().toLocaleDateString('en-CA');
 const tasks=read('plans',[]);$('minutesPlanned').textContent=String(tasks.filter(x=>x.date===today).reduce((s,x)=>s+Number(x.minutes),0));
}
function renderPracticeCards(){
 const target=$('practiceCards');target.replaceChildren();
 configs.forEach(c=>{
  const div=node('article');div.className='tile';
  div.append(node('h3',c.title),node('p',c.count+' questions · '+(c.minutes?c.minutes+'-minute timed challenge':'Untimed')));
  const current=assessments()[c.id];
  if(current)div.append(node('p',current.status==='submitted'?'Last score: '+current.score+'/'+current.items.length:'Saved draft · '+current.answers.filter(x=>x!==null).length+' answered'));
  div.append(button(current?.status==='draft'?'Resume practice':'Start practice',()=>launch(c.id),'primary'));target.append(div)
 });
}
function launch(id,force=false){
 const conf=configs.find(c=>c.id===id);if(!conf)return;
 hideQuiz();cfg=conf;questions=questionsFor(conf);
 const old=assessments()[id];
 if(old?.status==='draft'&&!force&&old.items?.length===questions.length){
  attempt=old;questions=old.items;
 }else{
  attempt={id,status:'draft',items:questions,answers:Array(questions.length).fill(null),position:0,startedAt:Date.now(),deadline:conf.minutes?Date.now()+conf.minutes*60000:null};
  saveAttempt();
 }
 select('.tab').forEach(x=>x.hidden=true);select('nav button[data-tab]').forEach(b=>b.classList.remove('active'));
 $('quizView').hidden=false;$('quizResult').hidden=true;$('quizTitle').textContent=conf.title;
 renderQuestion();
 if(conf.minutes){clockId=setInterval(tick,1000);tick()}else $('quizClock').textContent='Untimed';
}
function tick(){
 if(!cfg||!attempt||!cfg.minutes)return;
 const left=Math.max(0,Math.ceil((attempt.deadline-Date.now())/1000));
 $('quizClock').textContent='Time left: '+String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
 if(left<=0)submit(true)
}
function renderQuestion(){
 if(!cfg||!attempt)return;
 const pos=attempt.position,q=questions[pos],options=$('quizOptions');options.replaceChildren();
 $('quizQuestion').textContent=q.stem;
 $('quizStatus').textContent='Question '+(pos+1)+' of '+questions.length+' · '+labels[q.topic];
 $('quizBar').max=questions.length;$('quizBar').value=pos+1;
 q.options.forEach((option,index)=>{
  const b=button(String.fromCharCode(65+index)+'. '+option,()=>{attempt.answers[pos]=index;saveAttempt();renderQuestion()});
  if(attempt.answers[pos]===index)b.classList.add('chosen');
  options.append(b);
 });
 $('quizPrevious').disabled=pos===0;
 $('quizNext').disabled=pos===questions.length-1;
 $('quizSubmit').textContent=pos===questions.length-1?'Submit answers':'Submit practice';
}
function move(delta){if(!attempt)return;attempt.position=Math.max(0,Math.min(questions.length-1,attempt.position+delta));saveAttempt();renderQuestion();if(cfg?.minutes)tick()}
function submit(expired=false){
 if(!attempt||attempt.status==='submitted')return;
 const unanswered=attempt.answers.filter(x=>x===null).length;
 if(!expired&&unanswered&&!confirm(unanswered+' questions are unanswered. Submit now?'))return;
 const score=questions.reduce((s,q,i)=>s+(attempt.answers[i]===q.answer?1:0),0);
 attempt.status='submitted';attempt.submittedAt=Date.now();attempt.expired=expired;attempt.score=score;saveAttempt();
 if(clockId!==null){clearInterval(clockId);clockId=null}
 $('quizView').hidden=true;$('quizResult').hidden=false;
 $('resultTitle').textContent=cfg.title+' completed';
 $('resultSummary').textContent='Score: '+score+' / '+questions.length+' · '+Math.round(100*score/questions.length)+'%'+(expired?' · Time expired':'');
 const stats=recommendationScores(attempt),table=node('table'),head=node('tr');
 ['Topic','Correct','Total','Accuracy'].forEach(t=>head.append(node('th',t)));table.append(head);
 Object.entries(stats).forEach(([t,v])=>{
  const tr=node('tr');[labels[t],v.correct,v.total,Math.round(v.correct/v.total*100)+'%'].forEach(a=>tr.append(node('td',String(a))));table.append(tr)
 });$('resultSections').replaceChildren(table);
 const suggest=$('resultRecommendations');suggest.replaceChildren();
 const sorted=Object.entries(stats).map(([t,v])=>({t,accuracy:v.correct/v.total})).sort((a,b)=>a.accuracy-b.accuracy);
 sorted.slice(0,3).forEach(({t,accuracy})=>{
  const box=node('div');box.className='target';box.append(node('strong',labels[t]+' · '+Math.round(accuracy*100)+'%'));
  box.append(node('p',accuracy<.7?'Revise this topic before trying another practice.':accuracy<.85?'Review and practise this topic again.':'Maintain your skills with occasional practice.'));
  const lessonIndexes=accuracy<.85?[0,1]:[0];lessonIndexes.forEach(i=>box.append(linkLesson(t,i)));box.append(button('Watch recommended video',()=>openVideos(t)));suggest.append(box);
 });
 const details=$('resultDetails');details.hidden=true;details.replaceChildren();
 attempt.items.forEach((q,i)=>{
  const item=node('div');item.className='review '+(attempt.answers[i]===q.answer?'correct':'incorrect');
  item.append(node('strong',(i+1)+'. '+q.stem),node('p','Your answer: '+(attempt.answers[i]===null?'Not answered':q.options[attempt.answers[i]])));
  item.append(node('p','Correct answer: '+q.options[q.answer]),node('p','Explanation: '+q.explanation));details.append(item)
 });
 renderStats();
}
function renderProgress(){
 const entries=Object.values(assessments()).sort((a,b)=>(b.submittedAt||b.startedAt)-(a.submittedAt||a.startedAt)),target=$('progressTable');
 target.replaceChildren();if(!entries.length){target.append(node('p','No assessments yet. Start a practice to see your results here.'));return}
 const table=node('table'),head=node('tr');['Practice','Status','Score','Date'].forEach(v=>head.append(node('th',v)));table.append(head);
 entries.forEach(a=>{
  const tr=node('tr'),conf=configs.find(x=>x.id===a.id);
  const date=new Date(a.submittedAt||a.startedAt).toLocaleDateString();
  [conf?.title||a.id,a.status==='submitted'?'Submitted':'Saved draft',a.status==='submitted'?a.score+'/'+a.items.length:'Not graded',date].forEach(v=>tr.append(node('td',String(v))));table.append(tr);
 });target.append(table);
}
function renderPlan(){
 const list=read('plans',[]),target=$('planItems');target.replaceChildren();
 if(!list.length){target.append(node('p','No study tasks yet. Add a subject, date, duration and priority.'));return}
 list.sort((a,b)=>a.date.localeCompare(b.date)||({High:0,Medium:1,Low:2}[a.priority]-{High:0,Medium:1,Low:2}[b.priority])).forEach(t=>{
  const row=node('div');row.className='target row spread';
  const left=node('label');left.className='row';const cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.onchange=()=>{const p=read('plans',[]),x=p.find(x=>x.id===t.id);if(x){x.done=cb.checked;write('plans',p)}renderPlan()};left.append(cb,node('span',t.name+' · '+t.date+' · '+t.minutes+' min · '+t.priority));row.append(left);
  row.append(button('Remove',()=>{write('plans',read('plans',[]).filter(x=>x.id!==t.id));renderPlan()}));target.append(row);
 });renderStats()
}
const cards=[
 ['Resilient','Able to recover or adapt after difficulties.','The resilient learner reviewed errors and improved.'],
 ['Concise','Brief but clear.','Her concise answer gave the two required points.'],
 ['Infer','Draw a conclusion from evidence.','We infer the character is afraid from his trembling hands.'],
 ['Evaluate','Judge using reasons and evidence.','Evaluate the advantages and disadvantages of the plan.'],
 ['Justify','Support a statement with reasons.','Justify your choice of a renewable energy source.'],
 ['Ambiguous','Open to more than one interpretation.','The ambiguous question could be understood in two ways.'],
 ['Collaborate','Work together towards a goal.','The group will collaborate on a science project.'],
 ['Essential','Necessary or extremely important.','Water is essential for human life.'],
 ['Treacherous','Dangerous or unreliable.','The treacherous path was slippery.'],
 ['Abundant','Available in large quantities.','Rainfall was abundant that month.'],
 ['Contrast','Explain differences.','Contrast renewable and non-renewable energy.'],
 ['Analyse','Study parts closely and explain their relationship.','Analyse how sound changes the mood of the scene.'],
 ['Prioritise','Decide what should receive attention first.','Prioritise tomorrow’s examination revision.'],
 ['Persistent','Continuing despite difficulty.','She was persistent in practising her reading.'],
 ['Interpret','Explain the meaning of information.','Interpret the graph before answering.'],
 ['Objective','A goal or desired outcome.','The protagonist’s objective is to find the letter.'],
 ['Motivation','The reason someone acts or wants something.','His motivation was to help his family.'],
 ['Context','The circumstances surrounding an event or statement.','Use context to understand the unfamiliar word.'],
 ['Relevant','Closely connected to the question or topic.','Provide two relevant examples.'],
 ['Summarise','Express the main points briefly.','Summarise the article in five sentences.']
];
function renderFlash(){
 const [word,meaning,example]=cards[flashIndex];
 $('flashCard').textContent=flashShown?word+'\n\n'+meaning+'\n'+example:word;
 $('flashReveal').textContent=flashShown?'Hide meaning':'Reveal meaning';
 $('flashCounter').textContent='Card '+(flashIndex+1)+' of '+cards.length;
}
function downloadProgress(){
 const payload={exportedAt:new Date().toISOString(),assessments:assessments(),plans:read('plans',[]),studied:studyMarks()};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='bss-student-success-progress.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function focusDisplay(){const min=Math.floor(focusLeft/60),secs=focusLeft%60;$('focusClock').textContent=String(min).padStart(2,'0')+':'+String(secs).padStart(2,'0')}
function stopFocus(){if(focusId!==null){clearInterval(focusId);focusId=null}}
function focusTick(){if(focusEnds){focusLeft=Math.max(0,Math.ceil((focusEnds-Date.now())/1000));focusDisplay();if(focusLeft===0){stopFocus();focusEnds=null;$('focusStart').textContent='Start focus';$('focusClock').textContent='Finished!'}}}
function setup(){
 if(!B||!L||!V||topics.some(t=>!B.questions[t]?.length||L[t].lessons.length!==5||!V[t]?.clips?.length)){
  document.querySelector('main').prepend(node('p','Learning material could not load. Refresh the page.'));return
 }
 topics.forEach(t=>{$('lessonTopic').append(new Option(labels[t],t));$('videoTopic').append(new Option(labels[t],t))});
 select('nav button[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
 $('lessonTopic').onchange=renderLessons;
 $('videoTopic').onchange=renderVideos;
 $('lessonVideo').onclick=()=>openVideos($('lessonTopic').value);
 $('quizPrevious').onclick=()=>move(-1);$('quizNext').onclick=()=>move(1);
 $('quizSubmit').onclick=()=>submit(false);$('quizExit').onclick=()=>tab('practice');
 $('resultReview').onclick=()=>{$('resultDetails').hidden=!$('resultDetails').hidden};
 $('resultRetry').onclick=()=>{const id=cfg.id;if(confirm('Restart this practice with cleared answers?'))launch(id,true)};
 $('resultOther').onclick=()=>tab('practice');
 $('planForm').onsubmit=e=>{e.preventDefault();const name=$('planSubject').value.trim(),date=$('planDate').value,minutes=Number($('planDuration').value),priority=$('planPriority').value;
  if(!name||!date||minutes<5||minutes>180)return;
  const p=read('plans',[]);p.push({id:Date.now()+'-'+p.length,name,date,minutes,priority,done:false});write('plans',p);$('planSubject').value='';renderPlan()
 };
 $('planDate').value=new Date().toLocaleDateString('en-CA');
 $('focusDuration').onchange=()=>{if(focusId===null){focusLeft=Number($('focusDuration').value)*60;focusDisplay()}};
 $('focusStart').onclick=()=>{if(focusId!==null)return;focusEnds=Date.now()+focusLeft*1000;focusId=setInterval(focusTick,1000);$('focusStart').textContent='Running';focusTick()};
 $('focusPause').onclick=()=>{focusTick();stopFocus();focusEnds=null;$('focusStart').textContent='Resume focus'};
 $('focusReset').onclick=()=>{stopFocus();focusEnds=null;focusLeft=Number($('focusDuration').value)*60;focusDisplay();$('focusStart').textContent='Start focus'};
 $('flashBack').onclick=()=>{flashIndex=(flashIndex-1+cards.length)%cards.length;flashShown=false;renderFlash()};
 $('flashNext').onclick=()=>{flashIndex=(flashIndex+1)%cards.length;flashShown=false;renderFlash()};
 $('flashReveal').onclick=()=>{flashShown=!flashShown;renderFlash()};
 $('exportProgress').onclick=downloadProgress;
 renderFlash();renderOverview();renderPracticeCards();renderLessons();renderVideos();renderStats();
 const params=new URLSearchParams(location.search),exam=params.get('quiz'),lesson=params.get('lesson'),selected=params.get('tab');
 if(exam){launch(exam);return}
 if(params.get('video')&&V[params.get('video')]){openVideos(params.get('video'));return}
 if(lesson){const [t,i]=lesson.split('-');if(topics.includes(t)&&Number.isInteger(Number(i)))return openLesson(t,Math.max(0,Math.min(4,Number(i))))}
 tab(selected||'overview');
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(cfg?.minutes&&attempt?.status==='draft')tick();if(focusId!==null)focusTick()}});
window.addEventListener('pageshow',()=>{if(cfg?.minutes&&attempt?.status==='draft')tick();renderStats()});
setup();
})();