const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sources=['form-3-maths-bank.js','form-3-maths-lessons.js','form-3-maths-structured.js','form-3-maths-app.js','form-3-mathematics.html','form-3-math-practices.html','form-3.html'];
const text=Object.fromEntries(sources.map(p=>[p,fs.readFileSync(p,'utf8')]));
const context={window:{},console};
for(const p of sources.slice(0,3)){new vm.Script(text[p]);vm.runInNewContext(text[p],context)}
new vm.Script(text['form-3-maths-app.js']);
const bank=context.window.BSS_MATH;
assert.equal(bank.papers.length,5);
assert.equal(bank.sections.length,10);
const unique=new Set();
for(let paper=0;paper<5;paper++){
 const items=bank.papers[paper];
 assert.equal(items.length,60,'Practice '+(paper+1)+' length');
 const counts={};
 items.forEach((q,i)=>{
  counts[q.topic]=(counts[q.topic]||0)+1;
  assert(q.stem&&q.stem.length>25,q.topic+' '+i+' stem too short');
  assert(Array.isArray(q.options)&&q.options.length===4,q.topic+' '+i+' choices missing');
  assert(new Set(q.options).size===4,q.topic+' '+i+' duplicate choices');
  assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=3,q.topic+' '+i+' invalid answer');
  assert(typeof q.explanation==='string'&&q.explanation.length>25,q.topic+' '+i+' missing explanation');
  const id=q.topic+':'+q.stem;
  assert(!unique.has(id),'Exact question repeated across complete practices: '+id);
  unique.add(id);
 });
 for(const topic of bank.sections)assert.equal(counts[topic],6,'Topic '+topic+' count wrong');
 console.log('Paper '+(paper+1)+': 60 distinct 4-option questions (6 per skill)');
}
assert.equal(unique.size,300);
const lesson=context.window.BSS_MATH_LESSONS,structured=context.window.BSS_MATH_STRUCTURED;
assert.equal(lesson.length,10);
for(const l of lesson){assert(l.steps.length>=4&&l.goals.length>=3&&l.example.length>20&&l.check.length>20,'Incomplete lesson '+l.key)}
assert.equal(structured.length,3);
for(const s of structured){
 assert.equal(s.sectionB.reduce((a,b)=>a+b.marks,0),20);
 assert.equal(s.sectionC.reduce((a,b)=>a+b.marks,0),10);
 assert.equal(s.sectionB.length+s.sectionC.length,10);
}
assert(text['form-3-mathematics.html'].includes('form-3-maths-app.js'));
assert(text['form-3.html'].includes('href="./form-3-mathematics.html"'));
for(let i=1;i<=5;i++){
 const url='href="./form-3-math-practices.html?practice='+i+'"';
 assert(text['form-3-mathematics.html'].includes(url),'Missing direct practice link '+i);
}
const standalone=text['form-3-math-practices.html'];
assert(standalone.includes('src="./form-3-maths-bank.js"'),'Standalone practice must load question bank');
assert(standalone.includes("params.get('practice')"),'Standalone practice must accept direct practice URLs');
assert(standalone.includes('id="quiz"')&&standalone.includes('id="results"'),'Standalone question and results screens missing');
const quizScript=standalone.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(quizScript,'Standalone practice script missing');new vm.Script(quizScript);
assert(quizScript.includes('questions.length!==60'),'Standalone question count safety check missing');

const app=text['form-3-maths-app.js'];
assert(app.includes("id:'mock-u1'")&&app.includes("id:'mock-u2'"));
assert(app.includes("id:'mock-t1'")&&app.includes("id:'mock-t2'")&&app.includes('minutes:75'));
assert(app.includes('function skillReport()')&&app.includes('function showResult()')&&app.includes('function openLesson(key)'));
assert(app.includes('if(sec===0)submit(true)'));
assert(app.includes("active.kind==='written'?null:score"),'No automatic marking of written sections');
assert(app.includes('Your Next Step: Recommended Mini Lessons'));
console.log('PASS: 300 unique items, 10 detailed lessons, 3 structured papers, 2 untimed mocks, 2 timed 75-minute mocks and targeted recommendations');
