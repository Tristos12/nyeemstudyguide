import {db,prep,fail,verify,codeParam,body} from '../../../lib/server.js';
import {checkMessage} from '../../../lib/chat-filter.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const checked=checkMessage(body(req)?.text);
 if(!checked.ok)return fail(res,400,checked.error);
 try{
  const code=codeParam(req),viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  if(!viewer.started_at)return fail(res,409,'Wait for the second player to join');
  // One atomic statement ensures one message per five seconds, even with simultaneous requests.
  const rows=await db().query(
   `WITH permitted AS (
     UPDATE gk_players SET typed_message_at=now()
     WHERE room_code=$1 AND seat=$2
       AND (typed_message_at IS NULL OR typed_message_at<=now()-interval '5 seconds')
       AND (SELECT count(*) FROM gk_typed_messages WHERE room_code=$1 AND sender_seat=$2)<100
     RETURNING room_code,seat
    )
    INSERT INTO gk_typed_messages(room_code,sender_seat,message_text)
    SELECT room_code,seat,$3 FROM permitted
    RETURNING id,created_at`,
   [code,viewer.seat,checked.text]
  );
  if(!rows.length)return fail(res,429,'Please wait five seconds between messages. A room permits up to 100 typed messages per player.');
  return res.status(201).json({id:Number(rows[0].id),text:checked.text,createdAt:rows[0].created_at});
 }catch(error){
  console.error('Typed chat failed',error?.message);
  return fail(res,503,'Unable to send message');
 }
}
