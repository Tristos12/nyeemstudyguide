/* Standalone Form 3 structured mathematics exam with draft persistence. */
(function(){
'use strict';
const $=id=>document.getElementById(id),papers=window.BSS_MATH_STRUCTURED;
const prefix='bss_f3_maths_2026_v1_structured-';
let number=0,questions=[],record=null;
const saved=n=>{try{return JSON.parse(localStorage.getItem(prefix+n)||'null')}catch{return null}};
const persist=()=>{if(!number||!record)return false;try{localStorage.setItem(prefix+number,JSON.stringify(record));$('saveStatus').textContent='Saved on this browser.';return true}catch{$('saveStatus').textContent='Browser storage unavailable. Copy your answers before leaving.';return false}};
function show(id){for(const name of ['selection','exam','result','error'])$(name).hidden=name!==id;window.scrollTo(0,0)}
function fail(message){$('errorText').textContent=message;show('error')}
function getQuestions(paper){
 if(!paper||!Array.isArray(paper.sectionB)||!Array.isArray(paper.sectionC)||paper.sectionB.length!==6||paper.sectionC.length!==4)throw Error('Structured paper questions are missing.');
 const rows=paper.sectionB.map(q=>({section:'B',...q})).concat(paper.sectionC.map(q=>({section:'C',...q})));
 if(rows.reduce((a,q)=>a+q.marks,0)!==30||rows.some(q=>typeof q.stem!=='string'||!q.stem.trim()))throw Error('Structured paper contains incomplete content.');
 return rows;
}
function open(n){
 if(!Number.isInteger(n)||n<1||n>3){show('selection');return}
 number=n;
 try{questions=getQuestions(papers?.[n-1])}catch(err){fail(err.message);return}
 record=saved(n);
 if(record?.status==='submitted'&&Array.isArray(record.answers)&&record.answers.length===10){result();return}
 if(record?.status!=='draft'||!Array.isArray(record.answers)||record.answers.length!==10){
  record={status:'draft',answers:Array(10).fill(''),position:0,startedAt:new Date().toISOString()};
 }
 record.position=Math.min(9,Math.max(0,Number.isInteger(record.position)?record.position:0));
 persist();render();show('exam');
}
function render(){
 const index=record.position,q=questions[index];
 $('paperTitle').textContent='Structured Paper '+number;
 $('sectionTitle').textContent='Section '+q.section+' · Question '+(index+1)+' of 10';
 $('count').textContent='Question '+(index+1)+'/10 · '+record.answers.filter(x=>typeof x==='string'&&x.trim()).length+' answered';
 $('questionText').textContent=q.stem;$('questionMarks').textContent=q.marks+(q.marks===1?' mark':' marks');
 $('response').value=record.answers[index]||'';
 $('bar').style.width=(100*record.answers.filter(x=>typeof x==='string'&&x.trim()).length/10)+'%';
 $('previous').disabled=index===0;$('next').disabled=index===9;
}
$('response').oninput=()=>{record.answers[record.position]=$('response').value;persist()};
$('previous').onclick=()=>{if(record.position>0){record.position--;persist();render()}};
$('next').onclick=()=>{if(record.position<9){record.position++;persist();render()}};
$('saveExit').onclick=()=>{persist();location.href='./form-3-mathematics.html?tab=structured'};
function submit(){
 const missing=record.answers.filter(x=>!String(x||'').trim()).length;
 if(missing&&!confirm(missing+' written responses are blank. Submit anyway?'))return;
 if(!confirm('Submit Structured Paper '+number+' for teacher marking?'))return;
 record.status='submitted';record.submittedAt=new Date().toISOString();record.grade=null;persist();result()
}
$('submit').onclick=submit;
function result(){
 show('result');$('resultTitle').textContent='Structured Paper '+number+' submitted';
 $('resultDetail').textContent='Responses entered: '+record.answers.filter(x=>String(x||'').trim()).length+' of 10. Download your answers to share with your teacher.';
 $('reviewArea').hidden=true;$('reviewArea').replaceChildren();
}
function review(){
 const host=$('reviewArea');host.replaceChildren();
 questions.forEach((q,i)=>{
  const block=document.createElement('section');block.className='tile';block.style.margin='10px 0';
  const title=document.createElement('h3');title.textContent='Section '+q.section+' · Question '+(i+1)+' ('+q.marks+' marks)';
  const prompt=document.createElement('p');prompt.textContent=q.stem;
  const ans=document.createElement('p');ans.className='response';ans.textContent=record.answers[i]||'[No response]';
  block.append(title,prompt,ans);host.append(block)
 });
 host.hidden=false;host.scrollIntoView({behavior:'smooth'});
}
$('review').onclick=review;
$('download').onclick=()=>{
 const lines=['BABONNEAU SECONDARY SCHOOL','FORM 3 MATHEMATICS','Structured Paper '+number,'Marks available: 30','Written work requires teacher marking',''];
 questions.forEach((q,i)=>{lines.push('Section '+q.section+' · Question '+(i+1)+' ('+q.marks+' marks)',q.stem,'Student response:',record.answers[i]||'[No response]','')});
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='form3-maths-structured-'+number+'-answers.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)
};
$('retry').onclick=()=>{
 if(!confirm('Start a new attempt? Your previous submitted answers will be replaced.'))return;
 try{localStorage.removeItem(prefix+number)}catch{}
 open(number)
};
$('savedList').textContent=[1,2,3].map(n=>{
 const v=saved(n);return 'Paper '+n+': '+(v?.status==='submitted'?'Submitted':v?.status==='draft'?'In progress':'Not started');
}).join(' · ');
try{
 const query=new URLSearchParams(location.search);
 if(query.has('paper'))open(Number(query.get('paper')));else show('selection')
}catch(err){fail(err?.message||'Unknown loading error')}
})();