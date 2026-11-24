// Shared public client helpers for the separate Challenge Centre.
// The private inbox key stays in this browser's learner-specific local storage.
(function(){
 'use strict';
 const base='https://babonneau-form1-multiplayer.vercel.app';
 const key='gk_private_inbox_v1';
 function get(){
  try{const x=JSON.parse(window.bssStorage?.getItem(key)||'null');return x&&/^[A-Z2-9]{10}$/.test(x.code)&&/^[A-Za-z0-9_-]{42,50}$/.test(x.secret)?x:null}
  catch{return null}
 }
 function save(value){if(!window.bssStorage)throw Error('Choose your learner profile first');window.bssStorage.setItem(key,JSON.stringify(value))}
 function clear(){window.bssStorage?.removeItem(key)}
 async function call(path,method='GET',body=null,privateKey=null){
  const headers={Accept:'application/json'};if(body!==null)headers['Content-Type']='application/json';
  if(privateKey)headers.Authorization='Bearer '+privateKey;
  const r=await fetch(base+path,{method,headers,cache:'no-store',body:body===null?undefined:JSON.stringify(body)});
  const d=await r.json().catch(()=>({error:'Unable to read server reply'}));
  if(!r.ok)throw Error(d.error||'Request failed');return d;
 }
 async function send(code,sender,kind,url){
  return call('/api/send-invite','POST',{code,sender,kind,url});
 }
 window.GKCentre={get,save,clear,call,send};
})();
