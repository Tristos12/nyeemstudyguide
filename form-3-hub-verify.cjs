const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('form-3.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert(script,'Form 3 dashboard script missing');
new vm.Script(script[1],{filename:'form-3-inline.js'});
const found=script[1].match(/const subjects=(\[[^\n]+\]);/);
assert(found,'Subject registry missing');
const subjects=JSON.parse(found[1]);
assert.equal(subjects.length,16,'Sixteen subjects should be accessible');
assert.equal(new Set(subjects.map(s=>s.url)).size,16,'Duplicate subject URLs');
const allowed=new Set(['core','languages','business','humanities','technology','creative','wellbeing']);
for(const s of subjects){
 assert(allowed.has(s.group),'Invalid subject group '+s.name);
 for(const key of ['url','primary']){
  const href=s[key].split('?')[0];
  assert(fs.existsSync(href),s.name+' '+key+' link missing: '+href);
 }
}
assert(html.includes('student-success.html?tab=planner'));
assert(html.includes('student-success.html?tab=videos'));
assert(html.includes('student-success.html?tab=flashcards'));
assert(html.includes('id="subjectSearch"')&&html.includes('id="subjectGrid"'));
assert(html.includes('id="continueLink"')&&html.includes('id="progressDetails"'));
assert(!html.includes('NOW AVAILABLE'),'Old notice ribbon still present');
class Element{
 constructor(){this.children=[];this.style={};this.attrs={};this.listeners={};this.dataset={};this.textContent='';this.href='';this.value='';this.className=''}
 replaceChildren(...v){this.children=[...v]}
 append(...v){this.children.push(...v)}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,fn){this.listeners[k]=fn}
}
const ids=new Map(),groupNames=['all',...allowed];
const groups=groupNames.map(group=>{let el=new Element();el.dataset.group=group;return el});
const store=new Map();
const document={
 getElementById(id){if(!ids.has(id))ids.set(id,new Element());return ids.get(id)},
 createElement(){return new Element()},
 querySelectorAll(sel){if(sel==='.filters button')return groups;throw Error('Unexpected selector '+sel)}
};
const window={listeners:{},addEventListener(k,fn){this.listeners[k]=fn}};
const context={document,window,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},console};
vm.runInNewContext(script[1],context);
assert.equal(ids.get('subjectGrid').children.length,16,'Dashboard initially must show 16 cards');
groups.find(x=>x.dataset.group==='business').listeners.click();
assert.equal(ids.get('subjectGrid').children.length,3,'Business category filter must show three subjects');
groups.find(x=>x.dataset.group==='all').listeners.click();
ids.get('subjectSearch').listeners.input({target:{value:'Biology'}});
assert.equal(ids.get('subjectGrid').children.length,1,'Subject search must match Biology');
ids.get('subjectSearch').listeners.input({target:{value:''}});
const before=ids.get('subjectGrid').children[0];
const firstOpen=before.children[2].children[0];
firstOpen.listeners.click();
assert.equal(store.get('bss_f3_hub_last_subject_v1'),'form-3-english.html');
window.listeners.pageshow();
assert(ids.get('continueTitle').textContent.includes('English Language Arts'));
assert.equal(ids.get('completedCount').textContent,'0');
store.set('bss_form3_office_2026_practice-1',JSON.stringify({status:'submitted',grade:42,objectiveTotal:60}));
ids.get('refreshProgress').listeners.click();
assert.equal(ids.get('completedCount').textContent,'1');
assert.equal(ids.get('subjectCount').textContent,'1');
console.log('PASS Form 3 learning hub: 16 valid subject links, search and category filtering, saved continue link, local progress and script syntax.');
