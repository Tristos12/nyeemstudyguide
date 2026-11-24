import {randomBytes} from 'node:crypto';
import {db,prep,fail,body,token,digest,nickname} from '../lib/server.js';
const validCode=c=>typeof c==='string'&&/^[A-Z2-9]{10}$/.test(c);
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeCode=()=>[...randomBytes(10)].map(x=>alphabet[x%alphabet.length]).join('');
const ipKey=req=>digest(process.env.ROOM_RATE_SECRET+String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].slice(0,80));
const auth=req=>typeof req.headers.authorization==='string'&&/^Bearer [A-Za-z0-9_-]{42,50}$/.test(req.headers.authorization)?req.headers.authorization.slice(7):null;
async function verifiedInbox(req,code){
 const secret=auth(req);if(!validCode(code)||!secret)return false;
 const rows=await db().query('SELECT code FROM gk_inboxes WHERE code=$1 AND token_hash=$2 AND expires_at>now()',[code,digest(secret)]);
 return !!rows.length;
}
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(!process.env.ROOM_RATE_SECRET)return fail(res,503,'Challenge Centre unavailable');
 const action=body(req)?.action;
 try{
  if(req.method==='POST'&&action==='create'){
   const rate=ipKey(req),sql=db();
   // Clear expired capability-only inboxes, with dependent invitations.
   await sql.query('DELETE FROM gk_inboxes WHERE expires_at<now()');
   const count=await sql.query("SELECT count(*)::int AS n FROM gk_inboxes WHERE rate_key=$1 AND created_at>now()-interval '24 hours'",[rate]);
   if(count[0].n>=5)return fail(res,429,'Too many inboxes created from this network today');
   const code=makeCode(),secret=token();
   const rows=await sql.query('INSERT INTO gk_inboxes(code,token_hash,rate_key) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING code,expires_at',[code,digest(secret),rate]);
   if(!rows.length)return fail(res,503,'Please try again');
   return res.status(201).json({code,secret,expiresAt:rows[0].expires_at});
  }
  const code=(req.method==='GET'?req.query?.code:body(req)?.code);
  if(!await verifiedInbox(req,code))return fail(res,401,'Private inbox access invalid or expired');
  if(req.method==='GET'){
   const items=await db().query("SELECT id,sender_nickname,kind,invitation_url,status,created_at,expires_at FROM gk_invitations WHERE inbox_code=$1 AND expires_at>now() ORDER BY created_at DESC LIMIT 30",[code]);
   return res.status(200).json({items:items.map(i=>({id:Number(i.id),sender:i.sender_nickname,kind:i.kind,url:i.invitation_url,status:i.status,at:i.created_at,expiresAt:i.expires_at}))});
  }
  if(req.method==='POST'&&action==='update'){
   const id=body(req)?.id,status=body(req)?.status;
   if(!Number.isSafeInteger(id)||id<1||!['accepted','dismissed'].includes(status))return fail(res,400,'Invalid invitation action');
   const rows=await db().query("UPDATE gk_invitations SET status=$3 WHERE id=$1 AND inbox_code=$2 AND expires_at>now() AND status='pending' RETURNING id",[id,code,status]);
   if(!rows.length)return fail(res,409,'Invitation already handled or expired');
   return res.status(200).json({updated:true});
  }
  if(req.method==='POST'&&action==='delete'){
   await db().query('DELETE FROM gk_inboxes WHERE code=$1',[code]);
   return res.status(200).json({deleted:true});
  }
  return fail(res,405,'Unsupported inbox request');
 }catch(error){console.error('Challenge inbox:',error?.message);return fail(res,503,'Challenge Centre temporarily unavailable')}
}
