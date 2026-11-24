import {db,prep,fail,verify,codeParam,body} from '../../../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const id=body(req)?.messageId;
 if(!Number.isSafeInteger(id)||id<1)return fail(res,400,'Invalid message');
 try{
  const code=codeParam(req),viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  const rows=await db().query(
   `UPDATE gk_typed_messages SET reported_at=now(),reported_by_seat=$3
      WHERE id=$1 AND room_code=$2 AND sender_seat<>$3 AND reported_at IS NULL
      RETURNING id`,
   [id,code,viewer.seat]
  );
  if(!rows.length)return fail(res,409,'Message already reported, unavailable, or belongs to you');
  return res.status(200).json({reported:true});
 }catch(error){
  console.error('Report failed',error?.message);
  return fail(res,503,'Unable to report message');
 }
}
