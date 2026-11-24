import {neon} from '@neondatabase/serverless';
import {randomBytes,createHash} from 'node:crypto';
export const db=()=>{if(!process.env.DATABASE_URL)throw Error('Missing database connection');return neon(process.env.DATABASE_URL)};
export const digest=s=>createHash('sha256').update(s).digest('hex');
export const token=()=>randomBytes(32).toString('base64url');
export function roomCode(){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=randomBytes(8);return [...b].map(x=>alphabet[x%alphabet.length]).join('')}
export function nickname(v){if(typeof v!=='string')return null;const n=v.trim().replace(/\s+/g,' ');return /^[\p{L}\p{N} _-]{2,24}$/u.test(n)?n:null}
export const validCode=s=>typeof s==='string'&&/^[A-HJ-NP-Z2-9]{8}$/.test(s);
export function prep(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Vary','Origin');
 const origin=req.headers.origin,allowed=process.env.ALLOWED_ORIGIN||'https://tristos12.github.io';
 if(origin===allowed){
  res.setHeader('Access-Control-Allow-Origin',allowed);
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 }
 if(req.method==='OPTIONS'){res.status(204).end();return false}
 if(origin&&origin!==allowed){res.status(403).json({error:'Origin not permitted'});return false}
 return true;
}
export const fail=(res,status,message)=>res.status(status).json({error:message});
export const body=req=>req.body&&typeof req.body==='object'&&!Array.isArray(req.body)?req.body:null;
export const codeParam=req=>typeof req.query?.code==='string'?req.query.code.toUpperCase():null;
export async function verify(req,code){
 if(!validCode(code))return null;
 const auth=req.headers.authorization||'';
 if(!/^Bearer [A-Za-z0-9_-]{42,50}$/.test(auth))return null;
 const rows=await db().query('SELECT p.room_code,p.seat,p.nickname,p.next_index,p.score,p.question_started_at,p.finished_at,r.seed,r.mode,r.seconds_per_question,r.started_at FROM gk_players p JOIN gk_rooms r ON p.room_code=r.code WHERE p.room_code=$1 AND p.token_hash=$2 AND r.expires_at>now() LIMIT 1',[code,digest(auth.slice(7))]);
 return rows[0]||null;
}
