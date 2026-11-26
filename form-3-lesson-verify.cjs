// Grade 9 instructional lessons and recommendations validation
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const lessonSource=fs.readFileSync('form-3-detailed-lessons.js','utf8');
const pathSource=fs.readFileSync('form-3-lesson-path.js','utf8');
const html=fs.readFileSync('form-3-english.html','utf8');
new vm.Script(lessonSource);new vm.Script(pathSource);
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(script,'Main ELA script missing');new vm.Script(script);
assert(html.includes('id="lessonRecommendations"'));
assert(html.includes('id="quickRecommendations"'));
assert(html.includes('if(view===\'lessons\')renderLearningPath()'));
assert(html.includes('./form-3-detailed-lessons.js'));
assert(html.includes('./form-3-lesson-path.js'));
assert(html.includes("openSuggestedLesson(requestedLesson)"),'Deep-linked lesson navigation missing');
const practice=fs.readFileSync('form-3-english-practices.html','utf8');
assert(practice.includes('id="recommendedLessons"'),'Practice results recommendation container missing');
assert(practice.includes("'Recommended mini lesson'"),'Results table needs visible mini-lesson column');
assert(practice.includes("link.href='./form-3-english.html?lesson='"),'Results table lesson links missing');
assert(practice.includes("?lesson='"),'Practice results must link to a skill-specific mini lesson');
new vm.Script(practice.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]||'throw Error("Missing practice script")');
const files=['form-3-expanded-a.js','form-3-expanded-b.js','form-3-paper-additions.js'];
const store=new Map();
const ctx={window:{},console,localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v)}};
for(const file of files)vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
vm.runInNewContext(lessonSource,ctx);
vm.runInNewContext(pathSource,ctx);
const catalog=ctx.window.BSS_FORM3_LESSONS;
assert.equal(catalog.length,8);
assert.deepEqual(Array.from(catalog.slice(0,6),l=>l.key),['spelling','vocabulary','grammar','equivalent','mainidea','reading']);
for(const l of catalog){
 assert(l.sections.length>=5,l.key+' lacks lesson stages');
 assert(l.objectives.length>=3,l.key+' lacks learning objectives');
 assert(l.check.length>=3,l.key+' lacks independent practice');
 assert(l.sections.every(x=>x[1].length>80),l.key+' has inadequate explanatory depth');
}
let report=ctx.window.BSS_FORM3_PATH.report();
assert.equal(report.completed,0);
assert(report.recommendations.every(r=>r.percent===null),'Ungraded students must not get invented percentages');
// One fully correct 60-question practice, except all grammar questions wrong.
// Reconstruct the first paper from the same source order.
const sources=[ctx.window.FORM3_EXPANDED_A,ctx.window.FORM3_EXPANDED_B,ctx.window.FORM3_PAPER_ADDITIONS];
const sections=[['spelling',12],['vocabulary',12],['grammar',12],['equivalent',7],['mainidea',7],['reading',10]];
const answers=[];
for(const [key,count] of sections){
 const bank=sources.flatMap(src=>Array.isArray(src[key])?src[key]:[]);
 for(let i=0;i<count;i++)answers.push(key==='grammar'?(bank[i][2]+1)%4:bank[i][2]);
}
assert.equal(answers.length,60);
store.set('bss_form3_complete_60_v1_0',JSON.stringify({finished:true,answers,score:48,completedAt:new Date().toISOString()}));
report=ctx.window.BSS_FORM3_PATH.report();
assert.equal(report.completed,1);
assert.equal(report.recommendations[0].key,'grammar');
assert.equal(report.recommendations[0].percent,0);
assert.equal(report.recommendations[0].level,'priority');
assert(report.recommendations.slice(1).every(x=>x.percent===100),'Other skills should be 100%');
assert.equal(report.recommendations.find(r=>r.key==='reading').total,10);
// Pending Paper 2 must not influence automatically derived recommendations.
store.set('bss_form3_assessment_2026_p2-1',JSON.stringify({status:'submitted',values:Array(11).fill('Some text')}));
assert.equal(ctx.window.BSS_FORM3_PATH.report().completed,1);
console.log('PASS: 8 comprehensive lessons; personal recommendations prioritise low-scoring grammar, respect ungraded writing and support existing 60-item practices');
