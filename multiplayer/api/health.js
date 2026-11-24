import {db,prep,fail} from '../lib/server.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='GET')return fail(res,405,'Method not allowed');
 if(!process.env.DATABASE_URL||!process.env.ROOM_RATE_SECRET){
  return res.status(503).json({status:'not_configured',multiplayerAvailable:false});
 }
 try{
  const rows=await db().query("SELECT current_database() AS database_name, to_regclass('public.gk_rooms') IS NOT NULL AS rooms_present, to_regclass('public.gk_players') IS NOT NULL AS players_present");
  const state=rows?.[0];
  // Do not claim readiness if a generic database is attached without the dedicated schema.
  if(!state?.rooms_present||!state?.players_present){
   return res.status(503).json({status:'schema_not_installed',multiplayerAvailable:false});
  }
  return res.status(200).json({status:'ready',multiplayerAvailable:true});
 }catch(error){
  console.error('Multiplayer health check:',error?.message);
  return res.status(503).json({status:'database_unavailable',multiplayerAvailable:false});
 }
}
