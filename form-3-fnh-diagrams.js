(function(){'use strict';const NS='http://www.w3.org/2000/svg';
function el(tag,a={},txt){const node=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>node.setAttribute(k,String(v)));if(txt)node.textContent=txt;return node}
function draw(type){
 const svg=el('svg',{xmlns:NS,viewBox:type==='pressure'?'0 0 600 350':'0 0 840 260',width:'100%',role:'img','aria-label':type==='pressure'?'Schematic pressure cooker parts for labelling':'Three illustrated cake faults: sunken centre, peaked burnt top, fruit at base'});
 svg.style.maxWidth='860px';svg.style.background='#fff';svg.style.border='1px solid #d0dce7';svg.style.borderRadius='10px';
 const add=(t,a={},s)=>svg.append(el(t,a,s)),line=(x1,y1,x2,y2)=>add('line',{x1,y1,x2,y2,stroke:'#345568','stroke-width':4,'stroke-linecap':'round'});
 if(type==='pressure'){
  add('path',{d:'M135 127 L465 127 L444 284 Q300 328 156 284 Z',fill:'#c5dae5',stroke:'#345568','stroke-width':5});
  add('rect',{x:105,y:105,width:390,height:31,rx:12,fill:'#e5edf2',stroke:'#345568','stroke-width':5});
  add('rect',{x:245,y:72,width:110,height:36,rx:10,fill:'#bad4e2',stroke:'#345568','stroke-width':4});
  add('rect',{x:284,y:37,width:27,height:41,rx:7,fill:'#dba877',stroke:'#345568','stroke-width':4});
  add('rect',{x:50,y:160,width:90,height:31,rx:12,fill:'#e5edf2',stroke:'#345568','stroke-width':5});
  add('rect',{x:459,y:160,width:90,height:31,rx:12,fill:'#e5edf2',stroke:'#345568','stroke-width':5});
  add('path',{d:'M170 140 Q300 154 430 140',fill:'none',stroke:'#bc7e4c','stroke-width':5});
  line(311,37,370,15);add('text',{x:375,y:23,'font-size':17,fill:'#345568'},'A');
  line(355,90,413,54);add('text',{x:420,y:58,'font-size':17,fill:'#345568'},'B');
  line(455,129,528,94);add('text',{x:535,y:100,'font-size':17,fill:'#345568'},'C');
  line(494,175,561,221);add('text',{x:567,y:227,'font-size':17,fill:'#345568'},'D');
  line(150,238,75,264);add('text',{x:45,y:273,'font-size':17,fill:'#345568'},'E');
  add('text',{x:300,y:338,'text-anchor':'middle','font-size':14,fill:'#345568'},'Schematic: identify five pressure-cooker parts');
 }else{
  for(let i=0;i<3;i++){
   const x=16+i*278;add('rect',{x,y:16,width:266,height:220,rx:12,fill:'#f7fafc',stroke:'#c8d7e0','stroke-width':2});
   const d=i===0?'M'+(x+37)+' 112 Q'+(x+58)+' 84 '+(x+94)+' 106 Q'+(x+128)+' 140 '+(x+165)+' 106 Q'+(x+205)+' 84 '+(x+229)+' 112 L'+(x+216)+' 196 L'+(x+49)+' 196 Z':
            i===1?'M'+(x+36)+' 126 Q'+(x+86)+' 105 '+(x+132)+' 62 Q'+(x+182)+' 105 '+(x+231)+' 126 L'+(x+217)+' 196 L'+(x+50)+' 196 Z':
            'M'+(x+35)+' 112 Q'+(x+130)+' 92 '+(x+230)+' 112 L'+(x+216)+' 196 L'+(x+49)+' 196 Z';
   add('path',{d,fill:i===1?'#b6815c':'#e0b98f',stroke:'#745943','stroke-width':4});
   if(i===2)for(let k=0;k<6;k++)add('ellipse',{cx:x+77+k*25,cy:181,rx:8,ry:5,fill:'#8c4c4b'});
   add('text',{x:x+133,y:42,'text-anchor':'middle','font-size':14,fill:'#345568'},['Sunken centre','Burnt, peaked top','Fruit at bottom'][i]);
  }
 }return svg;
}
window.BSS_FNH_DIAGRAMS={draw};})();