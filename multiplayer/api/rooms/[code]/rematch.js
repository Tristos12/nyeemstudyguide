import {randomInt} from 'node:crypto';
import {db,prep,fail,verify,codeParam,body} from '../../../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const requestedRound=body(req)?.round;
 if(!Number.isSafeInteger(requestedRound)||requestedRound<1)return fail(res,400,'Invalid match number');
 try{
  const code=codeParam(req),viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  const newSeed=randomInt(1,4294967296);
  const rows=await db().query(
   'SELECT result_status,result_round FROM gk_request_rematch($1,$2,$3,$4)',
   [code,viewer.seat,requestedRound,newSeed]
  );
  const result=rows[0];
  if(!result)return fail(res,503,'Could not request rematch');
  if(result.result_status==='expired')return fail(res,410,'Room expired; please create a new room');
  if(result.result_status==='stale')return res.status(409).json({error:'A new round has already begun',round:result.result_round});
  if(result.result_status==='not_finished')return fail(res,409,'Both players must finish all 60 questions before a rematch');
  if(result.result_status==='unauthorized')return fail(res,403,'Only players in the room may request a rematch');
  return res.status(200).json({status:result.result_status,round:result.result_round});
 }catch(error){
  console.error('Rematch request failed',error?.message);
  return fail(res,503,'Rematch request could not be completed');
 }
}
