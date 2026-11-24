import {db,prep,fail,verify,codeParam,body} from '../../../lib/server.js';
import {getQuestions,questionView,scoreAnswer} from '../../../lib/questions.js';
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='POST')return fail(res,405,'Method not allowed');
 const code=codeParam(req),input=body(req),index=input?.index,option=input?.option;
 if(!Number.isInteger(index)||index<0||index>=60||!(option===null||Number.isInteger(option)&&option>=0&&option<=3))return fail(res,400,'Invalid answer');
 try{
  const viewer=await verify(req,code);
  if(!viewer)return fail(res,401,'Room access invalid or expired');
  if(!viewer.started_at)return fail(res,409,'Waiting for the other learner');
  if(viewer.next_index!==index)return fail(res,409,'Answer already submitted or out of order');
  const seed=Number(viewer.seed),q=getQuestions(viewer.mode,seed)[index];
  const expired=viewer.seconds_per_question>0&&viewer.question_started_at&&Date.now()>new Date(viewer.question_started_at).getTime()+viewer.seconds_per_question*1000;
  const correct=!expired&&scoreAnswer(q,seed,index,option);
  const updated=await db().query('UPDATE gk_players SET score=score+$1,next_index=next_index+1,question_started_at=CASE WHEN next_index+1>=60 THEN NULL ELSE now() END,finished_at=CASE WHEN next_index+1>=60 THEN now() ELSE NULL END WHERE room_code=$2 AND seat=$3 AND next_index=$4 RETURNING next_index,score',[correct?10:0,code,viewer.seat,index]);
  if(!updated.length)return fail(res,409,'Answer already submitted');
  const view=questionView(q,seed,index);
  res.status(200).json({correct,expired:!!expired,correctOption:view.options.indexOf(q.correct),explanation:q.explanation,score:updated[0].score,nextIndex:updated[0].next_index,finished:updated[0].next_index===60});
 }catch(error){console.error('Submit answer:',error?.message);fail(res,503,'Answer could not be saved. Retry safely.')}
}
