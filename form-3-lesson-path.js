/* Form 3 personal lesson recommendations. This module never uploads results. */
(function(){
'use strict';
const counts=[['spelling',12],['vocabulary',12],['grammar',12],['equivalent',7],['mainidea',7],['reading',10]];
const labels={spelling:'Spelling',vocabulary:'Vocabulary',grammar:'Grammar',equivalent:'Equivalent Sentences',mainidea:'Main Idea',reading:'Reading Comprehension'};
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function build(){
 const raw=[window.FORM3_EXPANDED_A,window.FORM3_EXPANDED_B,window.FORM3_PAPER_ADDITIONS];
 if(raw.some(r=>!r))return null;
 const bank={};
 for(const [key,count] of counts){
  bank[key]=raw.flatMap(src=>Array.isArray(src[key])?src[key]:[]);
  if(bank[key].length<5*count)return null
 }
 return bank
}
function report(){
 const bank=build(),results=[];
 if(!bank)return {results:[],recommendations:[],completed:0};
 for(let n=0;n<5;n++){
  const v=read('bss_form3_complete_60_v1_'+n);
  if(!v?.finished||!Array.isArray(v.answers)||v.answers.length!==60)continue;
  const outcome={},start={value:0};
  for(const [key,count] of counts){
   let correct=0;
   for(let i=0;i<count;i++){
    const row=bank[key][n*count+i];
    if(v.answers[start.value+i]===row[2])correct++
   }
   start.value+=count;
   outcome[key]={correct,total:count}
  }
  results.push({id:'practice-'+(n+1),name:'Full Practice '+(n+1),date:v.completedAt||null,outcome})
 }
 for(const [id,source] of [['mock-u1',3],['mock-t1',4]]){
  const v=read('bss_form3_assessment_2026_'+id);
  if(v?.status!=='submitted'||!Array.isArray(v.values)||v.values.length!==60)continue;
  const outcome={};let offset=0;
  for(const [key,count] of counts){
   let correct=0;
   for(let i=0;i<count;i++)if(v.values[offset+i]===bank[key][source*count+i][2])correct++;
   outcome[key]={correct,total:count};offset+=count
  }
  results.push({id,name:id==='mock-u1'?'Untimed Paper 1 Mock':'Timed Paper 1 Mock',date:v.submittedAt||null,outcome})
 }
 // Use all completed paper results; do not infer written skills from unmarked drafts.
 const stats=Object.fromEntries(counts.map(([key])=>[key,{correct:0,total:0,papers:0}]));
 for(const result of results)for(const [key,v] of Object.entries(result.outcome)){
  stats[key].correct+=v.correct;stats[key].total+=v.total;stats[key].papers++
 }
 const recommendations=counts.map(([key])=>{
  const s=stats[key],pct=s.total?Math.round(s.correct*100/s.total):null;
  return {key,title:labels[key],correct:s.correct,total:s.total,papers:s.papers,percent:pct,
   level:pct===null?'not-assessed':pct<70?'priority':pct<85?'developing':'secure'}
 }).sort((a,b)=>{
  if(a.percent===null&&b.percent!==null)return 1;
  if(b.percent===null&&a.percent!==null)return -1;
  return (a.percent??100)-(b.percent??100)
 });
 return {results,recommendations,completed:results.length}
}
function renderLessons(host,recs,openPractice,openWriting){
 host.replaceChildren();
 const catalog=window.BSS_FORM3_LESSONS||[];
 for(const lesson of catalog){
  const rec=recs.find(r=>r.key===lesson.key);
  const card=document.createElement('article');card.className='tile detailed-lesson';card.id='lesson-'+lesson.key;
  const h=document.createElement('h3');h.textContent=lesson.title;card.append(h);
  const stat=document.createElement('p');stat.className='muted small';
  stat.textContent=rec?.percent!==null&&rec?.percent!==undefined?'Your objective score: '+rec.percent+'% ('+rec.correct+'/'+rec.total+')':'No marked score yet. Study before attempting a paper.';
  card.append(stat);
  const objectives=document.createElement('div'),oh=document.createElement('h4');oh.textContent='Learning goals';objectives.append(oh);
  const ul=document.createElement('ul');lesson.objectives.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});objectives.append(ul);card.append(objectives);
  const details=document.createElement('details');details.className='lesson-body';
  details.open=rec?.level==='priority';
  const summary=document.createElement('summary');summary.textContent='Read the complete lesson ('+lesson.sections.length+' steps)';details.append(summary);
  lesson.sections.forEach(([heading,body])=>{const section=document.createElement('section'),sh=document.createElement('h4'),p=document.createElement('p');sh.textContent=heading;p.textContent=body;section.append(sh,p);details.append(section)});
  const worked=document.createElement('div');worked.className='notice';const wh=document.createElement('strong');wh.textContent='Worked example';const wp=document.createElement('p');wp.textContent=lesson.example;worked.append(wh,wp);details.append(worked);
  const practiceTitle=document.createElement('h4');practiceTitle.textContent='Try it yourself';details.append(practiceTitle);
  const ol=document.createElement('ol');lesson.check.forEach(item=>{const li=document.createElement('li');li.textContent=item;ol.append(li)});details.append(ol);
  card.append(details);
  const btn=document.createElement('button');btn.className='primary';btn.textContent=lesson.key==='formal'||lesson.key==='notice'?'Open writing assessments':'Take a full 60-question practice';
  btn.onclick=()=>lesson.key==='formal'||lesson.key==='notice'?openWriting():openPractice();
  card.append(btn);host.append(card)
 }
}
function renderRecommendations(host,recs,onLesson){
 host.replaceChildren();
 const tested=recs.filter(r=>r.percent!==null);
 const title=document.createElement('h3');title.textContent='Your recommended learning pathway';host.append(title);
 if(!tested.length){
  const p=document.createElement('p');p.className='muted';p.textContent='Complete a full 60-question practice or an automatically marked Paper 1 mock first. Your results will then identify the lessons that need attention. You can still study any lesson now.';host.append(p);return;
 }
 const help=document.createElement('p');help.className='muted small';help.textContent='Recommendations use your completed objective answers in this browser. Below 70% = Priority; 70–84% = Developing; 85% or above = Secure. They are guidance, not a diagnosis or official grade.';host.append(help);
 for(const rec of recs){
  const card=document.createElement('div');card.className='tile';card.style.margin='9px 0';
  const row=document.createElement('div');row.className='controls';row.style.justifyContent='space-between';
  const heading=document.createElement('strong');heading.textContent=rec.title+' · '+(rec.percent===null?'Not assessed':rec.percent+'%');
  const status=document.createElement('span');status.className='small muted';status.textContent=rec.level==='priority'?'Priority review':rec.level==='developing'?'Keep practising':rec.level==='secure'?'Strength': 'Awaiting objective results';
  const btn=document.createElement('button');btn.textContent='Study lesson';btn.onclick=()=>onLesson(rec.key);
  row.append(heading,status,btn);card.append(row);host.append(card)
 }
}
window.BSS_FORM3_PATH={report,renderLessons,renderRecommendations};
})();
