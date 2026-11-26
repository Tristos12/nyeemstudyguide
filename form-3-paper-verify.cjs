// Verify five complete 60-question Form 3 ELA papers without repetition.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const paths=['form-3-expanded-a.js','form-3-expanded-b.js','form-3-paper-additions.js'];
const html=fs.readFileSync('form-3-english-practices.html','utf8');
const main=fs.readFileSync('form-3-english.html','utf8');
const inline=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(inline,'Missing exam script');new vm.Script(inline);
const cx={window:{},console};
for(const path of paths){
 const js=fs.readFileSync(path,'utf8');new vm.Script(js);vm.runInNewContext(js,cx);
 assert(html.includes('<script src="./'+path+'"></script>'),path+' missing script tag')
}
const from=inline.indexOf('const names='),to=inline.indexOf("const prefix='");
assert(from>=0&&to>from,'Unable to locate exam construction code');
const construction=inline.slice(from,to)+'globalThis.build=paperItems;globalThis.banks=bank;';
vm.runInNewContext(construction,cx);
const distribution={spelling:12,vocabulary:12,grammar:12,equivalent:7,mainidea:7,reading:10};
const all=new Set;
for(let n=0;n<5;n++){
 const paper=cx.build(n);
 assert.equal(paper.length,60,'Practice '+(n+1)+' must have 60 items');
 const counts={};
 for(const item of paper){
  counts[item.skill]=(counts[item.skill]||0)+1;
  const ref=item.skill+':'+item.index;
  assert(!all.has(ref),'Repeated item across practices: '+ref);
  all.add(ref);
  const q=item.q;
  assert(Array.isArray(q[1])&&q[1].length===4&&new Set(q[1]).size===4,'Invalid options '+ref);
  assert(Number.isInteger(q[2])&&q[2]>=0&&q[2]<4,'Invalid answer key '+ref);
  assert(typeof q[3]==='string'&&q[3].length>10,'Explanation missing '+ref);
  if(item.skill==='reading')assert(typeof q[4]==='string'&&q[4].length>200,'Missing reading passage '+ref);
 }
 assert.deepEqual(JSON.parse(JSON.stringify(counts)),distribution,'Incorrect category distribution');
 console.log('Practice '+(n+1)+': 60 unique items, correct distribution, passages present');
}
assert.equal(all.size,300,'Expected 300 distinct item identifiers');
for(let n=1;n<=5;n++)assert(main.includes('form-3-english-practices.html?practice='+n),'Home page missing Practice '+n);
assert(html.includes("function submit()")&&html.includes("function renderResults(score)"),'Delayed scoring missing');
assert(html.includes("localStorage.setItem")||html.includes("localStorage.setItem(prefix+n"),'Saved progress missing');
console.log('PASS: Five complete 60-question practices, 300 nonrepeating items');
