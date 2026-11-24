import {db,prep,fail,body,digest,nickname,codeParam,token,validCode} from '../../../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const code=codeParam(req),input=body(req),name=nickname(input?.nickname),invite=input?.invite;
 if(!validCode(code)||!name||typeof invite!=='string'||!/^[A-Za-z0-9_-]{42,50}$/.test(invite))return fail(res,400,'Invalid room, invitation or nickname');
 try{
  const sql=db();
  const guestToken=token();
  // Accept seat two only while the invitation is valid and the room has not begun.
  // The unique (room_code, seat) constraint prevents concurrent double joins.
  const guest=await sql.query(
   'INSERT INTO gk_players(room_code,seat,nickname,token_hash) SELECT code,2,$2,$3 FROM gk_rooms WHERE code=$1 AND invite_hash=$4 AND started_at IS NULL AND expires_at>now() ON CONFLICT DO NOTHING RETURNING seat',
   [code,name,digest(guestToken),digest(invite)]
  );
  if(!guest.length)return fail(res,409,'Invitation invalid, expired or room already full');
  await sql.query('UPDATE gk_rooms SET started_at=now() WHERE code=$1 AND started_at IS NULL',[code]);
  await sql.query('UPDATE gk_players SET question_started_at=now() WHERE room_code=$1 AND next_index=0',[code]);
  res.status(200).json({code,token:guestToken,seat:2,joined:true});
 }catch(error){console.error('Join room:',error?.message);fail(res,503,'Unable to join room')}
}
