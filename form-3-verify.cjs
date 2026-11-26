// Form 3 question-bank verification: run with node form-3-verify.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const a=fs.readFileSync('form-3-expanded-a.js','utf8');
const b=fs.readFileSync('form-3-expanded-b.js','utf8');
const html=fs.readFileSync('form-3-english.html','utf8');
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(script,'Missing Form 3 main script');
new vm.Script(a);new vm.Script(b);new vm.Script(script);
assert(html.includes('<script src="./form-3-expanded-a.js"></script>'));
assert(html.includes('<script src="./form-3-expanded-b.js"></script>'));
const context={window:{},console};
vm.runInNewContext(a,context);vm.runInNewContext(b,context);
const start=script.indexOf('const questions='),stop=script.indexOf('const skillNames=');
assert(start>=0&&stop>start,'Cannot locate question bank');
const extract=script.slice(start,stop)+
 'globalThis.examBank=questions;'+
 'globalThis.getPracticeIds=(key,num)=>{'+
 'const total=questions[key].length;'+
 'const steps=[7,11,13,17,19,23,29,31,37,41,43,47,53];'+
 'const gcd=(a,b)=>b?gcd(b,a%b):a;'+
 'const stride=steps.find(s=>gcd(s,total)===1)||1;'+
 'const start=(num*13+num*num*7)%total;'+
 'return Array.from({length:50},(_,i)=>(start+i*stride)%total);};';
vm.runInNewContext(extract,context);
const bank=context.examBank;
const names=['spelling','vocabulary','grammar','equivalent','mainidea','reading'];
let total=0;
for(const key of names){
 const items=bank[key];
 assert(Array.isArray(items)&&items.length>=50,key+': must contain 50+ items');
 items.forEach((q,i)=>{
  assert(Array.isArray(q)&&typeof q[0]==='string'&&q[0].length>25,key+' '+i+': invalid stem');
  assert(Array.isArray(q[1])&&q[1].length===4,key+' '+i+': require four options');
  assert(new Set(q[1]).size===4,key+' '+i+': duplicate options');
  assert(Number.isInteger(q[2])&&q[2]>=0&&q[2]<4,key+' '+i+': key must be 0-3');
  assert(typeof q[3]==='string'&&q[3].length>15,key+' '+i+': explanation missing');
 });
 for(let n=0;n<5;n++){
  const ids=context.getPracticeIds(key,n);
  assert.equal(ids.length,50);
  assert.equal(new Set(ids).size,50,key+': practice '+(n+1)+' repeats a question');
  assert(ids.every(i=>i>=0&&i<items.length),key+': practice '+(n+1)+' out of range');
 }
 total+=items.length;
 console.log(key+': '+items.length+' bank questions; five 50-question practices checked');
}
assert(html.includes('function finishSection()'),'End-of-section review missing');
assert(!html.includes("f.textContent=(ok?'Correct."),'Immediate feedback incorrectly enabled');
console.log('PASS: '+total+' bank questions support 30 full 50-item practices');
