// Simulate browser startup for each of five standalone Form 3 Mathematics practices.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('form-3-math-practices.html','utf8');
const bankSource=fs.readFileSync('form-3-maths-bank.js','utf8');
const app=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(app,'Missing practice application');
new vm.Script(bankSource);new vm.Script(app);
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.hidden=false;this.textContent='';this.disabled=false;this.attributes={};this.className=''}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=[...items]}
 setAttribute(name,value){this.attributes[name]=value}
 scrollIntoView(){}
}
for(let n=1;n<=5;n++){
 const nodes=new Map(),storage=new Map();
 const document={
  getElementById(id){if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)},
  createElement(tag){return new Element(tag)}
 };
 const window={BSS_MATH:null,scrollTo(){}};
 const ctx={document,window,location:{search:'?practice='+n,href:''},URLSearchParams,localStorage:{
  getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)},removeItem(k){storage.delete(k)}
 },confirm:()=>true,console,Number,Array,Object,Math,Date,Set,String,JSON,encodeURIComponent};
 vm.runInNewContext(bankSource,ctx);
 vm.runInNewContext(app,ctx);
 assert.equal(document.getElementById('quiz').hidden,false,'Practice '+n+' did not open quiz');
 assert.equal(document.getElementById('selection').hidden,true,'Practice '+n+' remained at selection');
 assert.equal(document.getElementById('counter').textContent,'Question 1 of 60');
 assert(document.getElementById('prompt').textContent.length>20,'Practice '+n+' missing first question');
 const buttons=document.getElementById('options').children;
 assert.equal(buttons.length,4,'Practice '+n+' missing answer options');
 buttons[0].onclick();
 assert.equal(JSON.parse(storage.get('bss_f3_maths_2026_v1_practice-'+n)).answers[0],0);
 document.getElementById('next').onclick();
 assert.equal(document.getElementById('counter').textContent,'Question 2 of 60');
 assert.equal(document.getElementById('options').children.length,4);
 console.log('Practice '+n+' opened first and second questions, displayed four choices and saved an answer');
}
console.log('PASS: All five Form 3 Mathematics practices open question content');
