/* Original schematic visual clues for TCF Section C sewing actions. */
(function(){
'use strict';const ns='http://www.w3.org/2000/svg';
function e(type,attributes={},txt){const n=document.createElementNS(ns,type);Object.entries(attributes).forEach(([a,v])=>n.setAttribute(a,String(v)));if(txt)n.textContent=txt;return n}
function draw(key){
 const s=e('svg',{viewBox:'0 0 420 210',width:'100%',role:'img','aria-label':'Sewing operation diagram for identification'});s.style.maxWidth='480px';s.style.border='1px solid #b6c9d7';s.style.borderRadius='10px';s.style.background='#fcfdff';
 const add=(type,a={})=>s.append(e(type,a)),line=(x1,y1,x2,y2,w=4)=>add('line',{x1,y1,x2,y2,stroke:'#294a65','stroke-width':w,'stroke-linecap':'round'});
 const rect=(x,y,width,height,fill='#e5f1fa',r=7)=>add('rect',{x,y,width,height,rx:r,fill,stroke:'#294a65','stroke-width':3});
 const circle=(cx,cy,r,fill='#fff')=>add('circle',{cx,cy,r,fill,stroke:'#294a65','stroke-width':3});
 if(key==='fabric'){rect(60,35,295,72);rect(75,115,265,45,'#e9ddd0');line(210,24,210,147,5);line(194,101,225,101);line(120,128,175,128);line(245,128,300,128);circle(100,63,17,'#f4c6a1');circle(319,63,17,'#f4c6a1')}
 else if(key==='needle'){line(209,34,209,160,6);circle(209,156,5);add('path',{d:'M125 110 C145 85 185 92 209 156 C233 179 277 166 289 146',fill:'none',stroke:'#b34b68','stroke-width':3});rect(95,160,220,18,'#e9ddd0')}
 else if(key==='oil'){rect(105,82,205,80);rect(136,50,140,32,'#cde4f0');add('path',{d:'M210 28 Q230 56 210 70 Q190 56 210 28',fill:'#deb864',stroke:'#294a65','stroke-width':3});circle(211,123,16,'#fff')}
 else if(key==='bobbin'){rect(100,55,220,108,'#e4e6f1');circle(211,109,55,'#fff');circle(211,109,33,'#e9ddd0');line(211,39,211,75);line(170,109,253,109)}
 else if(key==='wind'){rect(65,122,290,46,'#dee9f5');line(211,122,211,37,7);rect(187,56,48,50,'#fae1bc');for(let i=0;i<5;i++)line(191,62+i*9,231,62+i*9,2);add('path',{d:'M90 72 Q160 30 188 73',stroke:'#b34b68','stroke-width':3,fill:'none'});circle(81,73,21,'#f4e8d7')}
 else if(key==='tension'){circle(211,102,42,'#e0e8f4');circle(211,102,24,'#fff');line(81,42,165,85,3);line(250,116,339,173,3);circle(85,39,8,'#b34b68');circle(341,174,8,'#b34b68');rect(190,26,40,24)}
 return s;
}
window.BSS_TCF_DIAGRAMS={draw};})();