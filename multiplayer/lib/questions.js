import bank from './questions.json' with { type: 'json' };

const saintLucia = Object.keys(bank).filter(name => name.startsWith('Saint Lucian'));
export const validModes = ['all','saintlucia','school','companion'];
export const validTimers = [0,30,60];

export function randomGenerator(seed) {
  let x = (seed >>> 0) || 123456789;
  return () => {
    x += 0x6D2B79F5;
    let t=x;
    t=Math.imul(t^(t>>>15),t|1);
    t ^= t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}
function shuffle(a,rng) {
  const b=[...a];
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];
  }
  return b;
}
export function getQuestions(mode,seed) {
  if(!validModes.includes(mode)||!Number.isInteger(seed)||seed<1||seed>4294967295)throw Error('Invalid challenge');
  const selected=mode==='companion'?['Student Companion']:mode==='saintlucia'?[...saintLucia,'Student Companion']:mode==='school'?Object.keys(bank).filter(x=>!saintLucia.includes(x)):Object.keys(bank);
  const pool=selected.flatMap(cat=>bank[cat].map((q,i)=>({id:cat+'-'+i,category:cat,text:q[0],correct:q[1],others:q.slice(2,5),explanation:q[5],difficulty:q[7]||1})));
  if(pool.length<60)throw Error('Insufficient questions');
  const rng=randomGenerator(seed);
  let unused=shuffle(pool,rng),final=[];
  for(let level=1;level<=3;level++) {
    const preference=unused.filter(q=>level===1?q.difficulty===1:level===2?q.difficulty===2:q.difficulty>=3);
    const chosen=shuffle(preference,rng).slice(0,20);
    if(chosen.length<20) {
      const ids=new Set(chosen.map(q=>q.id));
      chosen.push(...shuffle(unused.filter(q=>!ids.has(q.id)),rng).slice(0,20-chosen.length));
    }
    const ids=new Set(chosen.map(q=>q.id));
    unused=unused.filter(q=>!ids.has(q.id));
    final.push(...shuffle(chosen,rng));
  }
  if(final.length!==60||new Set(final.map(q=>q.id)).size!==60)throw Error('Repeated challenge question');
  return final;
}
export function questionView(question,seed,index) {
  const options=shuffle([question.correct,...question.others],randomGenerator((seed^(index+1)*2654435761)>>>0));
  return {index,number:index+1,level:Math.floor(index/20)+1,category:question.category,prompt:question.text,options};
}
export function scoreAnswer(question,seed,index,choice) {
  const view=questionView(question,seed,index);
  return Number.isInteger(choice)&&choice>=0&&choice<4&&view.options[choice]===question.correct;
}
export function publicResult(row) {
  return {nickname:row.nickname,score:row.score,completed:row.next_index===60};
}
