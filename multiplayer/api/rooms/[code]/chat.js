import {db,prep,fail,verify,codeParam,body} from '../../../lib/server.js';
export const QUICK_MESSAGES=[
 '👋 Good luck!','👏 Well done!','😄 Nice one!',
 '💪 Keep going!','🔥 Great game!','🏆 Congratulations!'
];
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const code=codeParam(req),messageId=body(req)?.messageId;
 if(!Number.isInteger(messageId)||messageId<0||messageId>=QUICK_MESSAGES.length)return fail(res,400,'Choose an available quick message');
 try{
  const viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  if(!viewer.started_at)return fail(res,409,'Wait for your friend to join before sending messages');
  const changed=await db().query(
   "UPDATE gk_players SET quick_message=$1, quick_message_at=now() WHERE room_code=$2 AND seat=$3 AND (quick_message_at IS NULL OR quick_message_at < now() - interval '5 seconds') RETURNING quick_message_at",
   [messageId,code,viewer.seat]
  );
  if(!changed.length)return fail(res,429,'Please wait five seconds before sending another message');
  return res.status(200).json({messageId,text:QUICK_MESSAGES[messageId]});
 }catch(error){
  console.error('Quick message failed',error?.message);
  return fail(res,503,'Could not deliver message');
 }
}
