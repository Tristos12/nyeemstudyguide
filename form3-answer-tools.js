/* Shared local-only written answer workspace for Form 3 ELA and Mathematics.
 * Saves pen strokes and uploaded files in IndexedDB. Nothing is uploaded.
 * Export ZIP packages include typed answers, PNG drawings and attachments.
 */
(function(){
'use strict';
const DB_NAME='bss-form3-written-media-v1',STORE='responses',MAX_FILE=5*1024*1024,MAX_FILES=3;
let dbPromise;
function db(){
 if(!('indexedDB' in window))return Promise.reject(Error('Browser does not support local file storage'));
 if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,1);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Storage unavailable'));
 });
 return dbPromise
}
async function access(key,update){
 const connection=await db();
 return new Promise((resolve,reject)=>{
  const tx=connection.transaction(STORE,update?'readwrite':'readonly'),store=tx.objectStore(STORE);
  const request=update?store.put(update.value,key):store.get(key);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||Error('Storage error'));
 })
}
const key=(namespace,index)=>namespace+'::'+index;
const get=(namespace,index)=>access(key(namespace,index)).then(v=>v||{strokes:[],files:[]});
const save=(namespace,index,value)=>access(key(namespace,index),{value});
const el=(name,attrs={},text)=>{
 const n=document.createElement(name);
 Object.entries(attrs).forEach(([k,v])=>{if(k==='className')n.className=v;else if(k==='type')n.type=v;else n.setAttribute(k,String(v))});
 if(text!==undefined)n.textContent=text;
 return n
};
function mount({container,namespace,index,readonly=false}){
 const root=el('details',{className:'f3-answer-tools'});
 root.style.cssText='margin:12px 0;padding:12px;border:1px solid #c8dbe8;border-radius:12px;background:#f7fbff';
 const heading=el('summary',{},'Draw or attach a file (optional)');heading.style.cssText='font-weight:700;cursor:pointer;padding:3px 0';root.append(heading);
 const intro=el('p',{},'Type above, draw your working, or attach a photo, PDF or Word document. Media stays on this device until you download and share it.');
 intro.style.fontSize='13px';root.append(intro);
 const toolbar=el('div',{role:'toolbar','aria-label':'Drawing tools'});
 toolbar.style.cssText='display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:9px 0';
 const label=el('label',{},'Pen colour '),color=el('select',{'aria-label':'Pen colour'});
 [['#142a43','Black'],['#174ea6','Blue'],['#c62828','Red'],['#19864a','Green'],['#7b36a0','Purple']].forEach(([value,name])=>{const o=el('option',{value},name);color.append(o)});
 const thickness=el('select',{'aria-label':'Pen thickness'});
 [['2','Thin'],['4','Medium'],['8','Thick'],['14','Extra thick']].forEach(([v,name])=>thickness.append(el('option',{value:v},name)));
 thickness.value='4';label.append(color);
 const pen=el('button',{type:'button'},'Pen'),eraser=el('button',{type:'button'},'Eraser'),undo=el('button',{type:'button'},'Undo'),clear=el('button',{type:'button'},'Clear drawing');
 [pen,eraser,undo,clear].forEach(b=>b.style.cssText='padding:7px 10px;border-radius:7px');
 toolbar.append(label,thickness,pen,eraser,undo,clear);root.append(toolbar);
 const canvas=el('canvas',{'aria-label':'Handwriting and drawing canvas'});
 canvas.width=900;canvas.height=430;canvas.style.cssText='display:block;max-width:100%;width:100%;height:auto;aspect-ratio:900/430;border:1px solid #9ab3c9;border-radius:7px;background:white;touch-action:none;cursor:crosshair';
 root.append(canvas);
 const control=el('div');control.style.cssText='display:flex;flex-wrap:wrap;gap:10px;margin:9px 0;align-items:center';
 const uploadLabel=el('label',{},'Attach answer file (image, PDF or Word): ');
 const upload=el('input',{type:'file',accept:'image/png,image/jpeg,image/webp,application/pdf,.doc,.docx'});
 upload.multiple=true;uploadLabel.append(upload);control.append(uploadLabel);root.append(control);
 const filesList=el('div',{'aria-label':'Attached files'});root.append(filesList);
 const status=el('p',{role:'status'});status.style.fontSize='13px';root.append(status);
 container.append(root);
 let value={strokes:[],files:[]},mode='pen',current=null,active=false,loaded=false;
 const ctx=canvas.getContext('2d');
 const showStatus=s=>{status.textContent=s};
 function strokeDraw(stroke){
  if(!stroke.points.length)return;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=stroke.width;
  ctx.globalCompositeOperation=stroke.mode==='erase'?'destination-out':'source-over';
  ctx.strokeStyle=stroke.color;
  ctx.beginPath();stroke.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  if(stroke.points.length===1){const [x,y]=stroke.points[0];ctx.lineTo(x+.01,y+.01)}
  ctx.stroke();ctx.restore()
 }
 function repaint(){ctx.clearRect(0,0,canvas.width,canvas.height);value.strokes.forEach(strokeDraw)}
 function listFiles(){
  filesList.replaceChildren();
  value.files.forEach((file,i)=>{
   const row=el('div');row.style.cssText='display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:5px 0';
   const name=el('span',{},file.name+' ('+Math.ceil(file.blob.size/1024)+' KB)');
   row.append(name);
   const view=el('button',{type:'button'},'Open');
   view.onclick=()=>{const url=URL.createObjectURL(file.blob);window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000)};
   row.append(view);
   if(!readonly){const remove=el('button',{type:'button'},'Remove');remove.onclick=async()=>{value.files.splice(i,1);await store();listFiles()};row.append(remove)}
   filesList.append(row)
  })
 }
 async function store(){
  try{await save(namespace,index,value);showStatus('Drawing and attachments saved on this device.')}catch(e){showStatus('Could not save media. Try exporting your work or free storage space.')}
 }
 function coordinates(evt){
  const r=canvas.getBoundingClientRect();
  return [(evt.clientX-r.left)*canvas.width/r.width,(evt.clientY-r.top)*canvas.height/r.height]
 }
 canvas.addEventListener('pointerdown',evt=>{
  if(readonly||!loaded)return;
  evt.preventDefault();active=true;canvas.setPointerCapture(evt.pointerId);
  current={mode,color:color.value,width:Number(thickness.value),points:[coordinates(evt)]};value.strokes.push(current);repaint()
 });
 canvas.addEventListener('pointermove',evt=>{if(!active||!current)return;current.points.push(coordinates(evt));repaint()});
 const finish=()=>{if(!active)return;active=false;current=null;store()};
 canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
 function selectMode(next){mode=next;pen.setAttribute('aria-pressed',String(mode==='pen'));eraser.setAttribute('aria-pressed',String(mode==='erase'));canvas.style.cursor=mode==='erase'?'cell':'crosshair'}
 pen.onclick=()=>selectMode('pen');eraser.onclick=()=>selectMode('erase');selectMode('pen');
 undo.onclick=()=>{if(readonly)return;value.strokes.pop();repaint();store()};
 clear.onclick=()=>{if(readonly||!confirm('Clear all drawing strokes for this question?'))return;value.strokes=[];repaint();store()};
 upload.addEventListener('change',async()=>{
  if(readonly)return;
  const allowed=['image/png','image/jpeg','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  for(const file of upload.files){
   const ext=/\.(docx?|pdf|png|jpe?g|webp)$/i.test(file.name);
   if((file.type&&!allowed.includes(file.type))||(!file.type&&!ext)){showStatus('Unsupported file type: '+file.name);continue}
   if(file.size>MAX_FILE){showStatus('Maximum file size is 5 MB: '+file.name);continue}
   if(value.files.length>=MAX_FILES){showStatus('Maximum three files per question.');break}
   value.files.push({name:file.name.replace(/[/\\\x00-\x1f]/g,'_').slice(0,90),blob:file,type:file.type});
  }
  upload.value='';await store();listFiles()
 });
 if(readonly){toolbar.hidden=true;uploadLabel.hidden=true;canvas.style.touchAction='auto'}
 get(namespace,index).then(v=>{
  value={strokes:Array.isArray(v.strokes)?v.strokes:[],files:Array.isArray(v.files)?v.files:[]};
  loaded=true;repaint();listFiles();showStatus(readonly?'Saved drawing and uploads for this response.':'Drawing and uploads are saved locally.')
 }).catch(()=>{loaded=true;showStatus('Drawing and upload storage is not available in this browser.')});
 return {element:root}
}
function crc32(bytes){let crc=-1;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^(crc&1?0xedb88320:0)}return(crc^-1)>>>0}
function u16(v){return [v&255,(v>>>8)&255]}function u32(v){return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]}
async function zip(entries){
 const encoder=new TextEncoder(),chunks=[],central=[];let offset=0;
 for(const entry of entries){
  const filename=encoder.encode(entry.name),data=entry.blob instanceof Blob?new Uint8Array(await entry.blob.arrayBuffer()):encoder.encode(String(entry.text||''));
  const crc=crc32(data),size=data.length;
  const local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(filename.length),...u16(0),...filename]);
  chunks.push(local,data);
  const header=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(filename.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...filename]);
  central.push(header);offset+=local.length+size
 }
 const centralSize=central.reduce((n,a)=>n+a.length,0);
 const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(centralSize),...u32(offset),...u16(0)]);
 return new Blob([...chunks,...central,end],{type:'application/zip'})
}
async function exportBundle({namespace,questions,answers,filename}){
 const entries=[],report=['BABONNEAU SECONDARY SCHOOL','FORM 3 WRITTEN ASSESSMENT','Assessment: '+namespace,'Exported: '+new Date().toISOString(),'','Typed answers, drawings and attachments appear in this archive.','Writing requires teacher assessment.',''];
 for(let i=0;i<questions.length;i++){
  report.push('QUESTION '+(i+1),String(questions[i]),'Typed response:',String(answers[i]||'[No typed response]'),'');
  let media;try{media=await get(namespace,i)}catch{continue}
  if(media.strokes?.length){
   const canvas=document.createElement('canvas');canvas.width=900;canvas.height=430;const ctx=canvas.getContext('2d');
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,900,430);
   // Eraser pixels are rendered against white, then later pen strokes stay visible.
   for(const stroke of media.strokes){if(!stroke.points?.length)continue;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=stroke.width;
    ctx.strokeStyle=stroke.mode==='erase'?'white':stroke.color;ctx.beginPath();
    stroke.points.forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));
    if(stroke.points.length===1){const [x,y]=stroke.points[0];ctx.lineTo(x+.01,y+.01)}ctx.stroke();ctx.restore()}
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(blob)entries.push({name:'question-'+(i+1)+'/drawing.png',blob})
  }
  for(const [index,file] of (media.files||[]).entries())entries.push({name:'question-'+(i+1)+'/attachment-'+(index+1)+'-'+file.name.replace(/[\/\\]/g,'_'),blob:file.blob});
 }
 entries.unshift({name:'answers.txt',text:report.join('\n')});
 const blob=await zip(entries),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=(filename||'form3-written-answers')+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)
}
async function hasContent(namespace,index){try{const v=await get(namespace,index);return !!(v.strokes?.length||v.files?.length)}catch{return false}}
async function clearNamespace(namespace,count){
 const connection=await db();
 for(let index=0;index<count;index++){
  await new Promise((resolve,reject)=>{
   const tx=connection.transaction(STORE,'readwrite'),request=tx.objectStore(STORE).delete(key(namespace,index));
   request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error||Error('Unable to clear old answer media'))
  })
 }
 return true
}
window.BSSAnswerTools={mount,exportBundle,hasContent,clearNamespace};
})();