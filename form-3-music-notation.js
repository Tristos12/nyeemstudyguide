/* Accessible original SVG notation diagrams for Form 3 Music Theory. */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const pitchOrder=['A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
function element(tag,attributes={},text){
 const node=document.createElementNS(NS,tag);
 for(const [name,value] of Object.entries(attributes))node.setAttribute(name,String(value));
 if(text!==undefined)node.textContent=String(text);
 return node
}
function line(svg,x1,y1,x2,y2,width=1){svg.append(element('line',{x1,y1,x2,y2,stroke:'#1b344c','stroke-width':width}))}
function label(svg,txt,x,y,size=15){svg.append(element('text',{x,y,fill:'#1b344c','font-family':'Arial,sans-serif','font-size':size},txt))}
function staff(svg,left,right,bottom,unit){
 for(let i=0;i<5;i++)line(svg,left,bottom-i*2*unit,right,bottom-i*2*unit,1.35)
}
function note(svg,pitch,x,bottom,unit,beats=1){
 const idx=pitchOrder.indexOf(pitch);if(idx<0)return;
 const y=bottom-(idx-4)*unit;
 for(const target of [14,16])if(idx>=target)line(svg,x-14,bottom-(target-4)*unit,x+14,bottom-(target-4)*unit,1.5);
 for(const target of [2,0])if(idx<=target)line(svg,x-14,bottom-(target-4)*unit,x+14,bottom-(target-4)*unit,1.5);
 const filled=beats<=1;
 const ellipse=element('ellipse',{cx:x,cy:y,rx:9,ry:6.1,transform:'rotate(-20 '+x+' '+y+')',fill:filled?'#1c344d':'#ffffff',stroke:'#1c344d','stroke-width':1.8});
 svg.append(ellipse);
 if(beats<4){const above=idx<=10;line(svg,x+8,above?y:y-31,x+8,above?y-33:y,1.6)}
 if(beats===.5){const p='M '+(x+8)+' '+(y-32)+' C '+(x+27)+' '+(y-27)+','+(x+20)+' '+(y-8)+','+(x+12)+' '+(y-3);svg.append(element('path',{d:p,stroke:'#1c344d','stroke-width':2,fill:'none'}))}
 if(beats===.25){for(const delta of [0,10]){const p='M '+(x+8)+' '+(y-32+delta)+' C '+(x+27)+' '+(y-27+delta)+','+(x+20)+' '+(y-8+delta)+','+(x+12)+' '+(y-3+delta);svg.append(element('path',{d:p,stroke:'#1c344d','stroke-width':1.8,fill:'none'}))}}
}
function rest(svg,value,x,y){
 const beat={whole:4,half:2,quarter:1,eighth:.5,sixteenth:.25}[value]||1;
 if(beat>=2){
  line(svg,x-10,y,x+11,y,3);
  svg.append(element('rect',{x:x-8,y:beat===4?y:y-9,width:17,height:8,fill:'#1c344d'}))
 }else if(beat===1){
  svg.append(element('path',{d:'M '+(x-2)+' '+(y-18)+' l 7 9 -5 7 6 7 -8 9 3 5',stroke:'#1c344d','stroke-width':3.2,fill:'none','stroke-linecap':'round'}))
 }else{
  line(svg,x+3,y-17,x-4,y+18,2.5);
  const count=beat===.5?1:2;
  for(let j=0;j<count;j++)svg.append(element('circle',{cx:x+7,cy:y-12+j*10,r:4.6,fill:'#1c344d'}))
 }
}
function create(viewBox,aria){
 const svg=element('svg',{xmlns:NS,viewBox,width:'100%','aria-label':aria,role:'img',preserveAspectRatio:'xMidYMid meet'});
 svg.style.maxWidth='760px';svg.style.height='auto';svg.style.display='block';svg.style.background='#fff';svg.style.border='1px solid #d1dfe8';svg.style.borderRadius='8px';
 return svg
}
function draw(spec){
 if(!spec)return null;
 if(spec.type==='signature'){
  const svg=create('0 0 420 160','Treble clef staff with time signature '+spec.top+' over '+spec.bottom);
  staff(svg,38,375,116,5.5);label(svg,'𝄞',40,124,62);
  label(svg,spec.top,105,79,31);label(svg,spec.bottom,105,112,31);
  return svg
 }
 if(spec.type==='staff'){
  const svg=create('0 0 420 170','Treble staff with one note. Identify its letter name.');
  staff(svg,37,378,111,5.5);label(svg,'𝄞',43,121,66);
  note(svg,spec.pitch,224,111,5.5,4);
  return svg
 }
 if(spec.type==='note'||spec.type==='rest'){
  const svg=create('0 0 420 168',spec.type==='note'?'Music note symbol':'Music rest symbol');
  staff(svg,37,379,114,5.5);label(svg,'𝄞',43,122,64);
  if(spec.type==='note'){
   const val={whole:4,half:2,quarter:1,eighth:.5,sixteenth:.25}[spec.value]||1;
   note(svg,'B4',213,114,5.5,val)
  }else rest(svg,spec.value.replace(' rest',''),213,91);
  return svg
 }
 if(spec.type==='excerpt'){
  const melody=window.BSS_MUSIC?.melody(spec.version)||[];
  const svg=create('0 0 860 185','Four-bar music notation in treble clef with time signature and a quarter rest');
  staff(svg,25,834,133,6);label(svg,'𝄞',29,142,69);label(svg,'4',82,94,28);label(svg,'4',82,128,28);
  const starts=[125,310,495,680],width=150;
  melody.forEach((measure,i)=>{
   label(svg,'Bar '+(i+1),starts[i]+15,27,12);
   measure.forEach((item,k)=>{
    const x=starts[i]+22+k*(width/(Math.max(1,measure.length)));
    if(item.note)note(svg,item.note,x,133,6,item.beats);
    else rest(svg,item.rest,x,105);
   });
   line(svg,starts[i]+width,85,starts[i]+width,133,1.5)
  });
  return svg
 }
 return null
}
window.BSS_MUSIC_NOTATION={draw};
})();