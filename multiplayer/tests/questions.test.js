import test from 'node:test';
import assert from 'node:assert/strict';
import {getQuestions,questionView,scoreAnswer,validModes} from '../lib/questions.js';

for(const mode of validModes){
 for(const seed of [1,13,5821,4294967295]){
  test(mode+' seed '+seed+' selects and scores 60 distinct questions',()=>{
   const qs=getQuestions(mode,seed);
   assert.equal(qs.length,60);
   assert.equal(new Set(qs.map(q=>q.id)).size,60);
   for(let level=0;level<3;level++)
    assert.equal(qs.slice(level*20,(level+1)*20).filter(q=>q.difficulty>=level+1).length,20);
   assert.deepEqual(qs.map(q=>q.id),getQuestions(mode,seed).map(q=>q.id));
   for(const index of [0,1,19,20,39,40,59]){
    const view=questionView(qs[index],seed,index);
    assert.equal(view.options.length,4);
    assert.equal(new Set(view.options).size,4);
    const correct=view.options.indexOf(qs[index].correct);
    assert.ok(scoreAnswer(qs[index],seed,index,correct));
    assert.equal(scoreAnswer(qs[index],seed,index,(correct+1)%4),false);
    assert.equal(scoreAnswer(qs[index],seed,index,null),false);
   }
  });
 }
}
