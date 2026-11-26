/* Form 3 Spanish original structured papers: II 12, III 27, IV 20, V 6, VI 6 = 71 marks.
   Add Section I 8 original spoken sport sentences for 79-mark mock exams. */
(function(){
'use strict';
const scenes=[
 {title:'Los deportes en nuestra clase',passage:'Me llamo Elena. Me gustan el fútbol y la natación, pero no me gusta el rugby. Mi amigo Tomás juega al tenis y al baloncesto, pero no le gusta el esquí. Mi amiga Clara practica el atletismo y el ciclismo. No le gustan los bolos. A todos nos gusta hacer deporte.',students:[
 ['Elena',['football','swimming'],'rugby'],['Tomás',['tennis','basketball'],'skiing'],['Clara',['athletics','cycling'],'bowling']]},
 {title:'Un sábado deportivo',passage:'Soy Mario y me gustan el tenis y el atletismo. No me gusta el esquí. Mi hermana Sofía practica la gimnasia y la natación, pero no le gusta el rugby. Mi amigo Andrés juega al fútbol y al baloncesto, pero no le gustan los bolos. Todos disfrutamos de los deportes.',students:[
 ['Mario',['tennis','athletics'],'skiing'],['Sofía',['gymnastics','swimming'],'rugby'],['Andrés',['football','basketball'],'bowling']]},
 {title:'El club de deportes',passage:'Hola, soy Valeria. Me gustan el baloncesto y el ciclismo, pero no me gusta el rugby. Pablo practica la natación y el atletismo, pero no le gusta el tenis. Irene juega al fútbol y al tenis, pero no le gusta el esquí. Cada estudiante tiene deportes favoritos diferentes.',students:[
 ['Valeria',['basketball','cycling'],'rugby'],['Pablo',['swimming','athletics'],'tennis'],['Irene',['football','tennis'],'skiing']]}
];
const verbOptions=[
 ['Yo juego al fútbol.','juego'],['Yo juego al tenis.','juego'],['Yo practico la gimnasia.','practico'],['Yo juego al baloncesto.','juego'],
 ['Yo juego al rugby.','juego'],['Yo practico el ciclismo.','practico'],['Yo practico la natación.','practico'],['Yo practico el atletismo.','practico']
];
const articleOptions=[['salto de altura','el'],['críquet','el'],['voleibol','el'],['golf','el'],['equitación','la']];
const notLikes=['Me gusta el tenis.','Me gustan el fútbol y el baloncesto.','Me gusta la natación.','Me gusta la gimnasia.','Me gusta el rugby.'];
const sports=['el baloncesto','el rugby','el fútbol','el netball','el tenis','el tenis de mesa','el atletismo','el ciclismo','la natación','el esquí','la gimnasia'];
const images=['Two wrestlers face each other on a sand-covered surface and use controlled grips to maintain balance.','A wrestler attempts a controlled throw while a partner keeps a safe posture on a sandy arena.'];
function items(index){
 const scene=scenes[index%3],questions=[],append=(section,topic,marks,stem,extra={})=>questions.push({section,topic,marks,stem,...extra});
 const [a,b,c]=scene.students;
 append('II','reading',2,'Name TWO sports '+a[0]+' likes. Answer in English. Read the passage to support your response.');
 append('II','reading',1,'Which sport does '+a[0]+' dislike? Answer in English.');
 append('II','reading',2,'Name TWO sports '+b[0]+' likes. Answer in English.');
 append('II','reading',1,'Which sport does '+b[0]+' dislike? Answer in English.');
 append('II','reading',2,'Name TWO sports '+c[0]+' likes. Answer in English.');
 append('II','reading',1,'Which sport does '+c[0]+' dislike? Answer in English.');
 append('II','reading',3,'Do the three students have exactly the same sporting preferences? Give ONE accurate detail from the passage supporting your answer.');
 append('III','verbs',4,'Explain in your own words when to use jugar and when to use practicar for sports. Include two correct examples in Spanish.');
 const forms=index===0?verbOptions:verbOptions.map(([text,answer],i)=>[text.replace('Yo ',index===1?'En la clase, yo ':'Después de la escuela, yo '),answer]);
 forms.forEach(([example],i)=>append('III','verbs',1,'Complete the sentence using the correct first-person singular (yo) form of jugar or practicar: '+example.replace(/\b(juego|practico)\b/,'__________')));
 articleOptions.forEach(([sport],i)=>append('III','articles',1,'Fill in the correct article, el or la: ______ '+sport+'.'));
 notLikes.forEach((sentence,i)=>append('III','likes',2,'Rewrite in Spanish to make this sentence NEGATIVE while preserving its meaning apart from the preference: '+sentence));
 const chosen=[sports.slice(0,4),sports.slice(3,7),sports.slice(7,11)][index%3];
 chosen.forEach((sport,i)=>append('IV','illustration',5,'Write the Spanish name of the sport you have selected ('+sport+'). Draw a PERSON taking part in the sport and include at least TWO recognisable features such as equipment, movement or setting. Marking: Spanish name 1, participating person 2, recognisable details 2. You can draw on the canvas or upload an image.',{drawing:true}));
 append('V','questions',3,'Translate the Spanish question into ENGLISH: ¿Qué deportes juegas?');
 append('V','questions',3,'Translate the Spanish question into ENGLISH: ¿Qué deportes te gustan?');
 append('VI','culture',1,'Study the description of traditional Canarian wrestling and identify ONE physical skill needed for this sport.');
 append('VI','culture',1,'State ONE suitable safety precaution for students practising a traditional grappling or wrestling sport.');
 append('VI','culture',1,'Describe ONE way la lucha canaria differs from association football (soccer).');
 append('VI','culture',2,'Identify ONE sport or game you have studied and give ONE skill it requires. Write the NAME OF THE SPORT IN SPANISH.');
 append('VI','culture',1,'Suggest ONE reason why a community should preserve traditional sporting practices such as la lucha canaria.');
 return {id:'structured-'+(index+1),title:'Spanish Structured Paper '+(index+1),passage:scene.passage,passageTitle:scene.title,cultureDescription:images.join('\n\n'),questions};
}
window.BSS_SPANISH_WRITTEN=Array.from({length:3},(_,i)=>items(i));
})();