/* Original Form 3 Spanish Term 1 revision questions, not copies of the school examination.
   Five complete 60-item practices: 8+8+8+8+7+7+7+7. */
(function(){
'use strict';
const topics={listening:'Listening and Sports Vocabulary',reading:'Reading Preferences',verbs:'Jugar and Practicar',articles:'Gender and Sport Articles',likes:'Me gusta, Me gustan and Negation',illustration:'Identifying and Illustrating Sports',questions:'Sports Questions and Translation',culture:'Traditional Sports and La Lucha Canaria'};
const sections=Object.keys(topics),counts=[8,8,8,8,7,7,7,7];
const sports=[
 ['el fútbol','football','jugar al fútbol'],['el baloncesto','basketball','jugar al baloncesto'],['el tenis','tennis','jugar al tenis'],['el rugby','rugby','jugar al rugby'],
 ['la natación','swimming','practicar la natación'],['el ciclismo','cycling','practicar el ciclismo'],['el esquí','skiing','practicar el esquí'],['el atletismo','athletics','practicar el atletismo'],
 ['la gimnasia','gymnastics','practicar la gimnasia'],['los bolos','bowling','practicar los bolos'],['el tenis de mesa','table tennis','jugar al tenis de mesa'],['la equitación','horseback riding','practicar la equitación'],['el voleibol','volleyball','jugar al voleibol'],['el críquet','cricket','jugar al críquet'],['el golf','golf','jugar al golf'],['el netball','netball','jugar al netball'],['el salto de altura','high jump','practicar el salto de altura']
];
const readPassages=[
 {name:'Lucía',likes:['el baloncesto','el tenis'],dislikes:['el rugby'],text:'A Lucía le gustan el baloncesto y el tenis, pero no le gusta el rugby.'},
 {name:'Diego',likes:['el fútbol','la natación'],dislikes:['el esquí'],text:'A Diego le gustan el fútbol y la natación, pero no le gusta el esquí.'},
 {name:'Sara',likes:['la gimnasia','el atletismo','el ciclismo'],dislikes:['los bolos'],text:'A Sara le gustan la gimnasia, el atletismo y el ciclismo, pero no le gustan los bolos.'},
 {name:'Ana',likes:['la natación','el voleibol'],dislikes:['el tenis'],text:'A Ana le gustan la natación y el voleibol, pero no le gusta el tenis.'},
 {name:'Javier',likes:['el rugby','el ciclismo'],dislikes:['la gimnasia'],text:'A Javier le gustan el rugby y el ciclismo, pero no le gusta la gimnasia.'}
];
const qs={listening:[],reading:[],verbs:[],articles:[],likes:[],illustration:[],questions:[],culture:[]};
const decoys=(values,correct)=>values.filter(x=>x!==correct).slice(0,3);
function add(topic,stem,correct,other,explanation,extra={}){
 let alternatives=[...new Set(other.filter(x=>String(x)!==String(correct)))];
 if(alternatives.length<3)throw Error('Insufficient alternatives: '+stem);
 qs[topic].push({topic,stem,options:[String(correct),...alternatives.slice(0,3).map(String)],answer:0,explanation,...extra})
}
const english=sports.map(x=>x[1]),spanish=sports.map(x=>x[0]);
sports.forEach(([es,en,phrase],i)=>{
 const options=[english[(i+3)%english.length],english[(i+6)%english.length],english[(i+9)%english.length]];
 add('listening','Listen to the Spanish sentence. Which sport is named?',en,options,'The phrase '+es+' refers to '+en+'.',{audio:'En la escuela practicamos '+es+'.'});
 add('illustration','A student draws someone playing '+en+'. Which Spanish sport label belongs under the picture?',es,[spanish[(i+2)%spanish.length],spanish[(i+5)%spanish.length],spanish[(i+8)%spanish.length]],'The appropriate Spanish name for '+en+' is '+es+'.');
 add('verbs','Which Spanish phrase correctly describes “I '+(phrase.startsWith('jugar')?'play':'practise')+' '+en+'”?',phrase.startsWith('jugar')?'Yo juego '+phrase.slice(5):'Yo practico '+phrase.slice(9),
   [phrase.startsWith('jugar')?'Yo practico '+phrase.slice(5):'Yo juego '+phrase.slice(9),
    'Yo jugar '+es,'Yo practica '+es],
    'Jugar changes to juego for yo; practicar changes to practico. A ball game may use jugar al, while activities commonly use practicar.');
 add('articles','Which definite article belongs before '+es.replace(/^(el |la |los )/,'')+'?',es.split(' ')[0],decoys(['el','la','los','las'],es.split(' ')[0]),
    'The usual definite article in '+es+' is '+es.split(' ')[0]+'. Memorise article and noun together.');
});
readPassages.forEach((p,i)=>{
 const items=p.likes.map(s=>sports.find(x=>x[0]===s)[1]);
 const disliked=p.dislikes[0],dislikedEn=sports.find(x=>x[0]===disliked)[1];
 add('reading','Read: '+p.text+' Which sport does '+p.name+' dislike?',dislikedEn,decoys(english,dislikedEn),'The expression no le gusta (or no le gustan) identifies what the person dislikes.');
 add('reading','Read: '+p.text+' Which sport does '+p.name+' like?',items[0],decoys(english,items[0]),'Me gusta or le gusta indicates a liked activity; read the list before the contrast pero.');
 add('likes','Which sentence correctly says '+p.name+' does NOT like '+dislikedEn+'?','No le gusta '+disliked+'.',
 ['Le gusta '+disliked+'.','No me gusta '+disliked+'.','Le gustan el fútbol y el rugby.'],'No le gusta refers to one singular-liked activity or sport; no precedes the pronoun le.');
 add('likes','Which phrase means “I do not like '+items[0]+'”?','No me gusta '+p.likes[0]+'.',
 ['Me gusta '+p.likes[0]+'.','Me gustan '+disliked+'.','Yo no juego las deportes.'],'No me gusta expresses a negative personal preference about one activity.');
});
const translations=[
 ['¿Qué deportes juegas?','What sports do you play?','¿Qué deportes te gustan?'],
 ['¿Qué deportes te gustan?','What sports do you like?','¿Qué deportes juegas?'],
 ['Me gusta el tenis.','I like tennis.','No me gusta el tenis.'],
 ['No me gusta el rugby.','I do not like rugby.','Me gusta el rugby.'],
 ['Practico la natación.','I practise swimming.','Juego al baloncesto.'],
 ['Juego al fútbol.','I play football.','Practico el fútbol.'],
 ['¿Practicas la gimnasia?','Do you practise gymnastics?','¿Juegas al tenis?'],
 ['¿Te gusta el ciclismo?','Do you like cycling?','¿Practicas el ciclismo?'],
 ['Me gustan el tenis y el baloncesto.','I like tennis and basketball.','No me gusta el tenis.'],
 ['¿Qué deporte prefieres?','Which sport do you prefer?','¿Qué deportes juegas?']
];
translations.forEach(([es,en],i)=>add('questions','Translate into English: '+es,en,[translations[(i+2)%10][1],translations[(i+4)%10][1],translations[(i+6)%10][1]],'Compare the key Spanish question or verb phrase with the English meaning.'));
const culture=[
 ['Where did the traditional sport la lucha canaria develop?','Canary Islands (Spain)',['New Zealand','Japan','India'],'Lucha canaria is traditional wrestling from the Canary Islands, Spain.'],
 ['What type of sport is la lucha canaria?','Traditional wrestling',['Racket sport','Swimming race','Cycling event'],'It involves grappling and balance, not kicking a football.'],
 ['Which physical ability can help a participant in la lucha canaria?','Balance',['Swimming speed','Ski jumping','Horse riding'],'Wrestlers use balance, coordination and controlled strength.'],
 ['Which safety measure is suitable for this traditional wrestling activity?','Practise with supervision and agreed rules',['Ignore the referee','Push others off unsafe surfaces','Continue after injury'],'Supervision, correct techniques and suitable surfaces reduce risk.'],
 ['How is lucha canaria different from football?','Competitors grapple rather than kick a ball',['Both use the same ball','Both require a goalpost','Both are always played on ice'],'Canarian wrestling uses controlled grappling and throws.'],
 ['Why should traditional sports be preserved?','To maintain cultural history and identity',['To remove all modern sport','To prevent safe participation','To eliminate community traditions'],'Traditional sport contributes to cultural identity and heritage.'],
 ['What is a relevant requirement when naming a researched sport in this school exam?','Write the sport name in Spanish',['Write the country in Latin','List only a coach','Give no sporting skill'],'The prompt asks for the sport in Spanish and a skill it requires.'],
 ['In a wrestling bout, why are agreed rules useful?','They support participant safety and fair play',['They eliminate all practice','They prevent all physical contact','They replace the need for a referee'],'Rules set clear expectations for safety and fairness.'],
 ['Which is an example of a cultural sport rather than a musical instrument?','La lucha canaria',['Una guitarra','Un piano','Un violín'],'La lucha canaria is a traditional wrestling sport.'],
 ['Which feature is visible in typical la lucha canaria action?','Two athletes attempt controlled holds and throws',['Players pass a football across a pitch','Athletes swim in separate lanes','Cyclists race on bicycles'],'The sport is a grappling form of wrestling.']
];
culture.forEach(([stem,correct,other,explanation])=>add('culture',stem,correct,other,explanation));
function build(topic,position,version){
 const bank=qs[topic],question=bank[(position+version*2)%bank.length],shift=(version*2+position+sections.indexOf(topic))%4;
 const opts=question.options.slice(shift).concat(question.options.slice(0,shift));
 return {...question,stem:(version?['During an end-of-term revision task: ','In a Spanish class practice: ','On a school sports worksheet: ','In a student quiz: '][version-1]:'')+question.stem,options:opts,answer:opts.indexOf(question.options[0])};
}
const papers=Array.from({length:5},(_,v)=>sections.flatMap((topic,i)=>Array.from({length:counts[i]},(_,j)=>build(topic,j,v))));
window.BSS_SPANISH={topics,sections,counts,papers,listeningBank:qs.listening,sports};
})();