// Private, device-local challenge history. Never stores room tokens, invite secrets or chat.
(function(){
 'use strict';
 const KEY='gk_completed_matches_v1', MAX=100;
 function profile(){try{const p=JSON.parse(sessionStorage.getItem('bss_form1_student')||'null');return p&&typeof p.name==='string'&&typeof p.room==='string'&&/^\d{4}$/.test(p.code||'')?p:null}catch{return null}}
 function scopedKey(){
  const p=profile();if(!p)return null;
  const input=p.name.trim().toLowerCase()+'|'+p.room.trim().toLowerCase()+'|'+p.code;
  let a=2166136261,b=2246822519;
  for(let i=0;i<input.length;i++){a=Math.imul(a^input.charCodeAt(i),16777619);b=Math.imul(b^input.charCodeAt(i),3266489917)}
  return 'bssform1:'+(a>>>0).toString(36)+'-'+(b>>>0).toString(36)+':'+KEY;
 }
 function all(){const k=scopedKey();if(!k)return [];try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v.filter(isRecord).slice(0,MAX):[]}catch{return []}}
 function isRecord(r){return r&&typeof r.id==='string'&&/^[A-HJ-NP-Z2-9]{8}:[1-9][0-9]*:[12]$/.test(r.id)&&['win','loss','draw'].includes(r.outcome)&&Number.isInteger(r.score)&&r.score>=0&&r.score<=600&&Number.isInteger(r.opponentScore)&&r.opponentScore>=0&&r.opponentScore<=600&&typeof r.at==='string'&&Number.isFinite(Date.parse(r.at))}
 function record(data,session){
  if(!scopedKey()||!data?.bothFinished||!Array.isArray(data.players)||data.players.length!==2||!session||!/^[A-HJ-NP-Z2-9]{8}$/.test(session.code)||![1,2].includes(session.seat))return false;
  const round=Number(data.round);if(!Number.isSafeInteger(round)||round<1)return false;
  const mine=data.players.find(p=>p.seat===session.seat),other=data.players.find(p=>p.seat!==session.seat);
  if(!mine||!other||![mine.score,other.score].every(s=>Number.isInteger(s)&&s>=0&&s<=600)||![mine.answered,other.answered].every(n=>Number.isInteger(n)&&n===60))return false;
  const id=session.code+':'+round+':'+session.seat,entries=all();if(entries.some(x=>x.id===id))return false;
  const next={id,at:new Date().toISOString(),round,score:mine.score,opponentScore:other.score,outcome:mine.score>other.score?'win':mine.score<other.score?'loss':'draw',opponent:typeof other.nickname==='string'?other.nickname.slice(0,24):'Other learner'};
  entries.unshift(next);
  try{localStorage.setItem(scopedKey(),JSON.stringify(entries.slice(0,MAX)));return true}catch{return false}
 }
 function stats(){const records=all();return {records,total:records.length,wins:records.filter(r=>r.outcome==='win').length,losses:records.filter(r=>r.outcome==='loss').length,draws:records.filter(r=>r.outcome==='draw').length,best:records.length?Math.max(...records.map(r=>r.score)):null}}
 function clear(){const k=scopedKey();if(k)localStorage.removeItem(k)}
 window.GKHistory={record,all,stats,clear,hasProfile:()=>!!scopedKey()};
})();