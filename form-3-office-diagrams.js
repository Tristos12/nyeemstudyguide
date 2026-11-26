(function(){'use strict';const ns='http://www.w3.org/2000/svg';
function tag(t,attrs={},value=''){const el=document.createElementNS(ns,t);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(value)el.textContent=value;return el}
function draw(type){const svg=tag('svg',{viewBox:'0 0 760 340',width:'100%',role:'img','aria-label':type==='production'?'Production process diagram with three input boxes, production and two output boxes':'Blank office drawing template showing a door and room boundary'});svg.style.maxWidth='760px';svg.style.border='1px solid #c4d4e1';svg.style.background='#fff';svg.style.borderRadius='9px';const add=(t,a={},v)=>svg.append(tag(t,a,v)),rect=(x,y,w,h)=>add('rect',{x,y,width:w,height:h,rx:9,fill:'#f0f6fc',stroke:'#335a75','stroke-width':2.5}),txt=(x,y,v,size=16)=>add('text',{x,y,fill:'#254962','font-family':'Arial','font-size':size}),line=(x1,y1,x2,y2)=>add('line',{x1,y1,x2,y2,stroke:'#385873','stroke-width':3,'stroke-linecap':'round'});
if(type==='production'){
txt(46,35,'INPUTS',19);txt(314,35,'PROCESS',19);txt(566,35,'OUTPUTS',19);
for(let i=0;i<3;i++)rect(35,62+i*84,195,58);rect(308,139,147,67);for(let i=0;i<2;i++)rect(544,99+i*115,190,61);
line(230,174,308,174);line(455,174,544,174);line(260,93,260,259);line(230,91,260,91);line(230,257,260,257);line(260,174,308,174);line(500,129,500,245);line(500,129,544,129);line(500,245,544,245);
txt(326,177,'Production',15);
txt(39,319,'Fill in Material, Labour, Capital, Goods and Services.',15);
}else{
rect(82,58,592,238);txt(100,48,'Draw an office with TEN recognisable, clearly labelled items.',17);
add('line',{x1:510,y1:296,x2:560,y2:296,stroke:'#fff','stroke-width':8});add('path',{d:'M510 297 Q560 252 560 297',stroke:'#476982','stroke-width':2,fill:'none'});txt(490,321,'Door',13);
}
return svg}window.BSS_OFFICE_DIAGRAMS={draw};})();