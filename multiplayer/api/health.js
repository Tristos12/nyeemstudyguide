import {db,prep,fail} from '../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='GET')return fail(res,405,'Method not allowed');
 if(!process.env.DATABASE_URL||!process.env.ROOM_RATE_SECRET){
  return res.status(503).json({status:'not_configured',multiplayerAvailable:false});
 }
 try{
  const rows=await db().query('SELECT 1 AS ready');
  if(rows?.[0]?.ready!==1)throw Error('Health query failed');
  return res.status(200).json({status:'ready',multiplayerAvailable:true});
 }catch(error){
  console.error('Multiplayer health check:',error?.message);
  return res.status(503).json({status:'database_unavailable',multiplayerAvailable:false});
 }
}
