import {db,prep,fail,body,digest,nickname,codeParam,token,validCode} from '../../../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const code=codeParam(req),input=body(req),name=nickname(input?.nickname),invite=input?.invite;
 if(!validCode(code)||!name||typeof invite!=='string'||!/^[A-Za-z0-9_-]{42,50}$/.test(invite))return fail(res,400,'Invalid room, invitation or nickname');
 try{
  const sql=db();
  const rooms=await sql.query('SELECT invite_hash,started_at FROM gk_rooms WHERE code=$1 AND expires_at>now()',[code]);
  if(!rooms.length||rooms[0].invite_hash!==digest(invite))return fail(res,404,'Invitation not found or expired');
  if(rooms[0].started_at)return fail(res,409,'Room is already in progress');
  const guestToken=token();
  const guest=await sql.query('INSERT INTO gk_players(room_code,seat,nickname,token_hash) VALUES($1,2,$2,$3) ON CONFLICT DO NOTHING RETURNING seat',[code,name,digest(guestToken)]);
  if(!guest.length)return fail(res,409,'Room already has two learners');
  await sql.query('UPDATE gk_rooms SET started_at=now() WHERE code=$1 AND started_at IS NULL',[code]);
  await sql.query('UPDATE gk_players SET question_started_at=now() WHERE room_code=$1 AND next_index=0',[code]);
  res.status(200).json({code,token:guestToken,seat:2,joined:true});
 }catch(error){console.error('Join room:',error?.message);fail(res,503,'Unable to join room')}
}
