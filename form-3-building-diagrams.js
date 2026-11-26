(function(){'use strict';const ns='http://www.w3.org/2000/svg';
function e(tag,attrs={},label){const item=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>item.setAttribute(k,String(v)));if(label)item.textContent=label;return item}
function draw(kind){
 const s=e('svg',{viewBox:'0 0 720 360',width:'100%',role:'img','aria-label':kind==='tree'?'Schematic tree trunk cross section showing bark, cambium, sapwood, heartwood, pith and annual rings':'Ruler marked in centimetres and millimetres'});s.style.maxWidth='750px';s.style.background='#f7fafc';s.style.border='1px solid #cbd9e6';s.style.borderRadius='10px';
 const add=(tag,attrs={},text)=>s.append(e(tag,attrs,text)),txt=(x,y,v,size=16)=>add('text',{x,y,fill:'#28475f','font-family':'Arial','font-size':size},v);
 if(kind==='tree'){
  const cx=262,cy=180;
  [{r:140,c:'#6c523d'},{r:129,c:'#a47850'},{r:121,c:'#e2bd8e'},{r:88,c:'#c78b58'},{r:55,c:'#af7047'},{r:17,c:'#7b4b31'}].forEach(x=>add('circle',{cx,cy,r:x.r,fill:x.c,stroke:'#5d432d','stroke-width':1.7}));
  [104,72,42].forEach(r=>add('circle',{cx,cy,r,fill:'none',stroke:'#7f4e32','stroke-width':2,'stroke-dasharray':'7 5'}));
  const labels=[['Bark',402,64,353,77],['Cambium',402,103,376,107],['Sapwood',402,143,364,141],['Heartwood',402,186,324,179],['Pith',402,225,270,181],['Growth rings',402,267,333,212]];
  labels.forEach(([t,x,y,lx,ly])=>{add('line',{x1:lx,y1:ly,x2:x-8,y2:y-5,stroke:'#314f6b','stroke-width':2});txt(x,y,t)});
  txt(65,330,'Simplified cross section: features are not drawn to scale',13);
 }else{
  add('rect',{x:45,y:90,width:628,height:150,rx:8,fill:'#f6df9c',stroke:'#866c3f','stroke-width':3});
  for(let i=0;i<=100;i++){const x=55+i*6.08;const h=i%10===0?60:i%5===0?43:23;add('line',{x1:x,y1:96,x2:x,y2:96+h,stroke:'#3d454d','stroke-width':i%10===0?2.5:1});if(i%10===0)txt(x-5,188,String(i/10),15)}
  txt(57,65,'Centimetres (large ticks) and millimetres (small ticks)',18);txt(60,265,'1 cm = 10 mm | show each step when converting a measurement',15);
 }return s
}
window.BSS_BUILD_DIAGRAMS={draw};})();