import {db,prep,fail,verify,codeParam} from '../../../lib/server.js';
import {getQuestions,questionView} from '../../../lib/questions.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='GET')return fail(res,405,'Method not allowed');
 try{
  const code=codeParam(req),viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  const players=await db().query('SELECT seat,nickname,score,next_index FROM gk_players WHERE room_code=$1 ORDER BY seat',[code]);
  const started=!!viewer.started_at,finished=viewer.next_index===60;
  const q=started&&!finished?getQuestions(viewer.mode,Number(viewer.seed))[viewer.next_index]:null;
  res.status(200).json({
   code,seat:viewer.seat,mode:viewer.mode,secondsPerQuestion:viewer.seconds_per_question,
   started,finished,nextIndex:viewer.next_index,score:viewer.score,
   question:q?questionView(q,Number(viewer.seed),viewer.next_index):null,
   deadline:q&&viewer.seconds_per_question>0&&viewer.question_started_at?new Date(new Date(viewer.question_started_at).getTime()+viewer.seconds_per_question*1000).toISOString():null,
   players:players.map(p=>({seat:p.seat,nickname:p.nickname,score:p.score,answered:p.next_index,finished:p.next_index===60})),
   bothFinished:players.length===2&&players.every(p=>p.next_index===60)
  });
 }catch(error){console.error('Read room:',error?.message);fail(res,503,'Room temporarily unavailable')}
}
