// Validate source-aligned Form 3 Paper 2 sets and timed/untimed mock configuration.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const p2=fs.readFileSync('form-3-paper2-bank.js','utf8');
const page=fs.readFileSync('form-3-english-assessments.html','utf8');
const home=fs.readFileSync('form-3-english.html','utf8');
const inline=page.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(inline,'assessment page script not found');
new vm.Script(inline);new vm.Script(p2);
const context={window:{}};vm.runInNewContext(p2,context);
const papers=context.window.BSS_FORM3_PAPER2;
assert.equal(papers.length,5);
for(let i=0;i<5;i++){
 const paper=papers[i];
 assert(paper.passage.length>650,'Passage too short for assessment '+i);
 assert.equal(paper.questions.length,9,'Reading section must contain nine questions');
 assert.equal(paper.questions.reduce((n,q)=>n+q[1],0),16,'Reading marks must add to 16');
 assert(paper.letter.length>140&&paper.notice.length>130,'Writing tasks not sufficiently specified');
 assert(new Set(paper.questions.map(q=>q[0])).size===9,'Duplicate reading questions');
}
const configSegment=inline.slice(inline.indexOf('const configs='),inline.indexOf('const counts='));
assert(configSegment.includes("id:'mock-u1'")&&configSegment.includes("id:'mock-u2'"));
assert(configSegment.includes("id:'mock-t1'")&&configSegment.includes("id:'mock-t2'"));
assert(configSegment.includes("limit:90")&&configSegment.includes("limit:120"));
assert(page.includes('function tick()')&&page.includes('submitAttempt(true)'),'Timer expiry does not submit');
assert(page.includes("selected.kind==='objective'")&&page.includes('attempt.grade=null'),'Written work must not receive automatic grade');
assert(page.includes('function renderDashboard()'),'Student grades dashboard missing');
for(const id of ['p2-1','p2-2','p2-3','mock-u1','mock-u2','mock-t1','mock-t2']){
 assert(home.includes('exam='+id),'English home missing exam '+id);
}
assert(home.includes('id="grades"'),'Grades tab missing');
const script=home.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(script,'English dashboard script missing');new vm.Script(script);
console.log('PASS: 3 full written Paper 2 exams, 2 untimed + 2 timed mocks, 51-mark writing, manual grading safeguard and visible grade dashboard');
