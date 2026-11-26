/* Form 3 Music Theory original Grade 9 practice bank.
 * Five 60-question practices, following six topics from the BSS November 2026 paper.
 * Music diagrams are constructed from data in form-3-music-notation.js.
 */
(function(){
'use strict';
const topics={values:'Section A · Note Values',rests:'Section B · Musical Rests',time:'Section C · Time Signatures',math:'Section D · Musical Mathematics',ledger:'Section E · Ledger-Line Notes',excerpt:'Section F · Reading a Musical Excerpt'};
const sections=Object.keys(topics);
const noteNames=['whole','half','quarter','eighth','sixteenth'],durations=[4,2,1,.5,.25];
const restNames=['whole rest','half rest','quarter rest','eighth rest','sixteenth rest'];
const pitchNames=['A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
const bar=[
 [{note:'E4',beats:1},{note:'G4',beats:1},{note:'B4',beats:2}],
 [{note:'C5',beats:1},{note:'B4',beats:1},{note:'A4',beats:1},{note:'G4',beats:1}],
 [{note:'F4',beats:2},{rest:'quarter',beats:1},{note:'C5',beats:1}],
 [{note:'C4',beats:1},{note:'D4',beats:1},{note:'E4',beats:2}]
];
function melody(version){const v=version%5;return bar.map(items=>items.map(it=>it.note?{...it,note:pitchNames[pitchNames.indexOf(it.note)+v]}:{...it}))}
function option(question,correct,alternatives,explanation,visual){
 const choices=[String(correct),...alternatives.map(String)];
 if(choices.length!==4||new Set(choices).size!==4)throw Error('Invalid options for '+question+': '+JSON.stringify(choices));
 const shift=(question.length*3+explanation.length)%4;
 const options=choices.slice(shift).concat(choices.slice(0,shift));
 return {stem:question,options,answer:options.indexOf(String(correct)),explanation,visual:visual||null}
}
function numeral(value){return Number.isInteger(value)?String(value):String(value)}
function topicQuestion(topic,n,p){
 const i=n+p*10;
 if(topic==='values'){
  const k=i%5,v=durations[k],name=noteNames[k];
  if(n%2===0){
   return option('With a quarter note worth one beat, how many beats does a '+name+' note last?',numeral(v),
    durations.filter(x=>x!==v).slice(0,3).map(numeral),
    'A '+name+' note lasts '+v+' quarter-note beat'+(v===1?'':'s')+'. A whole note lasts 4, a half note 2, a quarter note 1, an eighth note ½ and a sixteenth note ¼.',{type:'note',value:name});
  }
  const next=(k+2)%5,count=durations[k]/durations[next];
  if(count>=1&&Number.isInteger(count)){
   const distract=[count+1,Math.max(1,count-1),count*2].map(numeral);
   const unique=distr.filter((x,j)=>x!==numeral(count)&&distr.indexOf(x)===j);
   while(unique.length<3)unique.push(String(count+unique.length+3));
   return option('How many '+noteNames[next]+' notes have the same total duration as one '+name+' note?',count,unique.slice(0,3),
    'Divide the '+name+'-note duration ('+durations[k]+' beats) by '+noteNames[next]+'-note duration ('+durations[next]+' beats).',{type:'note',value:name});
  }
  const options=[noteNames[k],noteNames[(k+1)%5],noteNames[(k+2)%5],noteNames[(k+3)%5]];
  const question='Which type of note lasts '+v+' beat'+(v===1?'':'s')+' in simple 4/4 time?';
  return option(question,options[0],options.slice(1),'Note length follows its written symbol. A '+name+' note has a value of '+v+' quarter-note beats.',{type:'note',value:name});
 }
 if(topic==='rests'){
  const k=i%5,v=durations[k],name=restNames[k];
  if(n%2===0){
   return option('Which rest lasts '+v+' quarter-note beat'+(v===1?'':'s')+'?',name,[restNames[(k+1)%5],restNames[(k+2)%5],restNames[(k+3)%5]],
    'The '+name+' gives '+v+' beat'+(v===1?'':'s')+' of silence when the quarter note is one beat.',{type:'rest',value:name});
  }
  if(n%3===0)return option('Which note is equal in duration to a '+name+'?',noteNames[k]+' note',
    [noteNames[(k+1)%5]+' note',noteNames[(k+2)%5]+' note',noteNames[(k+3)%5]+' note'],
    'Notes and rests of the same value use the same number of beats. '+name+' = '+v+' beat'+(v===1?'':'s')+'.',{type:'rest',value:name});
  const other=durations[(k+1)%5],sum=v+other;
  return option('A '+name+' is followed by a '+noteNames[(k+1)%5]+' note. How many beats do they occupy altogether?',numeral(sum),
   [numeral(sum+.5),numeral(sum+1),numeral(Math.max(.25,Math.abs(v-other)))],
   'A rest contributes silent time just like a note contributes sounding time. Add '+v+' + '+other+' = '+sum+' beats.');
 }
 if(topic==='time'){
  const beats=[2,3,4,6],top=beats[i%4],bottom=i%5===0?8:4;
  if(n%3===0){
   const answer=top;
   return option('In '+top+'/'+bottom+' time, how many '+(bottom===4?'quarter-note':'eighth-note')+' units fill one complete bar?',answer,
    [answer+1,answer+2,Math.max(1,answer-1)],
    'The top number of a time signature tells how many units indicated by the lower number are grouped in one bar. For '+top+'/'+bottom+', that is '+top+' '+(bottom===4?'quarter':'eighth')+'-note units.',
    {type:'signature',top,bottom});
  }
  if(n%3===1){
   const target=[2,3,4][(Math.floor(n/3)+p)%3];
   return option('Which simple time signature normally contains '+target+' quarter-note beats in each complete bar?',target+'/4',
    [((target%4)+1)+'/4',((target+1)%4+1)+'/4',target+'/8'],
    'In simple '+target+'/4 time, a complete bar has '+target+' quarter-note beats.',{type:'signature',top:target,bottom:4});
  }
  const limit=[2,3,4][(Math.floor(n/3)+p)%3],used=i%2===0?1:2,remaining=limit-used;
  return option('A bar is written in '+limit+'/4. It already contains '+used+' quarter-note beat'+(used===1?'':'s')+'. How many quarter-note beats remain?',remaining,
    [remaining+1,remaining+2,remaining+3],
    'A complete '+limit+'/4 bar needs '+limit+' quarter-note beats. Subtract '+used+' to find '+remaining+' remaining.',{type:'signature',top:limit,bottom:4});
 }
 if(topic==='math'){
  const a=[1,2,.5,.25,4][i%5],b=[.5,1,2,.25,1][(i+2)%5],sum=a+b;
  if(n%3===0)return option('How many beats are there in a '+(a===1?'quarter':a===2?'half':a===4?'whole':a===.5?'eighth':'sixteenth')+' note and a '+(b===1?'quarter':b===2?'half':b===4?'whole':b===.5?'eighth':'sixteenth')+' note altogether?',numeral(sum),
  [numeral(sum+.5),numeral(sum+1),numeral(sum+2)],'Add the two durations: '+a+' + '+b+' = '+sum+' quarter-note beats.');
  if(n%3===1){
   const values=[2,4,8,16],target=values[i%4],unit=4/target;
   return option('How many notes of duration '+unit+' beat'+(unit===1?'':'s')+' are needed to fill a four-beat bar?',target,
     [target+2,target+4,Math.max(1,target/2)],'Divide four beats by '+unit+' beat per note: 4 ÷ '+unit+' = '+target+'.');
  }
  const count=2+(i%7),unit=durations[i%5],total=count*unit;
  return option('A musician writes '+count+' notes, each worth '+unit+' beat'+(unit===1?'':'s')+'. What is their total duration?',numeral(total),
   [numeral(total+unit),numeral(total+2*unit),numeral(Math.max(.25,total-unit))],
   'Multiply the number of notes by each note’s value: '+count+' × '+unit+' = '+total+' beats.');
 }
 if(topic==='ledger'){
  const pitches=['D4','C4','B3','A3','G5','A5','B5','C6','E4','F5'];
  const note=pitches[(n+3*p)%pitches.length];
  const alternatives=pitches.filter(x=>x!==note);
  const wrong=[alternatives[(i+1)%alternatives.length],alternatives[(i+3)%alternatives.length],alternatives[(i+5)%alternatives.length]];
  return option('Which pitch is shown in treble clef on this staff?',note,wrong,
   'Read treble staff lines bottom to top as E4 G4 B4 D5 F5. Spaces are F4 A4 C5 E5. Notes outside the staff continue alphabetically onto ledger lines. The shown note is '+note+'.',
   {type:'staff',pitch:note});
 }
 if(topic==='excerpt'){
  const version=p,sequence=melody(version),flat=sequence.flat(),noteOnly=flat.filter(q=>q.note);
  const max=noteOnly.reduce((a,b)=>pitchNames.indexOf(a.note)>=pitchNames.indexOf(b.note)?a:b).note;
  const questions=[
   ['How many complete bars are displayed in the four-bar melody?',4,[2,3,5],'The excerpt has four measures separated by bar lines.'],
   ['What is the time signature printed before the melody?','4/4',['2/4','3/4','6/8'],'A 4 over 4 means four quarter-note beats per measure.'],
   ['What is the first pitch in the melody?',sequence[0][0].note,[sequence[0][1].note,sequence[0][2].note,sequence[1][0].note],'Read the note on the first beat of bar 1 in the treble staff.'],
   ['Which bar contains a quarter rest?',3,[1,2,4],'The quarter-rest symbol is placed in bar 3.'],
   ['How many beats are carried by the first note in bar 4?',1,[2,.5,4],'The first note in bar 4 is a quarter note worth one beat.'],
   ['How many beats do the note values in bar 2 add up to?',4,[2,3,5],'Bar 2 contains four quarter notes: 1 + 1 + 1 + 1 = 4 beats.'],
   ['What is the highest pitch in the melody?',max,[sequence[0][0].note,sequence[0][1].note,sequence[3][0].note],'The highest note is the one positioned highest on the staff.'],
   ['How many beats is the half note in bar 1 worth?',2,[1,3,4],'A half note lasts two quarter-note beats.'],
   ['How many beats do the first two notes of bar 4 add up to?',2,[1,3,4],'The first two notes in bar 4 are quarter notes: 1 + 1 = 2 beats.'],
   ['Which bar begins with a half note?',3,[1,2,4],'Bar 3 begins with a half note, followed by a quarter rest and a quarter note.']
  ];
  const [stem,correct,wrong,explanation]=questions[n];
  let distract=wrong.map(String).filter(x=>x!==String(correct));
  if(new Set(distract).size!==3){const possibilities=pitchNames.filter(x=>x!==correct&&!distract.includes(x));for(const extra of possibilities){if(distract.length>=3)break;distract.push(extra)}}
  return option(stem,correct,distract.slice(0,3),explanation+' The passage uses a four-bar melody with common note values.',{type:'excerpt',version});
 }
 throw Error('Unknown music topic '+topic)
}
const papers=Array.from({length:5},(_,p)=>sections.flatMap(topic=>Array.from({length:10},(_,i)=>topicQuestion(topic,i,p))));
window.BSS_MUSIC={topics,sections,noteNames,durations,restNames,pitchNames,melody,papers};
})();