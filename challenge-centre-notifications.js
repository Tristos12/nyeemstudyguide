(function(){
 'use strict';
 if(!window.bssStudent||!window.GKCentre)return;
 const anchor=document.createElement('section');
 anchor.id='challengeNotificationBanner';
 anchor.style.cssText='max-width:1050px;margin:14px auto;padding:15px 18px;border:2px solid #c6a054;border-radius:13px;background:#fff7df;color:#253c52;font:16px/1.5 system-ui,Arial,sans-serif';
 anchor.setAttribute('aria-label','Challenge Centre notifications');
 const link=document.createElement('a');link.href='./challenge-centre.html';
 link.style.cssText='font-weight:800;color:#124c76;font-size:17px;text-decoration:underline';
 link.textContent='🔔 Challenge Centre';
 const status=document.createElement('span');status.style.marginLeft='9px';status.textContent='Check private invitations';
 anchor.append(link,status);
 const main=document.querySelector('main'),header=document.querySelector('header');
 if(main?.parentNode)main.parentNode.insertBefore(anchor,main);
 else if(header?.parentNode)header.parentNode.insertBefore(anchor,header.nextSibling);
 if(!window.GKCentre.get()){status.textContent=' · Set up a private inbox to receive invitations';return}
 async function check(){
  const inbox=window.GKCentre.get();if(!inbox)return;
  try{
   const data=await window.GKCentre.call('/api/inbox?code='+encodeURIComponent(inbox.code),'GET',null,inbox.secret);
   const pending=(data.items||[]).filter(i=>i.status==='pending').length;
   status.textContent=pending?' · '+pending+' NEW CHALLENGE'+(pending===1?'':'S')+' WAITING':' · No new invitations';
   anchor.style.background=pending?'#fff1bf':'#f0f7ff';
   anchor.style.borderColor=pending?'#c58b18':'#b4cce5';
   anchor.setAttribute('aria-label',pending?pending+' private challenge invitations waiting':'Challenge Centre');
  }catch(e){status.textContent=' · Open to check your inbox';}
 }
 check();setInterval(()=>{if(!document.hidden)check()},25000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();