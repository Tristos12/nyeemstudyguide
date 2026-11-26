/* Original Form 3 Mathematics revision bank. Five distinct 60-item papers. */
(function(){
'use strict';
const topicNames={fractions:'Fractions and Mixed Numbers',operations:'Fraction Operations',decimals:'Decimals and Rounding',significant:'Significant Figures',standard:'Standard Form',consumer:'Consumer Arithmetic',data:'Pictograms and Data',patterns:'Sequences and Patterns',computation:'Computation and Estimation',proportion:'Ratio and Proportion'};
const sections=Object.keys(topicNames),gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const reduced=(a,b)=>{const g=gcd(a,b);return (a/g)+'/'+(b/g)};
const money=n=>'$'+n.toFixed(2);
function make(topic,stem,correct,nearA,nearB,out,explanation,n){
 const choices=[String(correct),String(nearA),String(nearB),String(out)];
 if(new Set(choices).size!==4)throw Error('Duplicate options '+topic+':'+n+' '+JSON.stringify(choices));
 const shift=(n*3+sections.indexOf(topic))%4;
 const options=choices.slice(shift).concat(choices.slice(0,shift));
 return {topic,stem,options,answer:options.indexOf(choices[0]),explanation}
}
function item(topic,n){
 const k=n+1;
 if(topic==='fractions'){
  const whole=2+(n%8),den=3+(n*3%9),num=1+(n*5%(den-1)),top=whole*den+num;
  return make(topic,'Convert '+whole+' '+num+'/'+den+' to an improper fraction.',top+'/'+den,(whole*den-num)+'/'+den,(top+den)+'/'+den,num+'/'+whole,
   'Multiply the whole number by the denominator and add the numerator: '+whole+' × '+den+' + '+num+' = '+top+'.',n);
 }
 if(topic==='operations'){
  const a=1+n%4,b=3+n%5,c=1+(n*2%4),d=5+n%6,op=n%3;
  const top=op===0?a*d+c*b:op===1?a*c:a*d-c*b,bot=b*d,symbol=['+','×','−'][op];
  const answer=reduced(top,bot),wrong1=reduced(a+c,b+d),wrong2=reduced(Math.abs(top)+1,bot),wrong3=String(a+b+c+d);
  const distractors=[wrong1,wrong2,wrong3];
  for(let i=0;i<3;i++){let x=1;while([answer].concat(distractors.slice(0,i)).includes(distractors[i]))distractors[i]=reduced(Math.abs(top)+3+i+x++,bot+2+i)}
  return make(topic,'Calculate '+a+'/'+b+' '+symbol+' '+c+'/'+d+'. Give the simplest fraction.',answer,distractors[0],distractors[1],distractors[2],
   'Use '+(op===1?'numerator × numerator and denominator × denominator':'a common denominator')+'. The exact fraction is '+top+'/'+bot+', which simplifies to '+answer+'.',n)
 }
 if(topic==='decimals'){
  const whole=2+n%17,decimals=(n*31+146)%10000,precision=n%2?2:3,scaled=whole*10000+decimals,factor=10**(4-precision);
  const rounded=Math.floor((scaled+factor/2)/factor),truncated=Math.floor(scaled/factor),fmt=v=>(v/10**precision).toFixed(precision);
  const answer=fmt(rounded),nearA=fmt(truncated===rounded?rounded-1:truncated),nearB=fmt(rounded+1);
  return make(topic,'Round '+(scaled/10000).toFixed(4)+' to '+precision+' decimal places.',answer,nearA,nearB,fmt(rounded+30),
   'Inspect the first removed digit and round the last kept digit if necessary. Answer: '+answer+'.',n)
 }
 if(topic==='significant'){
  const a=2+n%7,b=1+(n*3%8),c=2+(n*5%7),d=(n*7+3)%10;
  const x=a*1000+b*100+c*10+d,answer=Math.round(x/10)*10,nearA=Math.floor(x/10)*10,nearB=answer+10;
  return make(topic,'Write '+x.toLocaleString('en-US')+' correct to 3 significant figures.',answer,nearA===answer?answer-10:nearA,nearB,(x/1000).toFixed(2),
   'Keep the first three significant digits, inspect the fourth digit and round to '+answer+'.',n)
 }
 if(topic==='standard'){
  const mant=(12+n*7%78)/10,exponent=2+n%5,coeff=mant.toFixed(1),value=Math.round(mant*10**exponent);
  if(n%2===0)return make(topic,'Write '+coeff+' × 10^'+exponent+' as an ordinary number.',value,Math.round(mant*10**(exponent-1)),Math.round(mant*10**(exponent+1)),mant,
    'Move the decimal point '+exponent+' places right: '+value+'.',n);
  return make(topic,'Express '+value.toLocaleString('en-US')+' in scientific notation.',coeff+' × 10^'+exponent,coeff+' × 10^'+(exponent-1),coeff+' × 10^'+(exponent+1),value+' × 10^0',
    'Standard form uses a coefficient from 1 up to but not including 10: '+coeff+' × 10^'+exponent+'.',n)
 }
 if(topic==='consumer'){
  const price=120+20*(n%25),pct=10+5*(n%7),change=price*pct/100,kind=n%3,answer=kind===0?change:kind===1?price-change:price+change;
  const stem=kind===0?'A product marked '+money(price)+' has a '+pct+'% discount. Calculate the discount.':
   kind===1?'A product marked '+money(price)+' has a '+pct+'% discount. Find its selling price.':
   'An item costs '+money(price)+' before '+pct+'% VAT. Find the final price including VAT.';
  const options=[money(change),money(price),money(price-change),money(price+change),money(answer+price/10)];
  const near=options.filter(v=>v!==money(answer)).slice(0,3);
  if(new Set([money(answer)].concat(near)).size!==4)throw Error('Financial distractors collision');
  return make(topic,stem,money(answer),near[0],near[1],near[2],
   pct+'% of '+money(price)+' = '+money(change)+'. '+(kind===0?'This is the discount.':kind===1?'Subtract the discount.':'Add VAT.'),n)
 }
 if(topic==='data'){
  const unit=4+n%3,A=2+n%5,B=3+(n*2%5),half=n%2===0,goalsA=A*unit,goalsB=B*unit+(half?unit/2:0);
  const label='A pictogram uses one whole symbol for '+unit+' goals. Alana has '+A+' symbols; Ben has '+B+' symbols'+(half?' and a half-symbol':'')+'. ';
  const answer=n%3===0?goalsB:n%3===1?goalsA+goalsB:goalsA;
  const stem=label+(n%3===0?'How many goals did Ben score?':n%3===1?'How many goals did they score altogether?':'How many goals did Alana score?');
  return make(topic,stem,answer,answer+unit,answer-unit,answer+7*unit,
   'Multiply whole symbols by '+unit+'; a half-symbol counts for '+unit/2+' goals. The requested value is '+answer+'.',n)
 }
 if(topic==='patterns'){
  const step=3+n%7,first=2+n%7,term=4+n%11,answer=first+(term-1)*step;
  const stem=n%2===0?'Figure 1 uses '+first+' matchsticks; each new figure requires '+step+' additional sticks. How many are needed for Figure '+term+'?':
   'The number pattern starts '+first+', '+(first+step)+', '+(first+2*step)+', ... . Find term '+term+'.';
  return make(topic,stem,answer,first+term*step,term*step,answer+100,
   'Use first term + (term − 1) × common difference: '+first+' + '+(term-1)+' × '+step+' = '+answer+'.',n)
 }
 if(topic==='computation'){
  const a=12+n%29,b=3+n*7%13,c=2+n%8,answer=a+b*c;
  return make(topic,'Evaluate '+a+' + '+b+' × '+c+' using the order of operations.',answer,(a+b)*c,a+b+c,answer+100,
   'Multiplication comes first: '+b+' × '+c+' = '+b*c+', then add '+a+' to obtain '+answer+'.',n)
 }
 if(topic==='proportion'){
  const quantity=8+n%15,rate=3+n%8,cost=quantity*rate,target=quantity+2+n%5,answer=rate*target;
  return make(topic,'A packet of '+quantity+' identical notebooks costs $'+cost+'. At the same rate, how much do '+target+' notebooks cost?',money(answer),money(cost),money(answer+rate),money(answer+100),
   'Unit price = $'+cost+' ÷ '+quantity+' = $'+rate+'. Multiply by '+target+' to obtain '+money(answer)+'.',n)
 }
 throw Error('Unknown topic: '+topic)
}
const papers=[];
for(let p=0;p<5;p++){
 const paper=[];
 for(const topic of sections)for(let n=0;n<6;n++)paper.push(item(topic,p*6+n));
 papers.push(paper)
}
window.BSS_MATH={topicNames,sections,papers,item};
})();