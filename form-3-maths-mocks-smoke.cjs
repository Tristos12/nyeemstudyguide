const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('form-3-math-mocks.html','utf8');
const code=fs.readFileSync('form-3-math-mocks.js','utf8');
new vm.Script(code);
class Element{
 constructor(){this.children=[];this.style={};this.hidden=false;this.textContent='';this.attributes={};this.value='';this.className=''}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this.children=[...x]}
 setAttribute(k,v){this.attributes[k]=v}
 scrollIntoView(){}
}
for(const which of ['u1','u2','t1','t2']){
 const els=new Map(),store=new Map();
 const document={getElementById(id){if(!els.has(id))els.set(id,new Element());return els.get(id)},createElement(){return new Element()},addEventListener(){}};
 const context={window:{scrollTo(){}},document,location:{search:'?mock='+which,href:''},console,URLSearchParams,Date,Number,Array,Math,Object,String,JSON,Set,encodeURIComponent,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},setInterval:()=>1,clearInterval:()=>{},confirm:()=>true};
 for(const f of ['form-3-maths-bank.js','form-3-maths-structured.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),context);
 vm.runInNewContext(code,context);
 assert.equal(els.get('exam').hidden,false,which+' did not open');
 assert.equal(els.get('positionLabel').textContent.startsWith('Question 1 of 30'),true,which+' wrong item count');
 assert.equal(els.get('question').children[2].children.length,4,which+' wrong answer options');
 els.get('question').children[2].children[0].onclick();
 assert.equal(JSON.parse(store.get('bss_f3_maths_2026_v1_mock-'+which)).answers[0],0);
 els.get('next').onclick();
 assert.equal(els.get('positionLabel').textContent.startsWith('Question 2 of 30'),true);
 if(which.startsWith('t'))assert(els.get('timer').textContent.includes('Time remaining'),which+' timer missing');
 console.log(which+' opened 30 questions, four choices, save and navigation'+(which.startsWith('t')?', with timer':''));
}
const home=fs.readFileSync('form-3-mathematics.html','utf8');
for(const id of ['u1','u2','t1','t2'])assert(home.includes('form-3-math-mocks.html?mock='+id),'Missing mock link '+id);
console.log('PASS: all four direct Mathematics mock links and browser startup checks');
