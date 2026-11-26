/* Independent Form 3 Mathematics mock examination loader. */
(function(){
'use strict';
const $=id=>document.getElementById(id),bank=window.BSS_MATH,structured=window.BSS_MATH_STRUCTURED;
const mocks={
 u1:{id:'mock-u1',title:'Untimed Mock 1',paper:0,minutes:0},
 u2:{id:'mock-u2',title:'Untimed Mock 2',paper:1,minutes:0},
 t1:{id:'mock-t1',title:'Timed Mock 1',paper:2,minutes:75},
 t2:{id:'mock-t2',title:'Timed Mock 2',paper:3,minutes:75}
};
let key=null,cfg=null,items=[],state=null,interval=null;
const storageKey=id=>'bss_f3_maths_2026_v1_'+id;
function read(id){try{return JSON.parse(localStorage.getItem(storageKey(id))||'null')}catch{return null}}
function write(){try{localStorage.setItem(storageKey(cfg.id),JSON.stringify(state));$('saveInfo').textContent='Answers saved on this browser.';return true}catch{$('saveInfo').textContent='Browser storage unavailable. Your answers may not be saved.';return false}}
function show(id){for(const part of ['choose','exam','result','error'])$(part).hidden=part!==id;window.scrollTo(0,0)}
function fail(msg){$('errorText').textContent=msg;show('error')}
function stopTimer(){if(interval!==null){clearInterval(interval);interval=null}}
function build(c){
 const paper=bank.papers[c.paper];
 if(!Array.isArray(paper)||paper.length!==60)throw Error('60-question Mathematics bank unavailable');
 const objective=[];
 for(let k=0;k<10;k++)objective.push(paper[k*6],paper[k*6+1]);
 const form=structured[c.paper%3];
 if(!form||form.sectionB.reduce((s,q)=>s+q.marks,0)!==20||form.sectionC.reduce((s,q)=>s+q.marks,0)!==10)throw Error('Structured exam is missing');
 return objective.map(q=>({type:'objective',topic:q.topic,q})).concat(
  form.sectionB.map(q=>({type:'written',part:'B',q})),
  form.sectionC.map(q=>({type:'written',part:'C',q}))
 );
}
function openMock(which){
 key=which;cfg=mocks[which];if(!cfg){show('choose');return}
 try{items=build(cfg)}catch(err){fail(err.message);return}
 state=read(cfg.id);
 if(state?.status==='submitted'&&Array.isArray(state.answers)&&state.answers.length===30){results();return}
 if(state?.status!=='draft'||!Array.isArray(state.answers)||state.answers.length!==30){
  state={status:'draft',answers:items.map(it=>it.type==='objective'?null:''),position:0,started:Date.now(),deadline:cfg.minutes?Date.now()+cfg.minutes*60000:null};
 }
 if(cfg.minutes&&(!Number.isFinite(state.deadline)||Date.now()>=state.deadline)){
  submit(true);return
 }
 write();show('exam');render();
 stopTimer();if(cfg.minutes){tick();interval=setInterval(tick,1000)}else $('timer').textContent='Untimed'
}
function tick(){
 if(!cfg?.minutes||state?.status!=='draft')return;
 const left=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
 $('timer').textContent='Time remaining '+String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
 if(left===0)submit(true)
}
function render(){
 const i=Math.min(items.length-1,Math.max(0,Number.isInteger(state.position)?state.position:0));
 state.position=i;
 const item=items[i],host=$('question');host.replaceChildren();
 $('examTitle').textContent=cfg.title;
 const done=state.answers.filter((ans,j)=>items[j].type==='objective'?ans!==null:typeof ans==='string'&&!!ans.trim()).length;
 $('positionLabel').textContent='Question '+(i+1)+' of 30 · '+done+' answered';
 $('bar').style.width=(100*done/items.length)+'%';
 const h=document.createElement('h3');h.textContent=item.type==='objective'?'Section A · '+bank.topicNames[item.topic]+' · 1 mark':'Section '+item.part+' · '+item.q.marks+' marks';
 const p=document.createElement('p');p.textContent=item.type==='objective'?item.q.stem:item.q.stem;host.append(h,p);
 if(item.type==='objective'){
  const opts=document.createElement('div');opts.className='answers';
  item.q.options.forEach((opt,k)=>{
   const btn=document.createElement('button');btn.type='button';btn.textContent='ABCD'[k]+'. '+opt;btn.className=state.answers[i]===k?'selected':'';
   btn.setAttribute('aria-pressed',String(state.answers[i]===k));
   btn.onclick=()=>{state.answers[i]=k;write();render()};opts.append(btn)
  });host.append(opts)
 }else{
  const label=document.createElement('label');label.textContent='Write your complete working and answer.';label.htmlFor='writtenAnswer';
  const textarea=document.createElement('textarea');textarea.id='writtenAnswer';textarea.maxLength=16000;textarea.value=state.answers[i]||'';
  textarea.oninput=()=>{state.answers[i]=textarea.value;write()};
  const note=document.createElement('p');note.className='small muted';note.textContent='Show calculations, explanations and units. Written solutions will be reviewed by a teacher.';
  host.append(label,textarea,note)
 }
 $('prev').disabled=i===0;$('next').disabled=i===items.length-1
}
$('prev').onclick=()=>{if(state.position>0){state.position--;write();render()}};
$('next').onclick=()=>{if(state.position<items.length-1){state.position++;write();render()}};
$('leave').onclick=()=>{write();stopTimer();location.href='./form-3-math-mocks.html'};
function submit(expired=false){
 if(!cfg||!state||state.status!=='draft')return;
 const unanswered=state.answers.filter((x,i)=>items[i].type==='objective'?x===null:!String(x||'').trim()).length;
 if(!expired&&unanswered&&!confirm(unanswered+' answers are blank. Submit anyway?'))return;
 if(!expired&&!confirm('Submit '+cfg.title+'? You will receive your Section A grade.'))return;
 const grade=items.slice(0,20).reduce((s,item,i)=>s+(state.answers[i]===item.q.answer?1:0),0);
 state.status='submitted';state.grade=grade;state.submittedAt=new Date().toISOString();state.expired=expired;write();results()
}
$('submit').onclick=()=>submit(false);
function results(){
 stopTimer();show('result');
 $('resultTitle').textContent=cfg.title+(state.expired?' · Time expired':' · Submitted');
 const grade=items.slice(0,20).reduce((s,item,i)=>s+(state.answers[i]===item.q.answer?1:0),0);
 $('resultScore').textContent='Section A: '+grade+'/20 ('+Math.round(grade*5)+'%). Sections B and C: 30 marks awaiting teacher marking. No total out of 50 can be given until writing is assessed.';
 const table=document.createElement('table'),tr=document.createElement('tr');
 for(const x of ['Topic','Correct','Total','Mini lesson']){const th=document.createElement('th');th.textContent=x;tr.append(th)}table.append(tr);
 const priorities=[];
 for(let k=0;k<10;k++){
  const key=bank.sections[k],a=items[k*2],b=items[k*2+1];
  const correct=Number(state.answers[k*2]===a.q.answer)+Number(state.answers[k*2+1]===b.q.answer),pct=correct*50;
  const row=document.createElement('tr');
  for(const x of [bank.topicNames[key],correct,2]){const td=document.createElement('td');td.textContent=String(x);row.append(td)}
  const td=document.createElement('td');
  if(pct<85){priorities.push({key,pct});const link=document.createElement('a');link.href='./form-3-mathematics.html?lesson='+key;link.textContent='Study lesson';td.append(link)}
  else td.textContent='On track';
  row.append(td);table.append(row)
 }
 $('breakdown').replaceChildren(table);
 priorities.sort((a,b)=>a.pct-b.pct);
 const box=$('recommendations');box.replaceChildren();
 const head=document.createElement('h3');head.textContent='Your Next Step: Recommended Mini Lessons';box.append(head);
 const intro=document.createElement('p');intro.textContent='Based on your objective answers. Each topic has only two questions in this mock, so use these as initial revision suggestions.';box.append(intro);
 for(const [i,p] of priorities.entries()){
  const a=document.createElement('a');a.className='action';a.style.margin='4px';
  a.href='./form-3-mathematics.html?lesson='+p.key;
  a.textContent=(i===0?'Start here: ':'Study ')+bank.topicNames[p.key]+' ('+p.pct+'%)';box.append(a)
 }
 if(!priorities.length){const a=document.createElement('a');a.href='./form-3-mathematics.html?tab=lessons';a.textContent='Browse all lessons';box.append(a)}
 $('reviewArea').hidden=true;$('reviewArea').replaceChildren()
}
$('review').onclick=()=>{
 const host=$('reviewArea');host.replaceChildren();
 items.forEach((item,i)=>{
  const div=document.createElement('div');div.className='review';
  const h=document.createElement('strong');h.textContent='Question '+(i+1)+(item.type==='written'?' · Section '+item.part:' · '+bank.topicNames[item.topic]);
  const stem=document.createElement('p');stem.textContent=item.q.stem;
  const response=document.createElement('p');
  if(item.type==='objective')response.textContent='Your answer: '+(state.answers[i]===null?'Blank':item.q.options[state.answers[i]])+'\nCorrect answer: '+item.q.options[item.q.answer]+'\nExplanation: '+item.q.explanation;
  else response.textContent='Your answer:\n'+(state.answers[i]||'[No response]')+'\nTeacher marking required.';
  div.append(h,stem,response);host.append(div)
 });
 host.hidden=false;host.scrollIntoView({behavior:'smooth'})
};
$('retry').onclick=()=>{
 if(!confirm('Restart this mock? The saved score and written answers will be replaced.'))return;
 try{localStorage.removeItem(storageKey(cfg.id))}catch{}
 openMock(key)
};
$('download').onclick=()=>{
 const lines=['Babonneau Secondary School','Form 3 Mathematics',cfg.title,'Section A: '+(state.grade??'')+'/20','Sections B and C await teacher marking',''];
 items.forEach((item,i)=>{lines.push('Question '+(i+1)+' - '+item.q.stem,item.type==='objective'?(state.answers[i]===null?'Blank':item.q.options[state.answers[i]]):(state.answers[i]||'Blank'),'')});
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=cfg.id+'-student-responses.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)
};
const ids=Object.keys(mocks),saved=ids.map(k=>{const r=read(mocks[k].id);return mocks[k].title+': '+(r?.status==='submitted'?'Completed':r?.status==='draft'?'In progress':'Not started')});
$('savedList').textContent=saved.join(' · ');
try{const which=new URLSearchParams(location.search).get('mock');if(which)openMock(which);else show('choose')}
catch(err){fail(err?.message||'Unknown loading error')}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state?.status==='draft'&&cfg?.minutes)tick()});
})();