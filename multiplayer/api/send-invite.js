import {db,prep,fail,body,digest,nickname} from '../lib/server.js';
const validCode=c=>typeof c==='string'&&/^[A-Z2-9]{10}$/.test(c);
function safeUrl(value,kind){
 if(typeof value!=='string'||value.length>800)return null;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.host!=='tristos12.github.io'||url.username||url.password)return null;
  if(kind==='live'){
   if(url.pathname!=='/nyeemstudyguide/multiplayer/room.html'||[...url.searchParams.keys()].some(k=>k!=='gameVersion'))return null;
   const hash=new URLSearchParams(url.hash.slice(1));
   if(!/^[A-HJ-NP-Z2-9]{8}$/.test(hash.get('room')||'')||!/^[A-Za-z0-9_-]{42,50}$/.test(hash.get('invite')||''))return null;
   return 'https://tristos12.github.io/nyeemstudyguide/multiplayer/room.html#room='+encodeURIComponent(hash.get('room'))+'&invite='+encodeURIComponent(hash.get('invite'));
  }
  if(kind==='shared'){
   if(url.pathname!=='/nyeemstudyguide/general-knowledge.html'||url.hash)return null;
   const val=url.searchParams.get('challenge'),parts=val?.split('.')||[];
   if(parts.length!==4||parts[0]!=='1'||!Number.isSafeInteger(Number(parts[1]))||Number(parts[1])<1||Number(parts[1])>4294967295||!['all','school','saintlucia','companion'].includes(parts[2])||!['0','30','60'].includes(parts[3]))return null;
   return 'https://tristos12.github.io/nyeemstudyguide/general-knowledge.html?challenge='+encodeURIComponent(val);
  }
 }catch{}
 return null;
}
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 if(!process.env.ROOM_RATE_SECRET)return fail(res,503,'Challenge Centre unavailable');
 const data=body(req),code=data?.code?.toUpperCase(),sender=nickname(data?.sender),kind=data?.kind,url=safeUrl(data?.url,kind);
 if(!validCode(code)||!sender||!url)return fail(res,400,'Check the recipient code, nickname and invitation link');
 try{
  const sql=db();
  const target=await sql.query('SELECT code FROM gk_inboxes WHERE code=$1 AND expires_at>now()',[code]);
  // Do not reveal which inbox codes exist to unauthorised senders.
  if(!target.length)return fail(res,400,'Invitation could not be sent. Check the private inbox code.');
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].slice(0,80);
  const rate=digest(process.env.ROOM_RATE_SECRET+ip);
  const [fromNetwork,toInbox]=await Promise.all([
   sql.query("SELECT count(*)::int AS n FROM gk_invitations WHERE rate_key=$1 AND created_at>now()-interval '1 hour'",[rate]),
   sql.query("SELECT count(*)::int AS n FROM gk_invitations WHERE inbox_code=$1 AND created_at>now()-interval '24 hours'",[code])
  ]);
  if(fromNetwork[0].n>=15||toInbox[0].n>=20)return fail(res,429,'Invitation limit reached. Try again later.');
  const duplicate=await sql.query("SELECT id FROM gk_invitations WHERE inbox_code=$1 AND invitation_url=$2 AND expires_at>now() LIMIT 1",[code,url]);
  if(duplicate.length)return res.status(200).json({sent:true,duplicate:true});
  await sql.query('INSERT INTO gk_invitations(inbox_code,sender_nickname,kind,invitation_url,rate_key) VALUES($1,$2,$3,$4,$5)',[code,sender,kind,url,rate]);
  return res.status(201).json({sent:true,expiresInHours:24});
 }catch(error){console.error('Send challenge invitation:',error?.message);return fail(res,503,'Could not send invitation')}
}
