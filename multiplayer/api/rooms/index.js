import {randomInt} from 'node:crypto';
import {db,prep,fail,body,roomCode,token,digest,nickname} from '../../lib/server.js';
import {validModes,validTimers} from '../../lib/questions.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const input=body(req),name=nickname(input?.nickname),mode=input?.mode||'all',seconds=Number(input?.secondsPerQuestion??0);
 if(!name||!validModes.includes(mode)||!validTimers.includes(seconds))return fail(res,400,'Invalid nickname, category or timer');
 if(!process.env.ROOM_RATE_SECRET)return fail(res,503,'Room rate limit is not configured');
 try{
  const sql=db(),code=roomCode(),invite=token(),hostToken=token(),seed=randomInt(1,4294967296);
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].slice(0,80);
  const rateKey=digest(process.env.ROOM_RATE_SECRET+ip);
  const recent=await sql.query("SELECT count(*)::int AS n FROM gk_rooms WHERE rate_key=$1 AND created_at>now()-interval '1 hour'",[rateKey]);
  if(recent[0].n>=30)return fail(res,429,'Too many rooms from this network. Try again later');
  const rooms=await sql.query('INSERT INTO gk_rooms(code,invite_hash,seed,mode,seconds_per_question,rate_key) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING code',[code,digest(invite),seed,mode,seconds,rateKey]);
  if(!rooms.length)return fail(res,503,'Room code collision, please retry');
  await sql.query('INSERT INTO gk_players(room_code,seat,nickname,token_hash) VALUES($1,1,$2,$3)',[code,name,digest(hostToken)]);
  res.status(201).json({code,invite,token:hostToken,seat:1,mode,secondsPerQuestion:seconds,expiresInHours:24});
 }catch(error){console.error('Create room:',error?.message);fail(res,503,'Room service temporarily unavailable')}
}
