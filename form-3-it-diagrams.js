(function(){'use strict';const ns='http://www.w3.org/2000/svg';
function elem(tag,a={},value){const x=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>x.setAttribute(k,String(v)));if(value)x.textContent=value;return x}
function draw(type,question={}){
 const svg=elem('svg',{viewBox:'0 0 720 375',width:'100%',role:'img','aria-label':type==='workspace'?'Schematic Scratch interface with labelled regions':type==='coordinates'?'Scratch x and y coordinate grid':'Scratch blocks arranged in a programming sequence'});
 svg.style.maxWidth='750px';svg.style.background='#fff';svg.style.border='1px solid #d0dbe8';svg.style.borderRadius='10px';
 const add=(tag,a={},txt)=>svg.append(elem(tag,a,txt));
 const rect=(x,y,w,h,color='#e6effb')=>add('rect',{x,y,width:w,height:h,rx:9,fill:color,stroke:'#3a577d','stroke-width':2});
 const label=(x,y,t,size=16)=>add('text',{x,y,'font-size':size,fill:'#193a60','font-family':'Arial'},t);
 const line=(x1,y1,x2,y2)=>add('line',{x1,y1,x2,y2,stroke:'#4c6077','stroke-width':2});
 if(type==='workspace'){
  rect(22,27,672,313,'#f5f8ff');rect(39,74,170,238,'#dbe7ff');rect(227,74,255,238,'#edf4fa');rect(498,74,179,165,'#e3f6e8');rect(498,251,179,61,'#f4e8fb');
  label(48,57,'Blocks Palette',15);label(248,57,'Code Area',15);label(517,57,'Stage',15);
  const names=['Motion','Looks','Events','Control'];names.forEach((n,i)=>{const c=['#6aa9ee','#a782dc','#e5bf52','#ebb268'][i];rect(50,91+i*48,144,35,c);label(59,114+i*48,n,14)});
  rect(252,117,199,42,'#f2cd5c');label(263,142,'when flag clicked',14);
  rect(252,161,199,42,'#6ba8e9');label(270,186,'move 10 steps',14);
  label(527,165,'Sprite',17);label(510,288,'Sprite List',15);
 }else if(type==='coordinates'){
  rect(42,27,640,315,'#f7fbff');
  const cx=362,cy=186;for(let x=-240;x<=240;x+=60){line(cx+x*1.15,44,cx+x*1.15,328)}for(let y=-180;y<=180;y+=60){line(75,cy-y*.76,649,cy-y*.76)}
  add('line',{x1:75,y1:cy,x2:649,y2:cy,stroke:'#1b4c88','stroke-width':3});add('line',{x1:cx,y1:42,x2:cx,y2:329,stroke:'#1b4c88','stroke-width':3});
  label(653,cy-8,'+x',15);label(cx+7,40,'+y',15);label(84,cy-8,'-x',15);label(cx+8,330,'-y',15);label(cx+8,cy+20,'0,0',14);
  const x=Number(question.x??120),y=Number(question.y??-80);const px=cx+x*1.15,py=cy-y*.76;
  add('circle',{cx:px,cy:py,r:9,fill:'#ec713d',stroke:'#8b3c23','stroke-width':2});label(Math.min(px+11,605),py-12,'('+x+','+y+')',15)
 }else{
  rect(55,22,605,330,'#f7fbff');const rows=[['when green flag clicked','#f4ce55'],['go to x: 0 y: 0','#71afea'],['say Welcome for 2 seconds','#ab84df'],['move 10 steps','#71afea']];
  rows.forEach(([t,c],i)=>{rect(127,49+i*73,463,58,c);label(150,85+i*73,t,20)});
  label(68,29,'Arrange these four Scratch blocks in the correct order',14);
 }
 return svg
}
window.BSS_IT_DIAGRAMS={draw};})();