const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('form3-answer-tools.js','utf8');
new vm.Script(source);
class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.style={};this.attributes={};this.listeners={};this.textContent='';this.value='';this.hidden=false;this.files=[];this.width=900;this.height=430;}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(name,handler){this.listeners[name]=handler}
 getBoundingClientRect(){return {left:0,top:0,width:900,height:430}}
 setPointerCapture(){}
 getContext(){return {save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){},fillRect(){},set lineCap(v){},set lineJoin(v){},set lineWidth(v){},set globalCompositeOperation(v){},set strokeStyle(v){},set fillStyle(v){}}}
 toBlob(cb){cb(new Blob(['png-test'],{type:'image/png'}))}
 click(){this.clicked=true}
}
const records=new Map(),exports=[];
const db={
 objectStoreNames:{contains:()=>true},
 transaction(){return {objectStore(){return {
  get(key){const req={};queueMicrotask(()=>{req.result=records.get(key);req.onsuccess?.()});return req},
  put(value,key){const req={};queueMicrotask(()=>{records.set(key,value);req.result=key;req.onsuccess?.()});return req}
 }}}}
};
const context={window:{open(){}},document:{createElement:tag=>new Element(tag)},console,Blob,TextEncoder,Uint8Array,Promise,Set,Math,Date,String,Number,Object,Array,JSON,encodeURIComponent,setTimeout:(f)=>f(),confirm:()=>true,
 indexedDB:{open(){const req={result:db};queueMicrotask(()=>req.onsuccess?.());return req}},
 URL:{createObjectURL(blob){exports.push(blob);return 'blob:local'},revokeObjectURL(){}}
};
vm.runInNewContext(source,context);
const tools=context.window.BSSAnswerTools;
assert.equal(typeof tools.mount,'function');assert.equal(typeof tools.exportBundle,'function');
async function tick(){await new Promise(resolve=>setImmediate(resolve))}
(async()=>{
 const host=new Element('section');
 tools.mount({container:host,namespace:'test-exam',index:0});
 await tick();
 const details=host.children[0];
 assert.equal(details.tagName,'details');
 const canvas=details.children.find(node=>node.tagName==='canvas');
 assert(canvas,'Drawing canvas missing');
 canvas.listeners.pointerdown({preventDefault(){},pointerId:1,clientX:12,clientY:12});
 canvas.listeners.pointermove({clientX:18,clientY:23});
 canvas.listeners.pointerup({});
 await tick();
 assert(await tools.hasContent('test-exam',0),'Saved drawing not found');
 // Add an uploaded image using the actual input-change callback.
 function descendants(node){return [node,...node.children.flatMap(descendants)]}
 const input=descendants(details).find(node=>node.tagName==='input');
 assert(input,'File upload control missing');
 const attachment=new Blob(['test-image-data'],{type:'image/png'});attachment.name='working.png';
 input.files=[attachment];await input.listeners.change();await tick();
 const saved=records.get('test-exam::0');
 assert.equal(saved.files.length,1,'Attachment did not persist');
 await tools.exportBundle({namespace:'test-exam',questions:['Calculate 2 + 2'],answers:['4'],filename:'test-form3'});
 assert(exports.length>=1,'ZIP was not downloaded');
 const zip=await exports.at(-1).arrayBuffer(),bytes=new Uint8Array(zip),asText=Buffer.from(bytes).toString('utf8');
 assert.equal(Buffer.from(bytes.slice(0,4)).toString('hex'),'504b0304','Archive is not a ZIP');
 assert(asText.includes('answers.txt')&&asText.includes('drawing.png')&&asText.includes('working.png'),'Missing written/drawn/uploaded assets in ZIP');
 console.log('PASS: drawing pointer input, IndexedDB save, uploaded image, local media check and ZIP export');
})().catch(err=>{console.error(err);process.exitCode=1});
